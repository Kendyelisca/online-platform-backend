const express = require("express");
const studentRouter = require("./student.router");
const router = express.Router();

// colocar las rutas aquí

router.use("/students", studentRouter);

module.exports = router;
