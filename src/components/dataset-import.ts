import { parseCSV } from "../csv";
import { storageService } from "../storage";

class DatasetImport extends HTMLElement {
  async handleImport(name: string, content: string) {
    if (!name.trim()) throw new Error("Name is required");
    const dataset = parseCSV(name, content);
    await storageService.saveDataset(dataset);
    (window as any).Alpine.store("app").reloadDatasets();
  }

  connectedCallback() {
    this.innerHTML = `
      <div x-data="{ name: '', content: '', error: '' }" class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Import Dataset</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dataset Name</label>
            <input type="text" x-model="name" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Italian-German Vocabulary">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CSV Content (Header required)</label>
            <textarea x-model="content" rows="6" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="italian,german\nciao,hallo\nbongiorno,guten tag"></textarea>
          </div>
          <p x-show="error" x-text="error" class="text-sm text-red-500"></p>
          <button @click="async () => {
            try {
              await $el.closest('dataset-import').handleImport(name, content);
              name = '';
              content = '';
              error = '';
            } catch (e) {
              error = e.message;
            }
          }" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Import Dataset
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define("dataset-import", DatasetImport);
