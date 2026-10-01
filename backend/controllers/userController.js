const db = require("../../database/database");

const parseStudent = (student) => ({
  ...student,
  skills: JSON.parse(student.skills)
});

const getStudents = (req, res) => {
  db.all("SELECT * FROM students ORDER BY id ASC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch students",
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows.map(parseStudent)
    });
  });
};

const getStudentById = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Student ID must be a positive integer"
    });
  }

  db.get("SELECT * FROM students WHERE id = ?", [id], (err, student) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch student",
        error: err.message
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: parseStudent(student)
    });
  });
};

const createStudent = (req, res) => {
  const { name, email, course, year, skills } = req.body;

  db.run(
    `INSERT INTO students (name, email, course, year, skills) VALUES (?, ?, ?, ?, ?)`,
    [name.trim(), email.trim(), course.trim(), year, JSON.stringify(skills)],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(409).json({
            success: false,
            message: "Email already exists"
          });
        }

        return res.status(500).json({
          success: false,
          message: "Failed to create student",
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: {
          id: this.lastID,
          name: name.trim(),
          email: email.trim(),
          course: course.trim(),
          year,
          skills
        }
      });
    }
  );
};

const updateStudent = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Student ID must be a positive integer"
    });
  }

  const { name, email, course, year, skills } = req.body;

  db.get("SELECT * FROM students WHERE id = ?", [id], (err, existingStudent) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to find student",
        error: err.message
      });
    }

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const updatedName = name === undefined ? existingStudent.name : name.trim();
    const updatedEmail = email === undefined ? existingStudent.email : email.trim();
    const updatedCourse = course === undefined ? existingStudent.course : course.trim();
    const updatedYear = year === undefined ? existingStudent.year : year;
    const updatedSkills = skills === undefined ? JSON.parse(existingStudent.skills) : skills;

    db.run(
      `UPDATE students SET name = ?, email = ?, course = ?, year = ?, skills = ? WHERE id = ?`,
      [updatedName, updatedEmail, updatedCourse, updatedYear, JSON.stringify(updatedSkills), id],
      (updateErr) => {
        if (updateErr) {
          if (updateErr.message.includes("UNIQUE")) {
            return res.status(409).json({
              success: false,
              message: "Email already exists"
            });
          }

          return res.status(500).json({
            success: false,
            message: "Failed to update student",
            error: updateErr.message
          });
        }

        res.status(200).json({
          success: true,
          message: "Student updated successfully",
          data: {
            id,
            name: updatedName,
            email: updatedEmail,
            course: updatedCourse,
            year: updatedYear,
            skills: updatedSkills
          }
        });
      }
    );
  });
};

const deleteStudent = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Student ID must be a positive integer"
    });
  }

  db.run("DELETE FROM students WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete student",
        error: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });
  });
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
