const studentForm = document.getElementById("studentForm");
const studentId = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const yearInput = document.getElementById("year");
const skillsInput = document.getElementById("skills");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const formTitle = document.getElementById("formTitle");
const studentList = document.getElementById("studentList");
const studentCount = document.getElementById("studentCount");
const emptyState = document.getElementById("emptyState");
const loading = document.getElementById("loading");
const message = document.getElementById("message");
const refreshButton = document.getElementById("refreshButton");
const apiStatus = document.getElementById("apiStatus");
const statusDot = apiStatus.querySelector(".status-dot");

let students = [];
let messageTimer;

const setApiStatus = (online, text) => {
  statusDot.style.background = online ? "#22c55e" : "#ef4444";
  apiStatus.lastChild.textContent = ` ${text}`;
};

const showMessage = (text, type = "success") => {
  clearTimeout(messageTimer);
  message.textContent = text;
  message.className = `message ${type}`;
  messageTimer = setTimeout(() => {
    message.classList.add("hidden");
  }, 3500);
};

const setLoading = (state) => {
  loading.classList.toggle("hidden", !state);
  refreshButton.disabled = state;
};

const resetForm = () => {
  studentForm.reset();
  studentId.value = "";
  formTitle.textContent = "Add Student";
  submitButton.textContent = "Add Student";
  cancelEditButton.classList.add("hidden");
};

const renderStudents = () => {
  studentList.replaceChildren();
  studentCount.textContent = students.length;
  emptyState.classList.toggle("hidden", students.length !== 0);

  students.forEach((student) => {
    const card = document.createElement("article");
    card.className = "student-card";

    const top = document.createElement("div");
    top.className = "student-top";

    const name = document.createElement("h3");
    name.className = "student-name";
    name.textContent = student.name;

    const id = document.createElement("span");
    id.className = "student-id";
    id.textContent = `#${student.id}`;

    top.append(name, id);

    const meta = document.createElement("div");
    meta.className = "student-meta";
    const email = document.createElement("span");
    email.textContent = student.email;
    const course = document.createElement("span");
    course.textContent = `${student.course} • ${student.year}`;
    meta.append(email, course);

    const skills = document.createElement("div");
    skills.className = "skills";
    student.skills.forEach((skillText) => {
      const skill = document.createElement("span");
      skill.className = "skill";
      skill.textContent = skillText;
      skills.appendChild(skill);
    });

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.className = "button button-secondary button-small";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => startEdit(student));

    const deleteButton = document.createElement("button");
    deleteButton.className = "button button-danger button-small";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteStudent(student.id));

    actions.append(editButton, deleteButton);
    card.append(top, meta, skills, actions);
    studentList.appendChild(card);
  });
};

const loadStudents = async () => {
  setLoading(true);

  try {
    const response = await fetch("/api/students");
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to load students");
    }

    students = result.data;
    renderStudents();
    setApiStatus(true, "API Connected");
  } catch (error) {
    setApiStatus(false, "API Error");
    showMessage(error.message || "Unable to load students", "error");
  } finally {
    setLoading(false);
  }
};

const startEdit = (student) => {
  studentId.value = student.id;
  nameInput.value = student.name;
  emailInput.value = student.email;
  courseInput.value = student.course;
  yearInput.value = student.year;
  skillsInput.value = student.skills.join(", ");
  formTitle.textContent = "Edit Student";
  submitButton.textContent = "Update Student";
  cancelEditButton.classList.remove("hidden");
  nameInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const deleteStudent = async (id) => {
  if (!window.confirm("Are you sure you want to delete this student?")) return;

  try {
    const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete student");
    }

    showMessage(result.message);
    await loadStudents();
  } catch (error) {
    showMessage(error.message || "Unable to delete student", "error");
  }
};

studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const skills = skillsInput.value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value.trim(),
    year: yearInput.value,
    skills
  };

  const id = studentId.value;
  const isEditing = Boolean(id);
  const url = isEditing ? `/api/students/${id}` : "/api/students";
  const method = isEditing ? "PUT" : "POST";

  submitButton.disabled = true;
  submitButton.textContent = isEditing ? "Updating..." : "Adding...";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Request failed");
    }

    showMessage(result.message);
    resetForm();
    await loadStudents();
  } catch (error) {
    showMessage(error.message || "Unable to save student", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = studentId.value ? "Update Student" : "Add Student";
  }
});

cancelEditButton.addEventListener("click", resetForm);
refreshButton.addEventListener("click", loadStudents);

loadStudents();
