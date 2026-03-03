export function initMap({ villages }) {
    const map = L.map("map").setView([21.55, 105.85], 11);
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
  
    villages.forEach(v => {
      if (!v.lat || !v.lng) return; // thiếu tọa độ thì bỏ qua
  
      const marker = L.marker([v.lat, v.lng]).addTo(map);
      marker.bindPopup(`
        <div style="min-width:220px">
          <h3 style="font-weight:700;margin-bottom:6px">${v.name}</h3>
          <p style="font-size:14px;margin-bottom:10px">${v.description}</p>
          <button data-village-id="${v.id}" class="leaflet-detail-btn"
            style="background:#15803d;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer">
            Xem chi tiết
          </button>
        </div>
      `);
    });
  
    // delegate click trong popup
    map.on("popupopen", (e) => {
      const el = e.popup.getElement();
      const btn = el?.querySelector(".leaflet-detail-btn");
      if (!btn) return;
  
      btn.onclick = () => {
        const id = Number(btn.dataset.villageId);
        window.viewVillageDetail?.(id); // hàm này sẽ được gắn trong ui.js
      };
    });
  }