const path = require("path");
const fs = require("fs");

function readJson(relPath) {
  const filePath = path.join(__dirname, "..", "data", relPath);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

exports.getVillages = (req, res) => res.json(readJson("villages.json"));
exports.getTeaTypes = (req, res) => res.json(readJson("teaTypes.json"));
exports.getActivities = (req, res) => res.json(readJson("activities.json"));