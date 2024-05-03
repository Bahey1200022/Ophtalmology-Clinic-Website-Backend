/**
 * Main application file for setting up the Express server and connecting to the database.
 * @module app
 * @requires express
 * @requires mongoose
 * @requires dotenv
 */

const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const entryRouter=require('./router/entryRouter');
const patientRouter=require('./router/patientsRouter');
const doctorRouter = require('./router/doctorsRouter');
const appointmentRouter = require('./router/appointmentRouter');
const billRouter = require('./router/billRouter');
const app = express();
const cors = require("cors");
app.use(cors());

/**
 * Connects to the MongoDB database and starts the Express server.
 * @async
 */
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    // Terminate the process if unable to connect to the database
    process.exit(1);
  }
}

connectToDatabase();

// Express session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());
app.use("/api", entryRouter);
app.use("/api", patientRouter);
app.use("/api", doctorRouter);
app.use("/api", appointmentRouter);
app.use("/api", billRouter);

//define routes

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// el 7eta deh ba3den

// Seeding the database if needed
if (process.env.SEED_DB === "true" && process.argv.includes("--seed")) {
  require("./utils/seeding");
}

