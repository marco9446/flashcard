class UploadDataset extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div x-data="{ open: false, dataset: '' }" >
        <button 
          @click="open = !open"
          class="cursor-pointer  font-semibold py-1 px-3 rounded">
          <span x-text="open ? 'Hide' : 'Upload Dataset'"></span>
        </button>
        
        <form @submit.prevent="uploadDataset(dataset)" class="mt-4" x-show="open">
          <h2 class="text-lg font-semibold mb-2">Upload your dataset here</h2>
          <textarea  x-model="dataset" class="w-full h-40 p-2 border border-gray-300 rounded" placeholder="Paste your dataset in csv format..."></textarea>
          <button
            type="submit"
            class="mt-2 cursor-pointer font-semibold py-1 px-3 rounded">
            Submit
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define("upload-dataset", UploadDataset);
