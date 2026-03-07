const path = require("path");
const fs = require("fs");

function readJson(relPath, fallback) {
  const filePath = path.join(__dirname, "..", "data", relPath);
  const raw = fs.readFileSync(filePath, "utf-8").trim();
  if (!raw) return fallback;      // file rỗng => trả default
  return JSON.parse(raw);
}

exports.getVillages = (req, res) => res.json(readJson("villages.json", []));
exports.getTeaTypes = (req, res) => res.json(readJson("teaTypes.json", []));
