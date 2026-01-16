class StudyPanel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section x-show="$store.app.selectedDataset" class="mt-8 max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold" x-text="$store.app.selectedDataset?.name"></h2>
          <button @click="$store.app.selectedDataset = null" class="text-gray-500 hover:text-gray-700">
            &larr; Back to Datasets
          </button>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-medium text-gray-500" x-text="'Card ' + ($store.app.currentCardIndex + 1) + ' of ' + $store.app.currentCards.length"></span>
            
            <div class="flex gap-4 items-center">
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" x-model="$store.app.sideSwap" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span class="text-gray-600">Swap Sides</span>
              </label>

              <select x-model="$store.app.studyMode" class="text-sm border-none bg-gray-50 rounded p-1">
                <option value="all">All Cards</option>
                <option value="failed">Failed Only</option>
              </select>
            </div>
          </div>

          <template x-if="$store.app.currentCard">
            <div class="space-y-6">
              <flash-card></flash-card>

              <div x-show="$store.app.isRevealed" class="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                <button @click="$store.app.markWrong()" 
                  class="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-md">
                  Wrong
                </button>
                <button @click="$store.app.markCorrect()" 
                  class="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-md">
                  Correct
                </button>
              </div>

              <div x-show="!$store.app.isRevealed" class="text-center text-gray-400 italic">
                Click the card to reveal the answer
              </div>
            </div>
          </template>

          <template x-if="!$store.app.currentCard">
            <div class="text-center py-10">
              <p class="text-xl text-gray-600 mb-4">No cards left to study in this mode!</p>
              <button @click="$store.app.studyMode = 'all'" class="text-blue-600 font-semibold underline">
                Switch to All Cards
              </button>
            </div>
          </template>
        </div>
      </section>
    `;
  }
}

customElements.define("study-panel", StudyPanel);
