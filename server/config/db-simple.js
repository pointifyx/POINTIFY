// Simple file-based database for testing
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../../data.json');

const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {
    return { users: [], agents: [], sales: [], products: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Create admin user directly
const createAdminDirectly = async () => {
  const db = readDB();
  
  const existingAdmin = db.users.find(u => u.username === 'admin');
  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = {
    id: 'admin-' + Date.now(),
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
    currency: 'USD',
    deviceID: 'admin-device',
    approved: true,
    email: 'jaallemagan@gmail.com',
    createdAt: new Date()
  };

  db.users.push(adminUser);
  writeDB(db);
  
  console.log('✅ Admin user created successfully!');
  console.log('👉 Username: admin');
  console.log('👉 Password: admin123');
  console.log('🚀 You can now login!');
};

module.exports = { readDB, writeDB, createAdminDirectly };