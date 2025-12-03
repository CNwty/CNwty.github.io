document.addEventListener('DOMContentLoaded', () => {
  const markdownInput = document.getElementById('markdown-input');
  const htmlOutput = document.getElementById('html-output');
  
  if(markdownInput && htmlOutput && typeof showdown !== 'undefined'){
    const converter = new showdown.Converter();

    const convert = () => {
      const markdownText = markdownInput.value;
      const html = converter.makeHtml(markdownText);
      htmlOutput.innerHTML = html;
    };

    markdownInput.addEventListener('keyup', convert);
    markdownInput.addEventListener('change', convert);

    // Initial conversion
    convert();
  }
});
