const msg = new SpeechSynthesisUtterance();
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');

const textArea = document.querySelector('[name="text"]');

// Initialize text
msg.text = textArea ? textArea.value : '';

function populateVoices() {
  voices = speechSynthesis.getVoices();
  voicesDropdown.innerHTML = '<option value="">Select A Voice</option>' +
    voices
      .map(
        voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
      )
      .join('');
}

function setVoice() {
  msg.voice = voices.find(voice => voice.name === this.value);
  toggle();
}

function toggle(startOver = true) {
  speechSynthesis.cancel();
  
  // Update text from textarea to ensure latest content is used
  if (textArea) {
    msg.text = textArea.value;
  }

  // Prevent speech if text is empty or only whitespace
  if (!msg.text || msg.text.trim().length === 0) {
    return;
  }

  if (startOver) {
    speechSynthesis.speak(msg);
  }
}

function setOption() {
  msg[this.name] = this.value;
  toggle();
}

speechSynthesis.addEventListener('voiceschanged', populateVoices);
voicesDropdown.addEventListener('change', setVoice);
options.forEach(option => option.addEventListener('change', setOption));
speakButton.addEventListener('click', () => toggle(true));
stopButton.addEventListener('click', () => toggle(false));

// Populate immediately if voices are already loaded
populateVoices();