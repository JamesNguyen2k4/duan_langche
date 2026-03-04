// src/services/gemini.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

function stripToJson(text) {
  let t = (text || "").trim();

  if (t.startsWith("```")) {
    t = t.replace(/```json/g, "").replace(/```/g, "").trim();
  }

  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last !== -1) t = t.slice(first, last + 1);

  return t;
}

function normalizeResult(obj) {
  return {
    timeDescription: obj?.timeDescription || "",
    route: Array.isArray(obj?.route) ? obj.route : [],
    teas: Array.isArray(obj?.teas) ? obj.teas : [],
    explanation: obj?.explanation || ""
  };
}

async function getGeminiRecommendation({ profile, villages, teaTypes, activities }) {
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY in .env");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // rút gọn dữ liệu để prompt không quá dài
  const vMini = (villages || []).map(v => ({
    id: v.id, name: v.name, code: v.code,
    description: v.description,
    address: v.address
  }));

  const prompt = `
Bạn là trợ lý du lịch chuyên về Làng Chè Thái Nguyên.
Bạn phải dựa trên dữ liệu cung cấp, KHÔNG bịa tên làng chè không có trong dữ liệu.

PROFILE người dùng (JSON):
${JSON.stringify(profile)}

DANH SÁCH LÀNG CHÈ (JSON):
${JSON.stringify(vMini)}

DANH SÁCH LOẠI TRÀ (JSON):
${JSON.stringify(teaTypes || [])}

DANH SÁCH HOẠT ĐỘNG theo mục đích (JSON):
${JSON.stringify(activities || {})}

Hãy trả về JSON THUẦN (không markdown, không \`\`\`) theo đúng schema:
{
  "timeDescription": "mô tả thời lượng",
  "route": [
    {"step": 1, "title": "....", "description": "...."},
    {"step": 2, "title": "....", "description": "...."},
    {"step": 3, "title": "....", "description": "...."}
  ],
  "teas": [
    {"name": "....", "description": "....", "icon": "🍵"}
  ],
  "explanation": "Giải thích ngắn gọn vì sao chọn tuyến và loại trà"
}

Yêu cầu:
- route: 3-5 bước tùy theo thời gian profile.time
- teas: 1-2 loại trà phù hợp nhất (nếu teaTypes ít thì vẫn chọn từ đó)
- explanation: 2-4 câu, nhắc đúng weather/taste/purpose
Chỉ trả về JSON.
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const jsonText = stripToJson(raw);
  const parsed = JSON.parse(jsonText);
  return normalizeResult(parsed);
}

module.exports = { getGeminiRecommendation };