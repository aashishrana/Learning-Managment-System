const app = require("./app.js");

const PORT = process.env.PROCESS || 5000;

app.listen(PORT, () => {
    console.log(`APP is running at http:localhost : ${PORT}`);
});