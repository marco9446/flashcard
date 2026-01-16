class StudyPanel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div x-show="$store.app.currentDataset" class="space-y-6">
        <div class="flex items-center justify-between">
          <button @click="$store.app.exitStudy()" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center space-x-1">
            <span>&larr; Back</span>
          </button>
          
          <div class="flex items-center space-x-4">
             <div class="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                <button @click="$store.app.setStudyMode('all')" :class="$store.app.studyMode === 'all' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'" class="px-3 py-1 text-xs font-bold rounded-md transition-all">All</button>
                <button @click="$store.app.setStudyMode('failed')" :class="$store.app.studyMode === 'failed' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'" class="px-3 py-1 text-xs font-bold rounded-md transition-all">Failed</button>
             </div>
             
             <button @click="$store.app.toggleColumnSwap()" class="flex items-center space-x-2 text-xs font-bold px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span :class="$store.app.swapColumns ? 'text-indigo-500' : 'text-slate-500'">Swap A ↔ B</span>
             </button>
          </div>
        </div>

        <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100" x-text="$store.app.currentDataset?.name"></h2>
            <p class="text-slate-500 text-sm" x-text="'Card ' + ($store.app.currentIndex + 1) + ' of ' + $store.app.studyQueue.length"></p>
        </div>

        <template x-if="$store.app.currentCard">
            <div class="space-y-8">
                <div class="flex justify-center space-x-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <div class="flex items-center">
                        <span class="mr-2">Views:</span>
                        <span class="text-slate-600 dark:text-slate-200" x-text="$store.app.currentCard.totalViews"></span>
                    </div>
                    <div class="flex items-center">
                        <span class="mr-2">Streak:</span>
                        <span class="text-emerald-500" x-text="$store.app.currentCard.stats[$store.app.swapColumns ? $store.app.currentDataset.columns[1] : $store.app.currentDataset.columns[0]]?.streak || 0"></span>
                    </div>
                </div>

                <flash-card
                    :front="$store.app.swapColumns ? $store.app.currentCard.values[$store.app.currentDataset.columns[1]] : $store.app.currentCard.values[$store.app.currentDataset.columns[0]]"
                    :back="$store.app.swapColumns ? $store.app.currentCard.values[$store.app.currentDataset.columns[0]] : $store.app.currentCard.values[$store.app.currentDataset.columns[1]]"
                    :front-label="$store.app.swapColumns ? $store.app.currentDataset.columns[1] : $store.app.currentDataset.columns[0]"
                    :back-label="$store.app.swapColumns ? $store.app.currentDataset.columns[0] : $store.app.currentDataset.columns[1]"
                    :revealed="$store.app.revealed"
                    @card-click="$store.app.reveal()"
                ></flash-card>

                <div x-show="!$store.app.revealed" class="text-center">
                    <p class="text-slate-500 italic">Click card to reveal answer</p>
                </div>

                <div x-show="$store.app.revealed" class="flex justify-center space-x-4 animate-fade-in">
                    <button @click="$store.app.answer(false)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
                        Wrong
                    </button>
                    <button @click="$store.app.answer(true)" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
                        Correct
                    </button>
                </div>
            </div>
        </template>

        <template x-if="!$store.app.currentCard && $store.app.studyQueue.length > 0">
            <div class="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <h3 class="text-3xl font-bold text-emerald-500 mb-2">Well Done!</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-6">You've finished this study session.</p>
                <div class="flex justify-center space-x-4">
                    <button @click="$store.app.startStudy()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition-colors">Study Again</button>
                    <button @click="$store.app.exitStudy()" class="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-2 px-6 rounded-md transition-colors">Close</button>
                </div>
            </div>
        </template>

        <template x-if="$store.app.studyQueue.length === 0">
            <div class="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 font-bold text-red-500">
                No cards to study in this mode.
            </div>
        </template>
      </div>
    `;
  }
}

customElements.define("study-panel", StudyPanel);
