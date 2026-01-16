class FlashCard extends HTMLElement {
  static get observedAttributes() {
    return ["revealed", "front", "back", "front-label", "back-label"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const revealed = this.hasAttribute("revealed");
    const front = this.getAttribute("front") || "";
    const back = this.getAttribute("back") || "";
    const frontLabel = this.getAttribute("front-label") || "";
    const backLabel = this.getAttribute("back-label") || "";

    this.innerHTML = `
      <div class="perspective-1000 w-full max-w-md mx-auto aspect-[3/2] cursor-pointer" onclick="this.dispatchEvent(new CustomEvent('card-click', { bubbles: true }))">
        <div class="relative w-full h-full transition-transform duration-500 transform-style-3d ${
          revealed ? "rotate-y-180" : ""
        }">
          <!-- Front Face -->
          <div class="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-xl shadow-lg flex flex-col items-center justify-center p-6">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">${frontLabel}</span>
            <div class="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">${front}</div>
          </div>
          <!-- Back Face -->
          <div class="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 rotate-y-180">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">${backLabel}</span>
            <div class="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">${back}</div>
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
