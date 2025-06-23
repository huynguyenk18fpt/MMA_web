require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes"); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/admin", adminRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
})

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Could not connect to MongoDB", err);
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
})







