const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB!');

    // Simple user model
    const User = mongoose.model('User', {
      username: String,
      password: String,
      role: String,
      currency: String,
      deviceID: String,
      approved: Boolean,
      email: String,
      createdAt: Date
    });

    // Check if admin exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      currency: 'USD',
      deviceID: 'admin-device',
      approved: true,
      email: 'admin@pointify.info',
      createdAt: new Date()
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('👉 Username: admin');
    console.log('👉 Password: admin123');
    console.log('🚀 You can now login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('💡 Make sure your MongoDB connection string in .env is correct!');
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

createAdmin();