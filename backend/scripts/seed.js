require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const existing = await Admin.findOne({ email: 'admin@mock.test' });
    if (existing) {
      console.log('Admin already exists. Skipping seed.');
    } else {
      const admin = new Admin({ email: 'admin@mock.test', password: 'Admin@123' });
      await admin.save();
      console.log('✅ Default admin created: admin@mock.test / Admin@123');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
