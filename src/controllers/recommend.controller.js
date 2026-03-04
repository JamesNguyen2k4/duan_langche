const path = require("path");
const fs = require("fs");
const { getGeminiRecommendation } = require("../services/gemini.service");

function readJson(relPath) {
  const filePath = path.join(__dirname, "..", "data", relPath);
  const txt = fs.readFileSync(filePath, "utf-8").trim();
  return txt ? JSON.parse(txt) : (relPath.endsWith(".json") ? [] : {});
}

exports.recommend = async (req, res) => {
  try {
    const profile = req.body || {};

    const villages = readJson("villages.json");
    const teaTypes = readJson("teaTypes.json");
    const activities = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "activities.json"), "utf-8"));

    const out = await getGeminiRecommendation({ profile, villages, teaTypes, activities });
    res.json(out);
  } catch (err) {
    console.error("[RECOMMEND API ERROR]", err);
    res.status(500).json({ detail: err.message || "Recommend failed" });
  }
};