import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY MUST BE DEFINED');
  }
  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI MUST BE DEFINED');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb instance...");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("listening on port 3000!!");
  });
}
start();
