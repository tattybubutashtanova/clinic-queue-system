const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "clinic-secret-key-2024";

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (simple and reliable)
let patients = [];
let doctors = [];
let timeSlots = [];
let appointments = [];

// Initialize default data
const initializeData = async () => {
  const departments = ["General", "Pediatrics", "Dentistry"];
  
  // Create a mock doctor
  const hashedDiscoveryPassword = await bcrypt.hash("1234", 10);
  doctors.push({
    id: "doc1",
    username: "doctor",
    password: hashedDiscoveryPassword,
    name: "Dr. John Doe",
    department: "General",
    email: "doctor@clinic.kg"
  });

  const timeRanges = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];
  
  departments.forEach(department => {
    timeRanges.forEach(time => {
      timeSlots.push({
        id: Date.now() + Math.random(),
        department,
        time,
        day: new Date().toISOString().slice(0, 10),
        isAvailable: true,
        maxPatients: 4,
        currentBookings: 0
      });
    });
  });
  
  console.log('📋 Initialized in-memory storage');
  console.log(`⏰ Created ${timeSlots.length} time slots`);
};

// Call initialize
initializeData().catch(err => console.error('Failed to initialize data:', err));

// Utility functions
const generateQueueNumber = (department, day) => {
  const departmentPatients = patients.filter(p => p.day === day && p.department === department);
  return departmentPatients.length + 1;
};

const calculatePosition = (patientId, department, day) => {
  const departmentPatients = patients.filter(p => 
    p.day === day && 
    p.department === department && 
    (p.status === "Waiting" || p.status === "In Progress")
  );
  const patient = departmentPatients.find(p => p.id === patientId);
  if (!patient) return 0;
  
  return departmentPatients.filter(p => p.queueNumber <= patient.queueNumber).length;
};

// Authentication middleware
const authenticateDoctor = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.doctor = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// API routes
// Authentication endpoints
app.post("/api/login-doctor", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const doctor = doctors.find(d => d.username === username);
    if (!doctor) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: doctor.id, username: doctor.username, department: doctor.department },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ 
      success: true, 
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        department: doctor.department,
        email: doctor.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// Time slot endpoints
