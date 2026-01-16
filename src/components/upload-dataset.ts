class UploadDataset extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div x-data="{ open: false, dataset: '', name: '' }" >
        <button 
          @click="open = !open"
          class="cursor-pointer  font-semibold py-1 px-3 rounded">
          <span x-text="open ? 'Hide' : 'Upload Dataset'"></span>
        </button>
        
        <form @submit.prevent="await uploadDataset(dataset, name); dataset = ''; name = ''; open = false; await $store.app.refreshDatasets()" class="mt-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4" x-show="open">
          <h2 class="text-lg font-semibold mb-2">Upload your dataset here</h2>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dataset Name (optional)</label>
            <input type="text" x-model="name" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Italian-German Basics">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CSV Content (Header required)</label>
            <textarea x-model="dataset" class="w-full h-40 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="italian,german\nciao,hallo\nvino,wein"></textarea>
          </div>

          <button
            type="submit"
            class="w-full cursor-pointer font-semibold py-2 px-4 rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Submit Dataset
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define("upload-dataset", UploadDataset);
