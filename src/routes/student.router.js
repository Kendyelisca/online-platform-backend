const {
  getAll,
  create,
  getOne,
  remove,
  update,
  getLoggedUser,
  login,
} = require("../controllers/student.controllers");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT");

const studentRouter = express.Router();

studentRouter.route("/").get(getAll).post(create);
studentRouter.route("/me").get(getLoggedUser);
studentRouter.route("/:id").get(getOne).delete(verifyJWT, remove).put(update);
studentRouter.route("/login").post(login);

module.exports = studentRouter;
