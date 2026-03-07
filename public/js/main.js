import { initUI } from "./ui.js";
import { initRecommend } from "./recommend.js";
import { initMap } from "./map.js";

async function fetchJson(url) {
  const res = await fetch(url);

  // Nếu server trả HTML lỗi / 404, đọc text để debug
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Fetch ${url} failed: ${res.status} ${res.statusText}\n${body.slice(0, 300)}`);
  }

  if (!contentType.includes("application/json")) {
    const body = await res.text();
    throw new Error(`Fetch ${url} did not return JSON. content-type=${contentType}\n${body.slice(0, 300)}`);
  }

  return res.json();
}

async function loadData() {
  const [villages, teaTypes, activities] = await Promise.all([
    fetchJson("/api/v1/villages"),
    fetchJson("/api/v1/tea-types")
  ]);

  return { villages, teaTypes, activities };
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await loadData();

    // init UI (section, modal, detail...)
    initUI(data);

    // init map
    initMap(data);

    // init recommend
    initRecommend(data);

    console.log("[OK] App initialized", {
      villages: data.villages?.length,
      teaTypes: data.teaTypes?.length,
      activitiesKeys: Object.keys(data.activities || {})
    });
  } catch (err) {
    console.error("[BOOT ERROR]", err);

    // Hiển thị 1 thông báo nhỏ trên UI để bạn biết app chết vì gì
    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;left:12px;bottom:12px;z-index:9999;background:#fff;border:1px solid #f87171;padding:10px 12px;border-radius:10px;max-width:520px;font:13px/1.4 system-ui;";
    el.innerHTML = `<b style="color:#b91c1c">Lỗi khởi tạo</b><div style="white-space:pre-wrap;margin-top:6px">${String(err.message || err)}</div>`;
    document.body.appendChild(el);
  }
});