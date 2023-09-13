const catchError = require("../utils/catchError");
const { student } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getAll = catchError(async (req, res) => {
  try {
    console.log("Attempting to fetch all students...");
    const results = await student.findAll();
    console.log("Fetched all students successfully.");
    return res.json(results);
  } catch (error) {
    console.error("Error fetching all students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const create = catchError(async (req, res) => {
  try {
    console.log("Creating a new student...");
    const { firstName, lastName, userName, email, password } = req.body;

    // Check if a password is provided
    if (!password) {
      console.error("Error creating a new student: Password is required.");
      return res.status(400).json({ message: "Password is required" });
    }

    // Hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await student.create({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
    });

    console.log("Student created successfully.");
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating a new student:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const getOne = catchError(async (req, res) => {
  try {
    const { id } = req.params;

    // Find the student by ID
    const result = await student.findByPk(id);

    // Check if the student was found
    if (!result) {
      console.log(`Student with ID ${id} not found.`);
      return res.sendStatus(404);
    }

    console.log(`Fetched student with ID ${id} successfully.`);
    return res.json(result);
  } catch (error) {
    console.error("Error fetching a student:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await student.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await student.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});
const getLoggedUser = catchError(async (req, res) => {
  const user = req.student;
  return res.json(user);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;
  const user = await student.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "invalid credentials" });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: "invalid credentials" });
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return res.json({ user, token });
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  getLoggedUser,
  login,
};
