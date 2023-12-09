const configureQuiz = () => {
  const quizHeaders = ['LearningObjective', 'Question', 'A', 'B', 'C', 'D', 'Answer', 'Explanation'];

  const enableQuizForInput = (input) => {
    // input is a bool, if true, reset the quiz, and hide the output elements.
    //                  if false, hide the input elements, and show the output elements.

    if(input) {
      // Find all the quiz reset elements and empty them. Identified by the data-quiz-reset attribute.
      const quizResetElements = document.querySelectorAll('[data-quiz-reset]');
      [...quizResetElements].forEach((element) => {
        element.innerHTML = '';
        element.value = '';
      });
    }

    // Hide the error box
    const errorBox = document.getElementById('quiz-error');
    errorBox.classList.add('is-hidden');

    // Handle result and input elements
    const quizOutputElements = document.querySelectorAll('[data-quiz-mode="result"]');
    [...quizOutputElements].forEach((element) => {
      element.classList.toggle('is-hidden', input);
    });
    const quizInputElements = document.querySelectorAll('[data-quiz-mode="input"]');
    [...quizInputElements].forEach((element) => {
      element.classList.toggle('is-hidden', !input);
    });
  };

  const quizTsvToObject = (tsv) => {
    const lines = tsv.split(/\n(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const objects = lines.map(line => {
      const data = line.split('\t');
      // Check that there are the correct number of columns
      if(data.length !== quizHeaders.length) {
        // Throw an exception
        throw new Error('Invalid quiz');
      }
      return quizHeaders.reduce((obj, header, index) => {
        obj[header] = data[index].replace(/^"|"$/g, '').replace(/""/g, '"');
        return obj;
      }, {});
    });

    return objects;
  };

  const createHTMLTable = (array) => {
    let tableHTML = `
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Question</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>`;

    array.forEach((item, questionNumber) => {
      tableHTML += `
      <tr>
        <th>Q${questionNumber + 1}</th>
        <td>
          <table class="table is-fullwidth is-bordered">`;

      for (let key in item) {
        
        tableHTML += `
        <tr data-controller="markdown-editor quiz-question"
            data-markdown-editor-markdown-value="${encodeURIComponent(JSON.stringify({ value: item[key] }))}"
            data-quiz-question-question-index-value="${questionNumber}"
            data-quiz-question-field-value="${key}"
            data-action="markdown-editor:markdownUpdated->quiz-question#markdownUpdated">
          <th class="is-narrow">${key}</td>
          <td>
            <span data-markdown-editor-target="rendered" class="content">
              ${marked.parse(item[key])}
            </span>
  
            <div class="field is-hidden" data-markdown-editor-target="editorContainer">
              <div class="control">
                <textarea class="textarea is-small" placeholder="Small textarea" data-markdown-editor-target="editor"></textarea>
              </div>
            </div>
          </td>
          <td class="is-narrow">
            <button class="button is-info is-small" data-action="click->markdown-editor#edit" data-markdown-editor-target="editButton">
              <span class="icon">
                <i class="fas fa-pencil-alt"></i>
              </span>
              <span>Edit</span>
            </button>

            <button class="button is-success is-small is-hidden" data-action="click->markdown-editor#save" data-markdown-editor-target="saveButton">
              <span class="icon">
                <i class="fas fa-save"></i>
              </span>
              <span>Save</span>
            </button>
          </td>
        </tr>`;
      }
      tableHTML += `
          </table>
        </td>
      </tr>`;
    });

    tableHTML += `
        </tbody>
      </table>`;

    return tableHTML;
  };

  const handleQuizPaste = (event) => {
    // Prevent the default paste action
    event.preventDefault();

    // Get the pasted data from the clipboard
    const text = (event.clipboardData || window.clipboardData).getData('text');

    // Convert imported as TSV as an object
    let quizObject;
    try {
      quizObject = quizTsvToObject(text);
    } catch (error) {
      const errorBox = document.getElementById('quiz-error');
      errorBox.innerHTML = `
        <strong>Invalid quiz.</strong>  Please ensure you paste just the following columns:
        <ul>
          <li>${quizHeaders.join('</li><li>')}</li>
        </ul>`;
      errorBox.classList.remove('is-hidden');
      return;
    }

    // Pop the quiz into a table
    const tableElement = document.getElementById('quiz-table');
    const quizHtml = createHTMLTable(quizObject);
    tableElement.innerHTML = quizHtml;

    // Put the quiz object into the right place
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.dataset.quizYamlQuestionsValue = JSON.stringify(quizObject);

    // Switch from input to output
    enableQuizForInput(false);
  };

  const resetQuiz = () => {
    // Switch from output to input
    enableQuizForInput(true);
    // Focus on the quiz source text area
    document.querySelector('textarea#quiz-source')?.focus();
  }

  // Find the quiz-csv text area and add a listener for pasting
  const quizSourceTextArea = document.querySelector('textarea#quiz-source');
  quizSourceTextArea?.addEventListener('paste', handleQuizPaste);

  // Find the reset button and add a listener
  const resetButton = document.getElementById('reset');
  resetButton?.addEventListener('click', resetQuiz);

  // Prepare for input
  enableQuizForInput(true);
};


const configureTableDisplay = () => {
  const enableCollapsingArrays = (element) => {
    const arrayKeys = element.querySelectorAll('.jh-array-key');
    [...arrayKeys].forEach((arrayKey) => {
      arrayKey.addEventListener('click', () => {
        arrayKey.nextSibling.classList.toggle('u-hide');
      });
    });
  };

  const convertButton = document.querySelector('button#convert');
  const yamlTextArea = document.querySelector('textarea#yaml');
  const output = document.querySelector('#output');
	convertButton?.addEventListener('click', () => {
  	const yaml = yamlTextArea.value;
    const object = jsyaml.load(yaml);
    const table = JsonHuman.format(object, {
      hyperlinks : {
        enable : true,
        keys: ['url'],          // Keys which will be output as links
        target : '_blank'       // 'target' attribute of a
      }
    });
    output.innerHTML = table.outerHTML;
    enableCollapsingArrays(output);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  configureTableDisplay();
  configureQuiz();
});
