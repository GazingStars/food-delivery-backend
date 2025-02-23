import mongoose from "mongoose";

const mongoURL: string = "mongodb://127.0.0.1:27017/CafeBar";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURL);
    console.log(`MongoDB подключен!`);
  } catch (error) {
    console.error(`Ошибка подклчения к БД`, error);
    process.exit();
  }
};

export default connectDB;