const enableCollapsingArrays = (element) => {
  const arrayKeys = element.querySelectorAll('.jh-array-key');
  console.log(arrayKeys);
  [...arrayKeys].forEach((arrayKey) => {
    arrayKey.addEventListener('click', () => {
      arrayKey.nextSibling.classList.toggle('u-hide');
    });
  });
};

const quizHeaders = ['Question', 'A', 'B', 'C', 'D', 'Answer', 'Explanation'];

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
  if (document.getElementById('quiz-table')) {
    const tableElement = document.getElementById('quiz-table');
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
    tableElement.innerHTML = tableHTML;
  }
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
}

const handleQuizPaste = (event) => {
  // Prevent the default paste action
  event.preventDefault();

  // Get the pasted data from the clipboard
  const text = (event.clipboardData || window.clipboardData).getData('text');

  // Put the reformatted text into the quiz yaml box
  const quizYamlDiv = document.getElementById('quiz-yaml');
  quizYamlDiv.innerHTML = `<pre><code>${reformatTsvText(text)}</code></pre>`;

  // Hide the quiz source container
  const quizSourceContainer = document.getElementById('quiz-source-container');
  quizSourceContainer.classList.add('is-hidden');

  // Show the quiz table
  const quizTable = document.getElementById('quiz-table');
  quizTable.classList.remove('is-hidden');

  // Show the reset button
  const resetButton = document.getElementById('reset');
  resetButton.classList.remove('is-hidden');

  // Show the yaml container
  const quizYamlContainer = document.getElementById('quiz-yaml-container');
  quizYamlContainer.classList.remove('is-hidden');
};

const reformatTsvText = (text) => {
  // Convert the pasted data from TSV to a JavaScript object
  const object =  quizTsvToObject(text);

  // Pop the quiz into a table
  createHTMLTable(object);

  // Convert to the YAML formatted object
  const questions = convertQuizToYamlFormat(object);

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


const resetQuiz = () => {
  const quizTable = document.getElementById('quiz-table');
  quizTable.innerHTML = '';
  const quizSourceTextArea = document.querySelector('textarea#quiz-source');
  quizSourceTextArea.value = '';
  // Hide the reset button
  const resetButton = document.getElementById('reset');
  resetButton.classList.add('is-hidden');
  // Hide the quiz table
  quizTable.classList.add('is-hidden');
  // Show the quiz source container
  const quizSourceContainer = document.getElementById('quiz-source-container');
  quizSourceContainer.classList.remove('is-hidden');
  // Clear the quiz yaml div
  const quizYamlDiv = document.getElementById('quiz-yaml');
  quizYamlDiv.innerHTML = '';
  // Hide the quiz yaml container div
  const quizYamlContainer = document.getElementById('quiz-yaml-container');
  quizYamlContainer.classList.add('is-hidden');
  // Focus on the quiz source text area
  quizSourceTextArea.focus();
}


document.addEventListener('DOMContentLoaded', () => {
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

  // Find the quiz-csv text area and add a listener for pasting
  const quizSourceTextArea = document.querySelector('textarea#quiz-source');
  console.log(quizSourceTextArea);
  quizSourceTextArea?.addEventListener('paste', handleQuizPaste);

  // Find the reset button and add a listener
  const resetButton = document.getElementById('reset');
  resetButton?.addEventListener('click', resetQuiz);
});
