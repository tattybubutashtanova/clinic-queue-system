const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (will be replaced with Supabase)
let patients = [];
let doctors = [];
let timeSlots = [];
let appointments = [];

// Initialize default time slots
const initializeTimeSlots = () => {
  const departments = ["General", "Pediatrics", "Dentistry"];
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
        maxPatients: 4, // 4 patients per 30-minute slot
        currentBookings: 0
      });
    });
  });
};

initializeTimeSlots();

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

// Authentication endpoints
app.post("/api/login-doctor", (req, res) => {
  const { username, password, department } = req.body;
  
  // For demo purposes - in production, use Supabase Auth
  if (username === "doctor" && password === "1234") {
    const doctor = {
      id: 1,
      name: "Dr. John Doe",
      department: department || "General",
      email: "doctor@narynclinic.kg"
    };
    res.json({ 
      success: true, 
      doctor
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
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

    res.json({
      success: true,
      timeSlots: filteredSlots
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch time slots" });
  }
});

app.post("/api/timeslots", (req, res) => {
  try {
    const { department, time, day, maxPatients } = req.body;
    
    const newSlot = {
      id: Date.now(),
      department,
      time,
      day,
      isAvailable: true,
      maxPatients: maxPatients || 4,
      currentBookings: 0
    };

    timeSlots.push(newSlot);
    res.json({ success: true, timeSlot: newSlot });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create time slot" });
  }
});

app.put("/api/timeslots/:id", (req, res) => {
  try {
    const slotIndex = timeSlots.findIndex(s => s.id === parseInt(req.params.id));
    
    if (slotIndex === -1) {
      return res.status(404).json({ success: false, message: "Time slot not found" });
    }

    const updatedSlot = {
      ...timeSlots[slotIndex],
      ...req.body
    };

    timeSlots[slotIndex] = updatedSlot;
    res.json({ success: true, timeSlot: updatedSlot });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update time slot" });
  }
});

app.delete("/api/timeslots/:id", (req, res) => {
  try {
    const slotIndex = timeSlots.findIndex(s => s.id === parseInt(req.params.id));
    
    if (slotIndex === -1) {
      return res.status(404).json({ success: false, message: "Time slot not found" });
    }

    timeSlots.splice(slotIndex, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete time slot" });
  }
});

// Patient endpoints (updated for time slot booking)
app.post("/api/register-patient", (req, res) => {
  try {
    const { name, department, time, day, phone, email, timeSlotId } = req.body;
    
    // Validate required fields
    if (!name || !department || !day || !timeSlotId) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, department, day, and time slot are required" 
      });
    }

    // Check if time slot is available
    const timeSlot = timeSlots.find(s => s.id === timeSlotId);
    if (!timeSlot || !timeSlot.isAvailable || timeSlot.currentBookings >= timeSlot.maxPatients) {
      return res.status(400).json({ 
        success: false, 
        message: "Time slot is not available" 
      });
    }

    const queueNumber = generateQueueNumber(department, day);
    const patient = {
      id: Date.now(),
      name: name.trim(),
      department,
      time,
      day,
      phone: phone || "",
      email: email || "",
      timeSlotId,
      queueNumber,
      status: "Waiting",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    patients.push(patient);

    // Update time slot booking count
    timeSlot.currentBookings++;
    if (timeSlot.currentBookings >= timeSlot.maxPatients) {
      timeSlot.isAvailable = false;
    }

    res.json({
      success: true,
      patient: {
        id: patient.id,
        queueNumber: patient.queueNumber,
        position: calculatePosition(patient.id, department, day),
        status: patient.status,
        timeSlot: {
          time: timeSlot.time,
          department: timeSlot.department
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed" });
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

    // Sort by time and queue number
    filteredPatients.sort((a, b) => {
      if (a.time !== b.time) return a.time.localeCompare(b.time);
      return a.queueNumber - b.queueNumber;
    });

    res.json({
      success: true,
      patients: filteredPatients.map(p => ({
        ...p,
        position: calculatePosition(p.id, p.department, p.day),
        timeSlot: timeSlots.find(s => s.id === p.timeSlotId)
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch patients" });
  }
});

app.get("/api/patients/:id", (req, res) => {
  try {
    const patient = patients.find(p => p.id === parseInt(req.params.id));
    
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
    const patientIndex = patients.findIndex(p => p.id === parseInt(req.params.id));
    
    if (patientIndex === -1) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const updatedPatient = {
      ...patients[patientIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    patients[patientIndex] = updatedPatient;

    res.json({
      success: true,
      patient: {
        ...updatedPatient,
        position: calculatePosition(updatedPatient.id, updatedPatient.department, updatedPatient.day),
        timeSlot: timeSlots.find(s => s.id === updatedPatient.timeSlotId)
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
      p.status === "Waiting" && 
      p.day === day &&
      (!department || p.department === department)
    );

    if (nextPatient) {
      nextPatient.status = "In Progress";
      nextPatient.updatedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      patient: nextPatient ? {
        ...nextPatient,
        position: calculatePosition(nextPatient.id, nextPatient.department, nextPatient.day),
        timeSlot: timeSlots.find(s => s.id === nextPatient.timeSlotId)
      } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to call next patient" });
  }
});

app.post("/api/complete-patient/:id", (req, res) => {
  try {
    const patient = patients.find(p => p.id === parseInt(req.params.id));
    
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    patient.status = "Completed";
    patient.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      patient: {
        ...patient,
        position: calculatePosition(patient.id, patient.department, patient.day),
        timeSlot: timeSlots.find(s => s.id === patient.timeSlotId)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to complete patient" });
  }
});

// Department endpoints
app.get("/api/departments", (req, res) => {
  res.json({
    success: true,
    departments: [
      { id: "general", name: "General", description: "General medical consultation" },
      { id: "pediatrics", name: "Pediatrics", description: "Child healthcare" },
      { id: "dentistry", name: "Dentistry", description: "Dental care and oral surgery" }
    ]
  });
});

// Statistics endpoints
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
      departmentStats: {},
      timeSlotStats: {
        totalSlots: timeSlots.filter(s => s.day === targetDay).length,
        availableSlots: timeSlots.filter(s => s.day === targetDay && s.isAvailable).length,
        bookedSlots: timeSlots.filter(s => s.day === targetDay && !s.isAvailable).length
      }
    };

    // Calculate department-wise stats
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

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  // In development, serve static files from public directory
  app.use(express.static(path.join(__dirname, "public")));
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🏥 Naryn Clinic Queue Server running on http://localhost:${PORT}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⏰ Time Slots initialized: ${timeSlots.length} slots created`);
});