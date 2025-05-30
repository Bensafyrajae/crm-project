import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection}`);
  } catch (error) {
    console.error(`Errordb: ${error.message}`);
    process.exit(1);
  }
}; 

export default connectDB;