app.get("/api/timeslots", (req, res) => {
  try {
    const { day, department } = req.query;
    let filteredSlots = timeSlots;

    if (day) {
      filteredSlots = filteredSlots.filter(s => s.day === day);
    }

    if (department) {
      filteredSlots = filteredSlots.filter(s => s.department === department);
    }

    res.json({ success: true, timeSlots: filteredSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch time slots" });
  }
});

app.post("/api/timeslots", authenticateDoctor, (req, res) => {
  try {
    const { department, time, day, maxPatients = 4 } = req.body;
    
    // Check if slot already exists
    const existingSlot = timeSlots.find(s => s.department === department && s.time === time && s.day === day);
    if (existingSlot) {
      return res.status(400).json({ success: false, message: "Time slot already exists" });
    }
    
    const newSlot = {
      id: Date.now() + Math.random(),
      department,
      time,
      day,
      maxPatients,
      currentBookings: 0,
      isAvailable: true,
      created_at: new Date().toISOString()
    };
    
    timeSlots.push(newSlot);
    
    res.json({ success: true, timeSlot: newSlot });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create time slot" });
  }
});

app.put("/api/timeslots/:id", authenticateDoctor, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const slotIndex = timeSlots.findIndex(s => s.id === parseFloat(id) || s.id === id);
    
    if (slotIndex === -1) {
      return res.status(404).json({ success: false, message: "Time slot not found" });
    }
    
    timeSlots[slotIndex] = { ...timeSlots[slotIndex], ...updates, updated_at: new Date().toISOString() };
    
    res.json({ success: true, timeSlot: timeSlots[slotIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update time slot" });
  }
});

app.delete("/api/timeslots/:id", authenticateDoctor, (req, res) => {
  try {
    const { id } = req.params;
    
    const slotIndex = timeSlots.findIndex(s => s.id === parseFloat(id) || s.id === id);
    
    if (slotIndex === -1) {
      return res.status(404).json({ success: false, message: "Time slot not found" });
    }

    // Check if there are active bookings
    if (timeSlots[slotIndex].currentBookings > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete slot with active bookings" });
    }
    
    timeSlots.splice(slotIndex, 1);
    
    res.json({ success: true, message: "Time slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete time slot" });
  }
});

// Patient endpoints
app.post("/api/register-patient", (req, res) => {
  try {
    const { name, department, time, day, phone, email, timeSlotId } = req.body;
    
    // Check if time slot exists and is available
    const slot = timeSlots.find(s => s.id === timeSlotId);
    
    if (!slot) {
      return res.status(400).json({ success: false, message: "Time slot not found" });
    }
    
    if (!slot.isAvailable || slot.currentBookings >= slot.maxPatients) {
      return res.status(400).json({ success: false, message: "Time slot is not available" });
    }
    
    // Generate queue number
    const queueNumber = generateQueueNumber(department, day);
    
    // Create patient
    const patient = {
      id: Date.now() + Math.random(),
      name,
      department,
      time,
      day,
      phone,
      email,
      timeSlotId,
      queueNumber,
      status: "Waiting",
      created_at: new Date().toISOString()
    };
    
    patients.push(patient);
    
    // Update time slot
    slot.currentBookings += 1;
    slot.isAvailable = slot.currentBookings < slot.maxPatients;
    
    // Create appointment
    const appointment = {
      id: Date.now() + Math.random(),
      patientId: patient.id,
      doctorId: null,
      timeSlotId: timeSlotId,
      status: "Scheduled",
      created_at: new Date().toISOString()
    };
    
    appointments.push(appointment);
    
    res.json({ 
      success: true, 
      patient: {
        ...patient,
        timeSlot: slot
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to register patient" });
  }
});

app.get("/api/patients", (req, res) => {
  try {
    const { day, department, status, doctorId } = req.query;
    let filteredPatients = patients;

    if (day) {
      filteredPatients = filteredPatients.filter(p => p.day === day);
    }

    if (department) {
      filteredPatients = filteredPatients.filter(p => p.department === department);
    }

    if (status) {
      filteredPatients = filteredPatients.filter(p => p.status === status);
    }

    // Sort by queue number and time
    filteredPatients.sort((a, b) => {
      if (a.queueNumber !== b.queueNumber) {
        return a.queueNumber - b.queueNumber;
      }
      return a.time.localeCompare(b.time);
    });

    res.json({ success: true, patients: filteredPatients });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch patients" });
  }
});

app.get("/api/patients/:id", (req, res) => {
  try {
    const patient = patients.find(p => p.id === req.params.id);
    
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({
      success: true,
      patient: {
        ...patient,
        position: calculatePosition(patient.id, patient.department, patient.day),
        timeSlot: timeSlots.find(s => s.id === patient.timeSlotId)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch patient" });
  }
});

app.put("/api/patients/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const patientIndex = patients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    patients[patientIndex] = { ...patients[patientIndex], ...updates, updated_at: new Date().toISOString() };

    res.json({
      success: true,
      patient: {
        ...patients[patientIndex],
        position: calculatePosition(patients[patientIndex].id, patients[patientIndex].department, patients[patientIndex].day),
        timeSlot: timeSlots.find(s => s.id === patients[patientIndex].timeSlotId)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update patient" });
  }
});

// Queue management endpoints
app.post("/api/call-next", (req, res) => {
  try {
    const { day, department } = req.body;
    
    if (!day) {
      return res.status(400).json({ success: false, message: "Day is required" });
    }

    let nextPatient = patients.find(p => 
      p.day === day && 
      p.department === department && 
      (p.status === "Waiting" || p.status === "In Progress")
    );

    if (!nextPatient) {
      return res.json({ success: false, message: "No patients in queue" });
    }

    // Update patient status to "In Progress"
    nextPatient.status = "In Progress";
    nextPatient.updated_at = new Date().toISOString();

    res.json({ success: true, patient: nextPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to call next patient" });
  }
});

// Statistics endpoint
app.get("/api/stats", (req, res) => {
  try {
    const { day } = req.query;
    const targetDay = day || new Date().toISOString().slice(0, 10);
    
    const dayPatients = patients.filter(p => p.day === targetDay);
    const stats = {
      totalPatients: dayPatients.length,
      waitingPatients: dayPatients.filter(p => p.status === "Waiting").length,
      inProgressPatients: dayPatients.filter(p => p.status === "In Progress").length,
      completedPatients: dayPatients.filter(p => p.status === "Completed").length,
      departmentStats: {}
    };

    const departments = ["General", "Pediatrics", "Dentistry"];
    departments.forEach(dept => {
      const deptPatients = dayPatients.filter(p => p.department === dept);
      stats.departmentStats[dept] = {
        total: deptPatients.length,
        waiting: deptPatients.filter(p => p.status === "Waiting").length,
        averageWaitTime: deptPatients.length > 0 ? "15 min" : "0 min"
      };
    });

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch statistics" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Static file serving (after API routes)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  // In development, serve static files from public directory
  app.use(express.static(path.join(__dirname, "public")));
  
  // Serve index.html for specific React routes only
  app.get(['/', '/login', '/register', '/doctor', '/patient'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🏥 Naryn Clinic Queue Server running on http://localhost:${PORT}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⏰ Time Slots initialized: ${timeSlots.length} slots created`);
});
