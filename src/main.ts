import Alpine from "alpinejs";
import "./components/flash-card";
import "./components/upload-dataset";
import "./components/dataset-list";
import * as Utils from "./lib/utils";

window.Alpine = Alpine;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("SW registration failed: ", err);
    });
  });
}

document.addEventListener("alpine:init", () => {
  // You can add Alpine.js plugins or custom directives here if needed

  Alpine.data("app", () => ({
    // Application-level state and methods can go here
    async init() {
      console.log("setup db", new Date());
    },
    ...Utils,
  }));
});

Alpine.start();
