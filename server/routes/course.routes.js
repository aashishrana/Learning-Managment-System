import { Router } from "express";
import { getAllCourses, getLecturesByCourseId } from "../controllers/course.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";
const router = new Router();

router.route('/')
     .get( getAllCourses);

router.route("/:id" )
    .get(isLoggedIn , getLecturesByCourseId);

export default router;