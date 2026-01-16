export interface DirectionStats {
  correct: number;
  wrong: number;
  lastSeen: number | null;
  streak: number;
}

export interface CardItem {
  id: string;
  values: Record<string, string>;
  totalViews: number;
  stats: Record<string, DirectionStats>;
}

export interface Dataset {
  name: string;
  columns: [string, string];
  items: CardItem[];
  createdAt: number;
}

const DB_NAME = "flashcard-db";
const STORE_NAME = "datasets";
const DB_VERSION = 1;

class StorageService {
  private db: IDBDatabase | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "name" });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async saveDataset(dataset: Dataset): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(dataset);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllDatasets(): Promise<Dataset[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getDataset(name: string): Promise<Dataset | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(name);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDataset(name: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(name);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateDirectionalStats(
    datasetName: string,
    itemId: string,
    promptColumn: string,
    isCorrect: boolean
  ): Promise<void> {
    const dataset = await this.getDataset(datasetName);
    if (!dataset) return;

    const item = dataset.items.find((i) => i.id === itemId);
    if (!item) return;

    // Initialize stats for this direction if they don't exist
    if (!item.stats[promptColumn]) {
      item.stats[promptColumn] = {
        correct: 0,
        wrong: 0,
        lastSeen: null,
        streak: 0,
      };
    }

    item.totalViews++;
    const s = item.stats[promptColumn];
    s.lastSeen = Date.now();

    if (isCorrect) {
      s.correct++;
      s.streak++;
    } else {
      s.wrong++;
      s.streak = 0; // Reset streak on mistake
    }

    await this.saveDataset(dataset);
  }
}

export const storageService = new StorageService();
