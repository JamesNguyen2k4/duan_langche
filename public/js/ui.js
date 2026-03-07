// ui.js
let previousSection = "home";
let currentVillage = null;

window.showSection = function (sectionName) {
  const currentActive = document.querySelector(".section.active");
  if (currentActive && currentActive.id !== "section-recommend") {
    previousSection = currentActive.id.replace("section-", "");
  }

  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));

  const target = document.getElementById(`section-${sectionName}`);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (window.closePopup) window.closePopup();
};

window.openQRModal = function () {
  document.getElementById("qr-modal")?.classList.remove("hidden");
  const input = document.getElementById("qr-input");
  const err = document.getElementById("qr-error");
  if (input) input.value = "";
  if (err) err.classList.add("hidden");
  input?.focus();
};

window.closeQRModal = function () {
  document.getElementById("qr-modal")?.classList.add("hidden");
};

window.submitQRCode = function () {
  const input = document.getElementById("qr-input").value.trim().toUpperCase();
  const village = (window.villages || []).find(v => v.code === input);
  if (village) {
    window.closeQRModal();
    window.viewVillageDetail(village.id);
  } else {
    document.getElementById("qr-error")?.classList.remove("hidden");
    document.getElementById("qr-input")?.focus();
  }
};
window.goBackFromRecommend = function () {
  // Nếu đang xem chi tiết 1 làng thì quay lại trang chi tiết
  if (window.currentVillage) {
    window.showSection("detail");
    return;
  }

  // Nếu không có currentVillage thì quay về trang trước đó (home/about)
  window.showSection(window.previousSection || "home");
};
// public/js/ui.js
export function initUI(data) {
    // để submitQRCode dùng được
    window.villages = data.villages || [];
  
    // bạn nên có hàm viewVillageDetail để map popup gọi được
    window.viewVillageDetail = function (villageId) {
      const village = window.villages.find(v => v.id === villageId);
      if (!village) return;
    
      // lưu làng hiện tại để recommend dùng được
      window.currentVillage = village;
    
      // fill detail text
      document.getElementById("detail-name").textContent = village.name;
      document.getElementById("detail-address").textContent = village.address;
      document.getElementById("detail-hours").textContent = village.openingHours;
      document.getElementById("detail-code").textContent = village.code;
    
      // fill detail image
      const detailImage = document.getElementById("detail-image");
      if (detailImage) {
        if (village.image) {
          detailImage.innerHTML = `
            <img 
              src="${village.image}" 
              alt="${village.name}"
              style="width:100%;height:100%;object-fit:cover;display:block"
            />
          `;
          detailImage.classList.remove("bg-gradient-to-br", "from-green-300", "to-green-400", "flex", "items-center", "justify-center");
        } else {
          detailImage.innerHTML = `
            <div class="text-center text-white">
              <span class="text-6xl block mb-2">🖼️</span>
              <span class="font-semibold">Hình ảnh làng chè</span>
            </div>
          `;
          detailImage.classList.add("bg-gradient-to-br", "from-green-300", "to-green-400", "flex", "items-center", "justify-center");
        }
      }
    
      const storyContainer = document.getElementById("detail-story");
      storyContainer.innerHTML = (village.story || [])
        .map(p => `<p class="leading-relaxed">${p}</p>`)
        .join("");
    
      window.showSection("detail");
    };
  
    // Enter trong modal QR
    document.getElementById("qr-input")?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") window.submitQRCode();
    });
  
    // click ngoài modal
    document.getElementById("qr-modal")?.addEventListener("click", function (e) {
      if (e.target === this) window.closeQRModal();
    });
  }