import Alpine from "alpinejs";
import "./components/flash-card";
import "./components/upload-dataset";
import "./components/dataset-list";
import "./components/study-panel";
import * as Utils from "./lib/utils";
import { storageService, type Dataset, type CardItem } from "./storage";

window.Alpine = Alpine;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("SW registration failed: ", err);
    });
  });
}

interface AppStore {
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  currentCardIndex: number;
  isRevealed: boolean;
  studyMode: "all" | "failed";
  sideSwap: boolean; // false: Front/Back, true: Back/Front
  init(): Promise<void>;
  refreshDatasets(): Promise<void>;
  selectDataset(id: string): Promise<void>;
  deleteDataset(id: string): Promise<void>;
  readonly currentCards: CardItem[];
  readonly currentCard: CardItem | null;
  nextCard(): void;
  markCorrect(): Promise<void>;
  markWrong(): Promise<void>;
  toggleReveal(): void;
}

document.addEventListener("alpine:init", () => {
  Alpine.store("app", {
    datasets: [],
    selectedDataset: null,
    currentCardIndex: 0,
    isRevealed: false,
    studyMode: "all",
    sideSwap: false,

    async init(this: AppStore) {
      await this.refreshDatasets();
    },

    async refreshDatasets(this: AppStore) {
      this.datasets = await storageService.getAllDatasets();
    },

    async selectDataset(this: AppStore, id: string) {
      const dataset = await storageService.getDataset(id);
      if (dataset) {
        this.selectedDataset = dataset;
        this.currentCardIndex = 0;
        this.isRevealed = false;
      }
    },

    async deleteDataset(this: AppStore, id: string) {
      await storageService.deleteDataset(id);
      if (this.selectedDataset?.id === id) {
        this.selectedDataset = null;
      }
      await this.refreshDatasets();
    },

    get currentCards(): CardItem[] {
      const self = this as unknown as AppStore;
      if (!self.selectedDataset) return [];
      if (self.studyMode === "failed") {
        return self.selectedDataset.items.filter(
          (item: CardItem) => item.wrongCount > 0
        );
      }
      return self.selectedDataset.items;
    },

    get currentCard(): CardItem | null {
      const self = this as unknown as AppStore;
      return self.currentCards[self.currentCardIndex] || null;
    },

    nextCard(this: AppStore) {
      this.isRevealed = false;
      if (this.currentCardIndex < this.currentCards.length - 1) {
        this.currentCardIndex++;
      } else {
        this.currentCardIndex = 0;
      }
    },

    async markCorrect(this: AppStore) {
      if (!this.selectedDataset || !this.currentCard) return;
      await storageService.updateItemStats(
        this.selectedDataset.id,
        this.currentCard.id,
        true
      );
      this.nextCard();
    },

    async markWrong(this: AppStore) {
      if (!this.selectedDataset || !this.currentCard) return;
      await storageService.updateItemStats(
        this.selectedDataset.id,
        this.currentCard.id,
        false
      );
      this.nextCard();
    },

    toggleReveal(this: AppStore) {
      this.isRevealed = !this.isRevealed;
    },
  } as AppStore);

  Alpine.data("app", () => ({
    ...Utils,
  }));
});

Alpine.start();
