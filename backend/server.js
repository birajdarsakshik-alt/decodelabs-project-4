const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const userRoutes = require("./routes/users");
app.use("/api/students", userRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DECodelabs API is running",
    status: "healthy"
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    name: "DECodelabs Student Management API",
    version: "2.0.0",
    project: "DecodeLabs Project 4 - Frontend & Backend Integration",
    endpoints: {
      health: "GET /api/health",
      students: "GET /api/students",
      studentById: "GET /api/students/:id",
      createStudent: "POST /api/students",
      updateStudent: "PUT /api/students/:id",
      deleteStudent: "DELETE /api/students/:id"
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`DECodelabs Project 4 running at http://localhost:${PORT}`);
});
