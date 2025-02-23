import express from "express";
import cors from "cors";
import dishesRoutes from "./routes/dishes";
import connectDB from "./db";
import dishRoutes from "./routes/mongoRoute"

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());


//app.use("/api/dishes", dishesRoutes);
app.use("/api/dishesMG", dishRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

