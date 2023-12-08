import { Application, Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

window.Stimulus = Application.start()

Stimulus.register("markdown-editor", class extends Controller {
  static values = { markdown: String };
  static targets = [ "rendered", "editor", "editorContainer", "editButton", "saveButton"];

  connect() {
    console.log('CONNECTED');
  }

  edit() {
    console.log('EDIT');
    console.log(this.markdownValue);

    this.editorTarget.value = JSON.parse(decodeURIComponent(this.markdownValue)).value;

    this.enableEditing(true);
  
    //this.dispatch("edit", {});
  }

  save(event) {
    this.markdownValue = encodeURIComponent(JSON.stringify({ value: this.editorTarget.value }));
    this.renderedTarget.innerHTML = marked.parse(this.editorTarget.value);

    this.enableEditing(false);
  }

  enableEditing(isEditing) {
    this.renderedTarget.classList.toggle("is-hidden", isEditing);
    this.editorContainerTarget.classList.toggle("is-hidden", !isEditing);
    this.editButtonTarget.classList.toggle("is-hidden", isEditing);
    this.saveButtonTarget.classList.toggle("is-hidden", !isEditing);
  }
});
