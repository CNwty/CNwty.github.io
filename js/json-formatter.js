document.addEventListener('DOMContentLoaded', () => {
  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  const formatJsonBtn = document.getElementById('format-json-btn');

  if(formatJsonBtn){
    formatJsonBtn.addEventListener('click', () => {
      try {
        const input = jsonInput.value;
        if(input){
          const parsed = JSON.parse(input);
          jsonOutput.innerHTML = JSON.stringify(parsed, null, 2);
          jsonOutput.style.color = 'black';
        }
      } catch (e) {
        jsonOutput.innerHTML = '<span class="error">无效的 JSON 格式: ' + e.message + '</span>';
        jsonOutput.style.color = 'red';
      }
    });
  }
});
