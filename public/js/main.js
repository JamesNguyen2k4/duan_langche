import { initUI } from "./ui.js";
import { initRecommend } from "./recommend.js";
import { initMap } from "./map.js";

async function loadData() {
  const [villages, teaTypes, activities] = await Promise.all([
    fetch("/api/v1/villages").then(r => r.json()),
    fetch("/api/v1/tea-types").then(r => r.json()),
    fetch("/api/v1/activities").then(r => r.json())
  ]);
  return { villages, teaTypes, activities };
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadData();

  // init UI (section, modal, detail...)
  initUI(data);

  // init map
  initMap(data);

  // init recommend
  initRecommend(data);
});