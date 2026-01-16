class FlashCard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="relative w-full h-64 [perspective:1000px] cursor-pointer" 
           @click="$store.app.toggleReveal()"
           x-show="$store.app.selectedDataset">
        <div class="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
             :class="$store.app.isRevealed ? '[transform:rotateY(180deg)]' : ''">
          
          <!-- Face A (Front by default, Back if sideSwap is true) -->
          <div class="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-inner">
            <template x-if="$store.app.selectedDataset">
              <span class="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2" 
                    x-text="$store.app.sideSwap ? $store.app.selectedDataset.columns[1] : $store.app.selectedDataset.columns[0]"></span>
            </template>
            <div class="text-3xl font-bold text-blue-900 text-center" 
                 x-text="$store.app.sideSwap ? $store.app.currentCard?.values[$store.app.selectedDataset?.columns[1]] : $store.app.currentCard?.values[$store.app.selectedDataset?.columns[0]]"></div>
          </div>

          <!-- Face B (Back by default, Front if sideSwap is true) -->
          <div class="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-6 bg-green-50 border-2 border-green-200 rounded-2xl shadow-inner">
            <template x-if="$store.app.selectedDataset">
              <span class="text-xs font-bold uppercase tracking-widest text-green-400 mb-2" 
                    x-text="$store.app.sideSwap ? $store.app.selectedDataset.columns[0] : $store.app.selectedDataset.columns[1]"></span>
            </template>
            <div class="text-3xl font-bold text-green-900 text-center" 
                 x-text="$store.app.sideSwap ? $store.app.currentCard?.values[$store.app.selectedDataset?.columns[0]] : $store.app.currentCard?.values[$store.app.selectedDataset?.columns[1]]"></div>
          </div>
          
        </div>
      </div>
    `;
  }
}

customElements.define("flash-card", FlashCard);

declare global {
  interface HTMLElementTagNameMap {
    "flash-card": FlashCard;
  }
}
