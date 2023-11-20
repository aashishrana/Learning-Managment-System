import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary"
import fs from "fs/promises"
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days login
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("Email already exist", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url:
        "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
    },
  });

  if (!user) {
    return next(new AppError("User registration failed please try again", 400));
  }

  // TODo file upload
  console.log('File Details > ', JSON.stringify(req.file));

  if (req.file) {
    console.log(req.file);
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder : "lms",
        width : 250,
        height : 250,
        gravity : "faces",
        crop : "fill"
      });

      if(result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // remove file from server
        fs.rm(`uploads/${req.file.filename}`)
      }

    } catch(e) {
      return next(
        new AppError(error || `file not uploaded , please try again`, 500)
      )

    }

  }

  await user.save();
  user.password = undefined;

  const token = await user.generateJWTToken();

  res.cookie("token", token, cookieOptions);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Email or password does not match", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 560));
  }
};

const logout = (req, res) => {
    res.cookie("token" , null, {
        secure : true,
        maxAge : 0,
        httpOnly : true
    });

    res.status(200).json({
        success : true,
        message : "User logged out successfully"
    })
};


const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: 'User details',
            user
        });
    } catch(e) {
        return next(new AppError('Failed to fetch profile details', 500));
    }
};


const forgotPassword = async(req, res) => {
  const {email} = req.body;

  if(!email) {
    return next(new AppError('Email is required' , 400));
  }

  const user = await User.findOne({email});
  if(!user) {
    return next(new AppError('Email not registered' , 400));
  }

  const resetToken = await user.generatePasswordResetToken();

  await user.save();

  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail(email, subject, message);

    res.status(200).json({
      success : true,
      message : `Reset password token has been sent to ${email} successfully`
    })
  } catch(e) {

    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    await user.save();
    return next(new AppError(e.message, 500));
  }
}


const resetPassword = () => {

}


export { 
  register, 
  login, 
  logout, 
  getProfile,
  forgotPassword,
  resetPassword
};
