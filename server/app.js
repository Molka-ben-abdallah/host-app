const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

//const cors = require("cors"); app.use(cors({ origin: "*" }));
// app
const app = express();

//db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERROR", err));

//middleware
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));

//routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", require("./routes/authRoutes"));

// Use routes
//port
const port = process.env.PORT || 5000;

//listener
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
