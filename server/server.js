import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/Error.js";
import privateRoutes from "./routes/private.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth/", authRoutes);
app.use("/api/private/", privateRoutes);
app.use(cors());

app.use(errorHandler);

const CONNECTION_URL = process.env.URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log("Sever is active on port " + PORT);
});
