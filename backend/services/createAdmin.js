import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Load environment variables so we can read MONGO_DB_URI
dotenv.config();

// You can change these defaults, or override them via environment variables
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@ecotrack.local';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123456';
const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || 'Default Admin';

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_DB_URI;

    if (!mongoUri) {
      console.error('Error: MONGO_DB_URI is not defined in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if an admin with this email already exists
    let user = await User.findOne({ email: DEFAULT_ADMIN_EMAIL }).select('+password');

    if (user) {
      console.log(`Admin user with email ${DEFAULT_ADMIN_EMAIL} already exists. Updating credentials...`);

      // Update basic fields
      user.fullName = DEFAULT_ADMIN_NAME;
      user.role = 'admin';

      // Manually hash new password because findOne + save with select:false
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12);
      user.password = hashedPassword;

      await user.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log(`Creating new admin user with email ${DEFAULT_ADMIN_EMAIL}...`);

      // Use create so that schema hooks run as normal (and password is hashed)
      user = await User.create({
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        fullName: DEFAULT_ADMIN_NAME,
        role: 'admin',
      });

      console.log('Admin user created successfully.');
    }

    console.log('---------------------------------------------');
    console.log('Default admin credentials:');
    console.log(`Email   : ${DEFAULT_ADMIN_EMAIL}`);
    console.log(`Password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log('---------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
    process.exit(1);
  }
};

createAdmin();


