import Alpine from "alpinejs";
import { storageService } from "./storage";
import type { Dataset, CardItem } from "./storage";

window.Alpine = Alpine;

// Import components AFTER setting window.Alpine
import "./components/flash-card";
import "./components/dataset-import";
import "./components/dataset-list";
import "./components/study-panel";

interface AppStore {
  datasets: Dataset[];
  currentDataset: Dataset | null;
  studyMode: "all" | "failed";
  currentIndex: number;
  revealed: boolean;
  studyQueue: CardItem[];
  showImport: boolean;
  swapColumns: boolean;
  init(): Promise<void>;
  reloadDatasets(): Promise<void>;
  selectDataset(name: string): void;
  setStudyMode(mode: "all" | "failed"): void;
  startStudy(): void;
  currentCard: CardItem | null;
  reveal(): void;
  answer(isCorrect: boolean): Promise<void>;
  exitStudy(): void;
  toggleImport(): void;
  toggleColumnSwap(): void;
}

const appStore: AppStore = {
  datasets: [],
  currentDataset: null,
  studyMode: "all",
  currentIndex: 0,
  revealed: false,
  studyQueue: [],
  showImport: false,
  swapColumns: false,

  async init() {
    this.datasets = await storageService.getAllDatasets();
  },

  async reloadDatasets() {
    this.datasets = await storageService.getAllDatasets();
  },

  selectDataset(name: string) {
    const ds = this.datasets.find((d) => d.name === name);
    if (ds) {
      this.currentDataset = ds;
      this.startStudy();
    }
  },

  setStudyMode(mode: "all" | "failed") {
    this.studyMode = mode;
    if (this.currentDataset) {
      this.startStudy();
    }
  },

  startStudy() {
    if (!this.currentDataset) return;
    this.currentIndex = 0;
    this.revealed = false;

    const promptColumn = this.swapColumns
      ? this.currentDataset.columns[1]
      : this.currentDataset.columns[0];

    if (this.studyMode === "failed") {
      this.studyQueue = this.currentDataset.items.filter((item) => {
        const s = item.stats[promptColumn];
        return s && s.wrong > 0;
      });
    } else {
      this.studyQueue = [...this.currentDataset.items];
    }

    // Shuffle study queue
    this.studyQueue.sort(() => Math.random() - 0.5);
  },

  get currentCard() {
    return this.studyQueue[this.currentIndex] || null;
  },

  reveal() {
    this.revealed = true;
  },

  async answer(isCorrect: boolean) {
    if (!this.currentDataset || !this.currentCard) return;

    const promptColumn = this.swapColumns
      ? this.currentDataset.columns[1]
      : this.currentDataset.columns[0];

    await storageService.updateDirectionalStats(
      this.currentDataset.name,
      this.currentCard.id,
      promptColumn,
      isCorrect
    );

    // Refresh current dataset from DB to keep stats in sync
    const updatedDs = await storageService.getDataset(this.currentDataset.name);
    if (updatedDs) {
      this.currentDataset = updatedDs;
    }

    this.currentIndex++;
    this.revealed = false;

    if (this.currentIndex >= this.studyQueue.length) {
      // Study session finished
    }
  },

  exitStudy() {
    this.currentDataset = null;
    this.studyQueue = [];
    this.currentIndex = 0;
    this.revealed = false;
  },

  toggleImport() {
    this.showImport = !this.showImport;
  },

  toggleColumnSwap() {
    this.swapColumns = !this.swapColumns;
    this.revealed = false;
  },
};

Alpine.store("app", appStore);

Alpine.start();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("SW registration failed: ", err);
    });
  });
}
