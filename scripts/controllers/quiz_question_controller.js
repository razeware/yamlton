import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

export default class extends Controller {
  static values = {
    questionIndex: Number,
    field: String,
  };

  markdownUpdated(event) {
    const { markdown } = event.detail;

    this.dispatch("questionUpdated", {
      detail: {
        questionIndex: this.questionIndexValue,
        field: this.fieldValue,
        value: markdown
      }
    });
  }
};
