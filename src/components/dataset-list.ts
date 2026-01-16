class DatasetList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <section class="mt-8">
        <div x-show="$store.app.datasets.length > 0">
          <h2 class="text-xl font-bold mb-4">Your Datasets</h2>
          <ul class="space-y-3">
            <template x-for="dataset in $store.app.datasets" :key="dataset.id">
              <li class="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h3 class="font-semibold text-lg" x-text="dataset.name"></h3>
                  <p class="text-sm text-gray-500" x-text="dataset.items.length + ' cards • ' + dataset.columns.join(' → ')"></p>
                </div>

                <div class="flex gap-2">
                  <button @click="$store.app.selectDataset(dataset.id)"
                    class="bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors">
                    Study
                  </button>
                  <button @click="if(confirm('Delete this dataset?')) $store.app.deleteDataset(dataset.id)"
                    class="bg-red-50 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>  
              </li>
            </template>
          </ul>
        </div>

        <div x-show="$store.app.datasets.length === 0" class="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p class="text-gray-500 italic">No datasets available. Upload one to get started!</p>
        </div>
      </section>
    `;
  }
}

customElements.define("dataset-list", DatasetList);
