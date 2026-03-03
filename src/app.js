const express = require("express");
const path = require("path");

const indexRoutes = require("./routes/index.routes");
const apiRoutes = require("./routes/api.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, "..", "public")));

// view engine
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

// routes
app.use("/", indexRoutes);
app.use("/api/v1", apiRoutes);

module.exports = app;