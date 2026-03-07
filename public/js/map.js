export function initMap({ villages }) {
  const map = L.map("map").setView([21.55, 105.85], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  villages.forEach(v => {
    if (!v.lat || !v.lng) return;

    const marker = L.marker([v.lat, v.lng]).addTo(map);

    // popup hiển thị khi hover
    marker.bindPopup(`
      <div style="min-width:220px">
        <img 
          src="${v.image || '/images/default.jpg'}"
          style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:6px"
        />
        <h3 style="font-weight:700;margin-bottom:4px">${v.name}</h3>
        <p style="font-size:13px;color:#555">${v.description}</p>
      </div>
    `, {
      closeButton: false
    });

    // Hover vào marker -> mở popup
    marker.on("mouseover", function () {
      this.openPopup();
    });

    // rời chuột -> đóng popup
    marker.on("mouseout", function () {
      this.closePopup();
    });

    // Click marker -> mở trang chi tiết
    marker.on("click", function () {
      window.viewVillageDetail?.(v.id);
    });

  });
}