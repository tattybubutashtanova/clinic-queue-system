const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let patients = []; // memory storage

// Doctor login
app.post("/api/login-doctor", (req, res) => {
  const { username, password } = req.body;
  res.json({ success: username === "doctor" && password === "1234" });
});

// Register patient
app.post("/api/register-patient", (req, res) => {
  const { name, department, time, day } = req.body;
  const queueNumber = patients.filter(p => p.day === day && p.department === department).length + 1;

  const patient = {
    id: Date.now(),
    name,
    department,
    time,
    day,
    queueNumber,
    status: "Waiting"
  };

  patients.push(patient);

  res.json({
    success: true,
    id: patient.id,
    queueNumber: patient.queueNumber,
    position: queueNumber
  });
});

// Get patients
app.get("/api/patients", (req, res) => {
  const day = req.query.day || new Date().toISOString().slice(0,10);
  res.json(patients.filter(p => p.day === day));
});

// Call next patient
app.post("/api/call-next", (req, res) => {
  const { day } = req.body;
  const nextPatient = patients.find(p => p.status === "Waiting" && p.day === day);
  if (nextPatient) nextPatient.status = "In Progress";
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});