import { Application } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

import MarkdownEditorController from "./controllers/markdown_editor_controller.js";
import QuizYamlController from "./controllers/quiz_yaml_controller.js";

window.Stimulus = Application.start()

Stimulus.register("markdown-editor", MarkdownEditorController);
Stimulus.register("quiz-yaml", QuizYamlController);
