export function initUI({ villages }) {
    let currentVillage = null;
  
    function showSection(name) {
      document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
      document.getElementById(`section-${name}`)?.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  
    function viewVillageDetail(villageId) {
      const v = villages.find(x => x.id === villageId);
      if (!v) return;
  
      currentVillage = v;
      document.getElementById("detail-name").textContent = v.name;
      document.getElementById("detail-address").textContent = v.address;
      document.getElementById("detail-hours").textContent = v.openingHours;
      document.getElementById("detail-code").textContent = v.code;
  
      const story = document.getElementById("detail-story");
      story.innerHTML = (v.story || []).map(p => `<p class="leading-relaxed">${p}</p>`).join("");
  
      showSection("detail");
    }
  
    // expose để map.js gọi được
    window.viewVillageDetail = viewVillageDetail;
    window.showSection = showSection;
  
    // TODO: openQRModal/closeQRModal/submitQRCode… bạn chuyển tương tự
  }