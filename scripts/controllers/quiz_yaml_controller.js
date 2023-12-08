import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

export default class extends Controller {
  static values = { quiz: Object };
  static targets = [ "quiz", "yaml" ];

  quizValueChanged() {
    console.log('quizValueChanged');
    console.log(this.quizValue);
  }

};
