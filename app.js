const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {server, app} = require('./socket')

const authRoute   = require("./routes/auth");
const messageRoute = require("./routes/messageRoute");
const userRoutes   = require("./routes/userRoute");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("Connected to database");})
.catch((err)=>{console.log("Connection failed",err); });

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoute);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
// app.use(express.static(path.join(__dirname, "../public")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend",  "/dist" ,"index.html"));
});

const Port = process.env.PORT || 3000;  

server.listen(Port, () => {
    console.log("Server is running on port", Port);
});

module.exports = {app, server};