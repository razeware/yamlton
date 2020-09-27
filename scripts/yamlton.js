const enableCollapsingArrays = (element) => {
  const arrayKeys = element.querySelectorAll('.jh-array-key');
  console.log(arrayKeys);
  [...arrayKeys].forEach((arrayKey) => {
    arrayKey.addEventListener('click', () => {
      arrayKey.nextSibling.classList.toggle('u-hide');
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
	const convertButton = document.querySelector('button#convert');
  const yamlTextArea = document.querySelector('textarea#yaml');
  const output = document.querySelector('#output');
	convertButton.addEventListener('click', () => {
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
});
