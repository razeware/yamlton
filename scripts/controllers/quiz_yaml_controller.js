import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

const convertQuizToYamlFormat = (questions) => {
  return questions.map(question => {
    return {
      question_md: question.Question,
      choices: [
        { ref: 'a', option_md: question.A, correct: question.Answer === 'A' },
        { ref: 'b', option_md: question.B, correct: question.Answer === 'B' },
        { ref: 'c', option_md: question.C, correct: question.Answer === 'C' },
        { ref: 'd', option_md: question.D, correct: question.Answer === 'D' }
      ].filter(choice => choice.option_md !== ''),
      explanation_md: question.Explanation,
      learning_objective: question.LearningObjective,
    }
  });
};

const convertQuizToYaml = (quizObject) => {
  // Convert to the YAML formatted object
  const questions = convertQuizToYamlFormat(quizObject);

  // Wrap the questions in a quiz object
  const quiz = {
    title: "!!TODO!! Quiz Title",
    assessment_type: "quiz",
    description_md: "!!TODO!!  This can be multi-line (as long as `|` is used and indendation followed), and uses markdown. Must be a string.",
    questions: questions
  };

  // Convert to YAML, using double-quotes for strings
  return jsyaml.dump(quiz, { quotingType: '"' });
};


export default class extends Controller {
  static values = { questions: Array };
  static targets = [ "yaml" ];

  questionsValueChanged() {
    console.log('questionsValueChanged');
    console.log(this.questionsValue);

    // Put the reformatted text into the quiz yaml box
    const yamlText = convertQuizToYaml(this.questionsValue);
    this.yamlTarget.innerHTML = `<pre><code>${yamlText}</code></pre>`;
  }

  questionUpdated(event) {
    console.log('questionUpdated');
    const { questionIndex, field, value } = event.detail;

    let questions = this.questionsValue;
    questions[questionIndex][field] = value;
    this.questionsValue = questions;
  }
};
