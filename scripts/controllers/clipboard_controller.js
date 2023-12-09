import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

export default class extends Controller {
  static targets = [ "source", "flash" ];

  copy() {
    window.navigator?.clipboard?.writeText(this.sourceTarget.innerText)?.then(() => {
      this.flashTarget.classList.remove("is-hidden");
      setTimeout(() => this.flashTarget.classList.add("is-hidden"), 3000);
    });
  }
};
