import { storageService } from "../storage";

class DatasetList extends HTMLElement {
  async deleteDataset(name: string) {
    if (confirm("Delete this dataset?")) {
      await storageService.deleteDataset(name);
      (window as any).Alpine.store("app").reloadDatasets();
    }
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Datasets</h2>
        <template x-if="$store.app.datasets.length === 0">
          <p class="text-slate-500 italic">No datasets imported yet.</p>
        </template>
        <ul class="divide-y divide-slate-200 dark:divide-slate-700">
          <template x-for="ds in $store.app.datasets" :key="ds.name">
            <li class="py-4 flex items-center justify-between">
              <div>
                <h3 x-text="ds.name" class="font-bold text-slate-800 dark:text-slate-100"></h3>
                <p class="text-sm text-slate-500" x-text="ds.items.length + ' cards | ' + ds.columns.join(' ↔ ')"></p>
              </div>
              <div class="flex space-x-2">
                <button @click="$store.app.selectDataset(ds.name)" class="text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">Study</button>
                <button @click="$el.closest('dataset-list').deleteDataset(ds.name)" class="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-sm">Delete</button>
              </div>
            </li>
          </template>
        </ul>
      </div>
    `;
  }
}

customElements.define("dataset-list", DatasetList);
