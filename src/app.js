// src/app.js
const express = require("express");
const path = require("path");

const indexRoutes = require("./routes/index.routes");
const apiRoutes = require("./routes/api.routes");
const recommendRoutes = require("./routes/recommend.routes");

const app = express(); // ✅ đặt lên trước

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "public")));

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

// routes
app.use("/", indexRoutes);
app.use("/api/v1", apiRoutes);
app.use("/api/v1", recommendRoutes); // ✅ đặt sau khi app đã tạo

module.exports = app;