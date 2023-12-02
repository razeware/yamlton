const configureQuiz = () => {
  const quizHeaders = ['Question', 'A', 'B', 'C', 'D', 'Answer', 'Explanation'];

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

    // Handle result and input elements
    const quizOutputElements = document.querySelectorAll('[data-quiz-mode="result"]');
    [...quizOutputElements].forEach((element) => {
      input ? element.classList.add('is-hidden') : element.classList.remove('is-hidden');
    });
    const quizInputElements = document.querySelectorAll('[data-quiz-mode="input"]');
    [...quizInputElements].forEach((element) => {
      input ? element.classList.remove('is-hidden') : element.classList.add('is-hidden');
    });
  };

  const quizTsvToObject = (tsv) => {
    const lines = tsv.split(/\n(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const objects = lines.map(line => {
      const data = line.split('\t');
      return quizHeaders.reduce((obj, header, index) => {
        obj[header] = data[index].replace(/^"|"$/g, '').replace(/""/g, '"');
        return obj;
      }, {});
    });

    return objects;
  };

  const createHTMLTable = (array) => {
    let tableHTML = '<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">';
    tableHTML += '<thead><tr>';
    quizHeaders.forEach((header) => {
      tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    array.forEach((item) => {
      tableHTML += '<tr>';
      for (let key in item) {
        tableHTML += `<td>${marked.parse(item[key])}</td>`;
      }
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    return tableHTML;
  };


  const convertQuizToYamlFormat = (questions) => {
    return questions.map(question => {
      return {
        question_md: question.Question,
        choices: [
          { ref: 'a', option_md: question.A, correct: question.Answer === 'A' },
          { ref: 'b', option_md: question.B, correct: question.Answer === 'B' },
          { ref: 'c', option_md: question.C, correct: question.Answer === 'C' },
          { ref: 'd', option_md: question.D, correct: question.Answer === 'D' }
        ],
        explanation_md: question.Explanation,
        learning_objective: ''
      }
    });
  };

  const convertQuizToYaml = (quizObject) => {
    // Convert to the YAML formatted object
    const questions = convertQuizToYamlFormat(quizObject);

    // Wrap the questions in a quiz object
    const quiz = {
      title: "Quiz Title",
      assessment_type: "quiz",
      description_md: "TODO.  This can be multi-line (as long as `|` is used and indendation followed), and uses markdown. Must be a string.",
      questions: questions
    };

    // Convert to YAML, using double-quotes for strings
    return jsyaml.dump(quiz, { quotingType: '"' });
  };

  const handleQuizPaste = (event) => {
    // Prevent the default paste action
    event.preventDefault();

    // Get the pasted data from the clipboard
    const text = (event.clipboardData || window.clipboardData).getData('text');

    // Convert imported as TSV as an object
    const quizObject = quizTsvToObject(text);

    // Pop the quiz into a table
    const tableElement = document.getElementById('quiz-table');
    const quizHtml = createHTMLTable(quizObject);
    tableElement.innerHTML = quizHtml;

    // Put the reformatted text into the quiz yaml box
    const quizYamlDiv = document.getElementById('quiz-yaml');
    const yamlText = convertQuizToYaml(quizObject);
    quizYamlDiv.innerHTML = `<pre><code>${yamlText}</code></pre>`;

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
