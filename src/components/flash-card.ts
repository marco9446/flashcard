class FlashCard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div>
        i'm a flash card
        <slot></slot>
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
