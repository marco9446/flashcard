import Alpine from "alpinejs";
import "./components/flash-card";

window.Alpine = Alpine;

Alpine.start();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("SW registration failed: ", err);
    });
  });
}
