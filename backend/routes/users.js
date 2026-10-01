const express = require("express");
const router = express.Router();

const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/userController");

const validateStudent = require("../middleware/validation");

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", validateStudent, createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
