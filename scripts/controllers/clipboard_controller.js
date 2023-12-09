import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

export default class extends Controller {
  static targets = [ "source" ];

  copy() {
    window.navigator?.clipboard?.writeText(this.sourceTarget.innerText);
  }
};
