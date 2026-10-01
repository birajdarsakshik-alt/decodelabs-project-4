const validateStudent = (req, res, next) => {
  const { name, email, course, year, skills } = req.body;

  if (!name || !email || !course || !year || !skills) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
      requiredFields: ["name", "email", "course", "year", "skills"]
    });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name must contain at least 2 characters"
    });
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  if (typeof course !== "string" || course.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid course"
    });
  }

  if (!["FY", "SY", "TY"].includes(year)) {
    return res.status(400).json({
      success: false,
      message: "Year must be FY, SY, or TY"
    });
  }

  if (!Array.isArray(skills) || skills.length === 0 || skills.some((skill) => typeof skill !== "string" || !skill.trim())) {
    return res.status(400).json({
      success: false,
      message: "Skills must be a non-empty array of text values"
    });
  }

  next();
};

module.exports = validateStudent;
