// public/js/recommend.js
export function initRecommend(data) {
    const form = document.getElementById("recommend-form");
    const results = document.getElementById("recommend-results");
    if (!form || !results) return;
  
    // giữ data trong scope
    const teaTypes = data.teaTypes || [];
    const activities = data.activities || {};
  
    function getActivityDescription(activity, weather) {
      const descriptions = {
        "Check-in đồi chè panorama": weather === "sunny"
          ? "Ánh nắng đẹp, thời điểm lý tưởng để chụp ảnh"
          : "Khung cảnh mờ sương thơ mộng",
        "Chụp ảnh với người dân địa phương": "Lưu giữ kỷ niệm với người làm chè",
        "Quay video trải nghiệm": "Ghi lại hành trình khám phá của bạn",
        "Tham quan nhà trưng bày trà": "Tìm hiểu lịch sử và các loại trà",
        "Nghe kể chuyện lịch sử làng": "Những câu chuyện thú vị về vùng đất",
        "Tìm hiểu quy trình sao chè": "Xem nghệ nhân sao chè truyền thống",
        "Thưởng trà tại quán view đẹp": weather === "rainy"
          ? "Nghe tiếng mưa rơi, thưởng trà nóng"
          : "Ngắm cảnh đồi chè xanh mướt",
        "Thiền định giữa đồi chè": "Tĩnh tâm, hít thở không khí trong lành",
        "Đi dạo thư thái ngắm cảnh": "Thư giãn giữa thiên nhiên",
        "Hái chè cùng nông dân": weather === "rainy"
          ? "Được phát áo mưa, trải nghiệm độc đáo"
          : "Học cách chọn búp chè ngon",
        "Học cách sao chè thủ công": "Thử tay nghề sao chè trên chảo gang",
        "Pha trà theo cách truyền thống": "Học nghệ thuật pha trà công phu"
      };
      return descriptions[activity] || "Trải nghiệm thú vị tại làng chè";
    }
  
    function generateExplanation(weather, taste, purpose, teas) {
      const weatherText = { sunny: "trời nắng đẹp", rainy: "trời mưa", cool: "trời se lạnh" };
      const tasteText = { strong: "bạn thích trà đậm đà", light: "bạn thích trà nhẹ nhàng", fragrant: "bạn thích trà thơm hương" };
      const purposeText = { photo: "bạn muốn chụp ảnh check-in", culture: "bạn muốn tìm hiểu văn hóa", relax: "bạn muốn thư giãn", experience: "bạn muốn trải nghiệm hái chè" };
  
      return `Do ${weatherText[weather]} và ${tasteText[taste]}, chúng tôi gợi ý ${teas[0]?.name || "một loại trà phù hợp"}. Vì ${purposeText[purpose]}, tuyến trải nghiệm đã được tối ưu để bạn có những khoảnh khắc đáng nhớ nhất.`;
    }
  
    function generateRecommendation(formData) {
      const { time, weather, taste, purpose } = formData;
  
      // tính điểm trà
      const teaScores = teaTypes.map((tea) => {
        let score = 0;
        if (tea.flavor === taste) score += 30;
        if ((tea.weather || []).includes(weather)) score += 25;
  
        if (weather === "cool" && taste === "strong" && (tea.name?.includes("Xanh") || tea.name?.includes("Hồng"))) score += 15;
        if (weather === "sunny" && taste === "light" && (tea.name?.includes("Sen") || tea.name?.includes("Atiso"))) score += 15;
        if (taste === "fragrant" && (tea.name?.includes("Ô Long") || tea.name?.includes("Shan"))) score += 10;
  
        return { ...tea, score };
      });
  
      teaScores.sort((a, b) => b.score - a.score);
      const recommendedTeas = teaScores.slice(0, 2);
  
      // tuyến trải nghiệm
      const selectedActivities = activities[purpose] || activities.culture || [];
  
      let numSteps = 3;
      let timeDescription = "";
      switch (parseInt(time, 10)) {
        case 30: numSteps = 2; timeDescription = "30 phút nhanh gọn"; break;
        case 60: numSteps = 3; timeDescription = "1 giờ trọn vẹn"; break;
        case 120: numSteps = 4; timeDescription = "2 giờ trải nghiệm sâu"; break;
        case 240: numSteps = 5; timeDescription = "nửa ngày khám phá"; break;
        default: numSteps = 3; timeDescription = `${time} phút`; break;
      }
  
      const route = [];
      route.push({ step: 1, title: "Đón tiếp & Giới thiệu", description: "Nhận nước trà chào mừng, nghe giới thiệu về làng chè" });
  
      const activityList = [...selectedActivities];
      for (let i = 1; i < numSteps - 1 && activityList.length > 0; i++) {
        const activity = activityList.shift();
        route.push({
          step: i + 1,
          title: activity,
          description: getActivityDescription(activity, weather)
        });
      }
  
      route.push({
        step: route.length + 1,
        title: "Thưởng trà & Chia tay",
        description: `Thưởng thức ${recommendedTeas[0]?.name || "trà"} và mua quà lưu niệm`
      });
  
      const explanation = generateExplanation(weather, taste, purpose, recommendedTeas);
  
      return { teas: recommendedTeas, route, timeDescription, explanation };
    }
  
    function renderRecommendation(result) {
      results.innerHTML = `
        <div>
          <h3 class="font-display text-2xl font-bold text-green-800 mb-2">✨ Kết Quả Gợi Ý</h3>
          <p class="text-gray-600 mb-6">Dựa trên sở thích của bạn (${result.timeDescription})</p>
  
          <div class="mb-6">
            <h4 class="font-bold text-green-700 mb-3 flex items-center gap-2">
              <span class="text-xl">🗺️</span> Tuyến Trải Nghiệm Đề Xuất
            </h4>
            ${result.route.map(step => `
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
            `).join("")}
          </div>
  
          <div class="mb-6">
            <h4 class="font-bold text-amber-700 mb-3 flex items-center gap-2">
              <span class="text-xl">🍵</span> Loại Trà Phù Hợp
            </h4>
            ${(result.teas || []).map(tea => `
              <div class="tea-card">
                <div class="flex items-start gap-3">
                  <span class="text-3xl">${tea.icon || "🍵"}</span>
                  <div>
                    <h5 class="font-semibold text-amber-800">${tea.name || ""}</h5>
                    <p class="text-gray-600 text-sm">${tea.description || ""}</p>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
  
          <div class="bg-white rounded-xl p-4 border-2 border-green-200">
            <h4 class="font-bold text-green-700 mb-2 flex items-center gap-2">
              <span>💡</span> Tại sao chọn như vậy?
            </h4>
            <p class="text-gray-600 text-sm leading-relaxed">${result.explanation}</p>
          </div>
        </div>
      `;
    }
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = {
        time: document.getElementById("input-time")?.value,
        weather: document.getElementById("input-weather")?.value,
        taste: document.getElementById("input-taste")?.value,
        purpose: document.getElementById("input-purpose")?.value
      };
      const result = generateRecommendation(formData);
      renderRecommendation(result);
    });
  }