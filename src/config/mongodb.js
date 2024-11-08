// mongodb.js
import mongoose from 'mongoose';

const MONGODB_URL = 'mongodb+srv://tantuan0162:nguyentantuan@cluster0-nguyentantuan.juvxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-nguyentantuan';
const DATABASE_NAME = 'GearShop_database_nguyentantuan';

export const CONNECT_DB = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      dbName: DATABASE_NAME,
    });
    console.log('Connected to Mongoose database');
  } catch (error) {
    console.error('Mongoose connection error:', error);
    process.exit(1);
  }
};
