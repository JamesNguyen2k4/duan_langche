// src/controllers/recommend.controller.js
const path = require("path");
const fs = require("fs");

function readJson(relPath) {
  const filePath = path.join(__dirname, "..", "data", relPath);
  const txt = fs.readFileSync(filePath, "utf-8").trim();
  return txt ? JSON.parse(txt) : (relPath.endsWith(".json") ? [] : {});
}

/**
 * Chọn danh sách trà theo taste (strong/light/fragrant) + ưu tiên đúng villageCode.
 * - Trả về NHIỀU hơn 2 loại (mặc định trả hết list phù hợp).
 * - Có sort theo "gu" để loại phù hợp lên trước.
 */
function pickTeasByTaste(teaTypes, taste, villageCode) {
  const list = Array.isArray(teaTypes) ? teaTypes : [];
  const tasteKey = String(taste || "").toLowerCase();
  const vCode = String(villageCode || "").toUpperCase();

  const hasTag = (t, tag) =>
    Array.isArray(t.tasteTags) &&
    t.tasteTags.map(x => String(x).toLowerCase()).includes(tag);

  // 1) Lọc theo làng trước (ưu tiên đúng làng)
  let pool = list.filter(t => String(t.originVillageCode || "").toUpperCase() === vCode);
  if (pool.length === 0) pool = list;

  // 2) Lọc theo tasteTag
  let matched = pool.filter(t => hasTag(t, tasteKey));

  // Nếu làng hiện chưa có loại nào match taste -> fallback theo taste ở toàn bộ list
  if (matched.length === 0) {
    matched = list.filter(t => hasTag(t, tasteKey));
  }

  // Nếu vẫn rỗng (data sai) -> fallback pool
  if (matched.length === 0) {
    matched = pool;
  }

  // 3) Score để sort theo "gu"
  const score = (t) => {
    const isStrong = hasTag(t, "strong");
    const isLight = hasTag(t, "light");
    const isFragrant = hasTag(t, "fragrant");

    if (tasteKey === "strong") {
      // strong-only > strong+light > strong
      if (isStrong && !isLight && !isFragrant) return 100;
      if (isStrong && isLight) return 80;
      if (isStrong) return 70;
      return 0;
    }

    if (tasteKey === "light") {
      // light-only > fragrant+light > light+strong > light
      if (isLight && !isStrong && !isFragrant) return 100;
      if (isFragrant && isLight) return 90;
      if (isLight && isStrong) return 70;
      if (isLight) return 60;
      return 0;
    }

    if (tasteKey === "fragrant") {
      // fragrant+light > fragrant-only
      if (isFragrant && isLight) return 100;
      if (isFragrant) return 90;
      return 0;
    }

    return 0;
  };

  matched.sort((a, b) => score(b) - score(a));

  // ✅ Trả nhiều hơn 2 loại:
  // - Nếu bạn muốn giới hạn để UI không quá dài, set MAX_TEA_RESULTS = 5 (hoặc số bạn thích)
  const MAX_TEA_RESULTS = null; // null = không giới hạn
  const picked = MAX_TEA_RESULTS ? matched.slice(0, MAX_TEA_RESULTS) : matched;

  return picked.map(t => ({
    id: t.id || "",
    name: t.name || "",
    description: t.profile
      ? `${t.profile.aroma || ""}${t.profile.taste ? " · " + t.profile.taste : ""}${t.profile.aftertaste ? " · " + t.profile.aftertaste : ""}`.trim()
      : (t.description || ""),
    icon: t.icon || "🍵"
  }));
}

exports.recommend = async (req, res) => {
  try {
    const body = req.body || {};

    const villageCode = String(body.villageCode || "").trim().toUpperCase();
    const taste = String(body.taste || "").trim(); // strong|light|fragrant

    if (!villageCode) {
      return res.status(400).json({ detail: "Thiếu villageCode (mã làng chè)." });
    }
    if (!taste) {
      return res.status(400).json({ detail: "Thiếu taste (thói quen uống trà)." });
    }

    const villages = readJson("villages.json");
    const teaTypes = readJson("teaTypes.json");
    const routes = readJson("routes.json");

    const village = (villages || []).find(v => String(v.code || "").toUpperCase() === villageCode);
    if (!village) {
      return res.status(404).json({ detail: `Không tìm thấy làng chè với mã ${villageCode}` });
    }

    const byVillage = routes?.[villageCode];
    const routePack = byVillage?.full;

    if (!routePack) {
      return res.status(404).json({
        detail: `Chưa có tuyến full cho làng ${villageCode}.`
      });
    }

    const steps = Array.isArray(routePack.steps) ? routePack.steps : [];
    if (steps.length < 3) {
      return res.status(500).json({
        detail: `Tuyến full của ${villageCode} chưa đủ bước trong routes.json`
      });
    }

    const teas = pickTeasByTaste(teaTypes, taste, villageCode);

    const explanation =
      `Đây là tuyến trải nghiệm đầy đủ tại ${village.name}, ` +
      `bao gồm khám phá văn hóa trà, check-in đồi chè, trải nghiệm làm trà, thưởng trà và mua quà mang về. ` +
      `Loại trà được gợi ý dựa trên thói quen uống trà "${taste}".`;

    return res.json({
      village: { code: villageCode, name: village.name },
      weatherSuggestion: routePack.weatherSuggestion || [],
      route: steps.map((s, idx) => ({
        step: idx + 1,
        title: s.title || "",
        where: s.where || "",
        what: s.what || "",
        durationMin: s.durationMin ?? null
      })),
      teas,
      explanation
    });
  } catch (err) {
    console.error("[RECOMMEND API ERROR]", err);
    res.status(500).json({ detail: err.message || "Recommend failed" });
  }
};