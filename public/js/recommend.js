// public/js/recommend.js
export function initRecommend() {
  const form = document.getElementById("recommend-form");
  const results = document.getElementById("recommend-results"); // <-- đúng id này
  if (!form || !results) return;

  function renderResult(data) {
    const routeHtml = (data.route || []).map(step => `
      <div class="result-card">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            ${step.step}
          </div>
          <div>
            <h5 class="font-semibold text-green-800">${step.title}</h5>
            <p class="text-gray-600 text-sm">${step.description}</p>
          </div>
        </div>
      </div>
    `).join("");

    const teasHtml = (data.teas || []).map(tea => `
      <div class="tea-card">
        <div class="flex items-start gap-3">
          <span class="text-3xl">${tea.icon || "🍵"}</span>
          <div>
            <h5 class="font-semibold text-amber-800">${tea.name || ""}</h5>
            <p class="text-gray-600 text-sm">${tea.description || ""}</p>
          </div>
        </div>
      </div>
    `).join("");

    results.innerHTML = `
      <div>
        <h3 class="font-display text-2xl font-bold text-green-800 mb-2">✨ Kết Quả Gợi Ý</h3>
        <p class="text-gray-600 mb-6">Dựa trên sở thích của bạn</p>

        <div class="mb-6">
          <h4 class="font-bold text-green-700 mb-3 flex items-center gap-2">
            <span class="text-xl">🗺️</span> Tuyến Trải Nghiệm Đề Xuất
          </h4>
          ${routeHtml || `<p class="text-gray-600">Chưa có tuyến gợi ý.</p>`}
        </div>

        <div class="mb-6">
          <h4 class="font-bold text-amber-700 mb-3 flex items-center gap-2">
            <span class="text-xl">🍵</span> Loại Trà Phù Hợp
          </h4>
          ${teasHtml || `<p class="text-gray-600">Chưa có gợi ý loại trà.</p>`}
        </div>

        <div class="bg-white rounded-xl p-4 border-2 border-green-200">
          <h4 class="font-bold text-green-700 mb-2 flex items-center gap-2">
            <span>💡</span> Tại sao chọn như vậy?
          </h4>
          <p class="text-gray-600 text-sm leading-relaxed">${data.explanation || "—"}</p>
        </div>
      </div>
    `;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      time: document.getElementById("input-time")?.value,
      weather: document.getElementById("input-weather")?.value,
      taste: document.getElementById("input-taste")?.value,
      purpose: document.getElementById("input-purpose")?.value
    };

    results.innerHTML = `<div class="result-card">Đang tạo gợi ý...</div>`;

    try {
      const res = await fetch("/api/v1/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.detail || "Không tạo được gợi ý");

      renderResult(json);
    } catch (err) {
      results.innerHTML = `
        <div style="border:1px solid #fca5a5;background:#fff;padding:12px;border-radius:12px">
          <b style="color:#b91c1c">❌ Không tạo được gợi ý</b>
          <div style="margin-top:6px">${err.message || err}</div>
        </div>
      `;
      console.error("[RECOMMEND ERROR]", err);
    }
  });
}