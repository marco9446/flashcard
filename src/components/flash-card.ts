class FlashCard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `

      <div x-data="{ flipped: false }" >
        <div @click="flipped = !flipped" 
            class="w-64 h-40 border flex justify-center items-center cursor-pointer ">
          <span id="front_page" x-show="!flipped">
            front content
          </span>
          <span id="back_page" x-show="flipped" >
            back content
          </span>
        </div>

        <div class="mt-2 flex justify-between" x-show="flipped">
          <button
            class="cursor-pointer font-semibold py-1 px-3 rounded">
            Fail
          </button>
          <button 
            class="cursor-pointer font-semibold py-1 px-3 rounded">
            Correct
          </button>
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
