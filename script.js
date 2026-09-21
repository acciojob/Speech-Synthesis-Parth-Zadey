const msg = new SpeechSynthesisUtterance();
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');
const textArea = document.querySelector('[name="text"]');

// Initialize text
msg.text = textArea ? textArea.value.trim() : '';

function populateVoices() {
  voices = speechSynthesis.getVoices();
  voicesDropdown.innerHTML = voices
    .map(
      voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
    )
    .join('');
}

function setVoice() {
  const selectedVoice = voices.find(voice => voice.name === this.value);
  if (selectedVoice) {
    msg.voice = selectedVoice;
  }
  toggle();
}

function toggle(startOver = true) {
  speechSynthesis.cancel();

  // Always sync with current textarea value if present
  if (textArea) {
    msg.text = textArea.value;
  }

  // Strictly block empty string or whitespace-only input
  if (!msg.text || msg.text.trim().length === 0) {
    return;
  }

  if (startOver) {
    speechSynthesis.speak(msg);
  }
}

function setOption() {
  if (this.name === 'rate' || this.name === 'pitch') {
    msg[this.name] = parseFloat(this.value);
  } else {
    msg[this.name] = this.value;
  }
  toggle();
}

// Event Listeners
speechSynthesis.addEventListener('voiceschanged', populateVoices);
voicesDropdown.addEventListener('change', setVoice);

options.forEach(option => {
  option.addEventListener('change', setOption);
  option.addEventListener('input', setOption);
});

speakButton.addEventListener('click', () => {
  toggle(true);
});

stopButton.addEventListener('click', () => {
  toggle(false);
});

// Initial population call
populateVoices();