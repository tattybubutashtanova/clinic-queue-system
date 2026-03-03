const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic-queue', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Initialize default data
    await initializeDefaultData();
    
  } catch (error) {
    isConnected = false;
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Continuing without MongoDB - using in-memory storage');
  }
  
  return isConnected;
};

const initializeDefaultData = async () => {
  const Department = require('../models/Department');
  const TimeSlot = require('../models/TimeSlot');
  
  try {
    // Create default departments if they don't exist
    const departments = [
      { name: 'General', description: 'General medical consultations' },
      { name: 'Pediatrics', description: 'Children healthcare' },
      { name: 'Dentistry', description: 'Dental care and treatments' }
    ];

    for (const dept of departments) {
      const exists = await Department.findOne({ name: dept.name });
      if (!exists) {
        await Department.create(dept);
        console.log(`📋 Created department: ${dept.name}`);
      }
    }

    // Create default time slots for today if they don't exist
    const today = new Date().toISOString().slice(0, 10);
    const timeRanges = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    for (const department of departments) {
      for (const time of timeRanges) {
        const exists = await TimeSlot.findOne({
          department: department.name,
          day: today,
          time: time
        });

        if (!exists) {
          await TimeSlot.create({
            department: department.name,
            day: today,
            time: time,
            maxPatients: 4,
            currentBookings: 0,
            isAvailable: true
          });
        }
      }
    }

    console.log('⏰ Time slots initialized for today');
    
  } catch (error) {
    console.error('❌ Error initializing default data:', error.message);
  }
};

// Export connection status and models
module.exports = {
  connectDB,
  isConnected: () => isConnected
};
