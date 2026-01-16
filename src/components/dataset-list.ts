class DatasetList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <section x-data="{ datasets: [{name: 'cap', size: 25},{name: 'cap', size: 25}] }">

        <div x-show="datasets.length > 0">
          <h2 class="text-lg font-semibold mb-2">Dataset List</h2>
          <ul class="flex flex-col gap-1.5">
            <template x-for="(dataset, index) in datasets" :key="index" >
              <li class="border border-gray-300 rounded p-2 flex items-center gap-2">
                <strong x-text="dataset.name"></strong> 
                <span x-text="dataset.size"></span> 

                <div class="ml-auto">
                  <button @click="test()"
                    class="cursor-pointer font-semibold py-1 px-3 rounded">
                    Load
                  </button>
                  <button
                    class="cursor-pointer font-semibold py-1 px-3 rounded">
                    Delete
                  </button>
                </div>  
              </li>
            </template>
          </ul>
        </div>


        <div x-show="datasets.length === 0">
          <p>No datasets available.</p>
        </div>
      </section>
    `;
  }
}

customElements.define("dataset-list", DatasetList);
