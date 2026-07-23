const voices = [
  {
    name: 'Gold',
    image: 'images/gold.png',
    cheerCost: 1000,
    folder: 'audio/gold',
    files: ['gold_clip1.mp3', 'gold_clip2.mp3', 'gold_clip3.mp3', 'gold_clip4.mp3']
  },
  {
    name: 'Normal',
    image: 'images/normal.png',
    cheerCost: 200,
    folder: 'audio/normal',
    files: ['normal_clip1.mp3', 'normal_clip2.mp3', 'normal_clip3.mp3', 'normal_clip4.mp3']
  },
  {
    name: 'Buff',
    image: 'images/buff.png',
    cheerCost: 200,
    folder: 'audio/buff',
    files: ['buff_clip1.mp3', 'buff_clip2.mp3', 'buff_clip3.mp3', 'buff_clip4.mp3']
  },
  {
    name: 'Cowboy',
    image: 'images/cowboy.png',
    cheerCost: 200,
    folder: 'audio/cowboy',
    files: ['cowboy_clip1.mp3', 'cowboy_clip2.mp3', 'cowboy_clip3.mp3', 'cowboy_clip4.mp3']
  },
  {
    name: 'Cult',
    image: 'images/cult.png',
    cheerCost: 200,
    folder: 'audio/cult',
    files: ['cult_clip1.mp3', 'cult_clip2.mp3', 'cult_clip3.mp3', 'cult_clip4.mp3']
  },
  {
    name: 'Nerd',
    image: 'images/nerd.png',
    cheerCost: 200,
    folder: 'audio/nerd',
    files: ['nerd_clip1.mp3', 'nerd_clip2.mp3', 'nerd_clip3.mp3', 'nerd_clip4.mp3']
  },
  {
    name: 'Old',
    image: 'images/old.png',
    cheerCost: 200,
    folder: 'audio/old',
    files: ['old_clip1.mp3', 'old_clip2.mp3', 'old_clip3.mp3', 'old_clip4.mp3']
  },
  {
    name: 'Poor',
    image: 'images/poor.png',
    cheerCost: 200,
    folder: 'audio/poor',
    files: ['poor_clip1.mp3', 'poor_clip2.mp3', 'poor_clip3.mp3', 'poor_clip4.mp3']
  },
  {
    name: 'Feral',
    image: 'images/feral.png',
    cheerCost: 200,
    folder: 'audio/feral',
    files: ['feral_clip1.mp3', 'feral_clip2.mp3', 'feral_clip3.mp3', 'feral_clip4.mp3']
  },
  {
    name: 'Sexy',
    image: 'images/sexy.png',
    cheerCost: 200,
    folder: 'audio/sexy',
    files: ['sexy_clip1.mp3', 'sexy_clip2.mp3', 'sexy_clip3.mp3', 'sexy_clip4.mp3']
  },
];

/* ElevenLabs voice ID map:
|----------------------------------|
| Character | Voice ID             |
|----------------------------------|
| Normal    | UgBBYS2sOqTuMpoF3BR0 |
| Buff      | TxWZERZ5Hc6h9dGxVmXa |
| Cowboy    | ruirxsoakN0GWmGNIo04 |
| Cult      | cPoqAvGWCPfCfyPMwe4z |
| Gold      | 6aO1exAR9bDruq155LzQ |
| Nerd      | mrQhZWGbb2k9qWJb5qeA |
| Old       | 6sFKzaJr574YWVu4UuJF |
| Poor      | 2ajXGJNYBR0iNHpS4VZb |
| Feral     | qhH5VOAvpCwvNpmn2srO |
| Sexy      | flHkNRp1BlvT73UL6gyz |
|----------------------------------|
*/

let selectedIndex = 0;
let isPlaying = false;
let currentAudio = null;

const grid = document.getElementById('voice-grid');
const textInput = document.getElementById('text-input');
const charcount = document.getElementById('charcount');
const previewBtn = document.getElementById('preview-btn');
const vu = document.getElementById('vu');
const outputPanel = document.getElementById('output-panel');
const cmdText = document.getElementById('cmd-text');
const copyHint = document.getElementById('copy-hint');
const formatInput = document.getElementById('format-input');

function buildGrid() {
  grid.innerHTML = '';
  voices.forEach((v, i) => {
    const btn = document.createElement('button');
    btn.className = 'voice-btn' + (i === selectedIndex ? ' active' : '');
    const iconHTML = '<img src="' + v.image + '">';
    btn.innerHTML = '<span class="icon-row">' + iconHTML + v.name + '</span><span class="tag">' + /*"Minimum " +*/ v.cheerCost + " bits" + '</span>';
    btn.addEventListener('click', () => {
      stopPreview();
      selectedIndex = i;
      buildGrid();
      updateOutput();
    });
    grid.appendChild(btn);
  });
}

function updateCharcount() {
  const len = textInput.value.length;
  charcount.textContent = len + ' / 200';
  charcount.classList.toggle('over', len > 180);
}

function updateOutput() {
  const template = formatInput.value || '{cheerAmount} {voice}: {text}';
  const voiceName = voices[selectedIndex].name;
  const text = textInput.value.trim() || '';
  const minimumCheer = voices[selectedIndex].cheerCost;
  cmdText.textContent = template.replace('{cheerAmount}', minimumCheer).replace('{voice}', voiceName).replace('{text}', text);
}

function stopPreview() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  isPlaying = false;
  vu.classList.remove('playing');
  previewBtn.classList.remove('playing');
  previewBtn.textContent = '▶ Preview voice';
}

function playPreview() {
  const voice = voices[selectedIndex];
  if (!voice.files || !voice.files.length) {
    cmdText.textContent = 'No clips found for ' + voice.name + ' — Seraphim did a whoopsie. Go yell at him.';
    return;
  }
  const file = voice.files[Math.floor(Math.random() * voice.files.length)];
  const path = voice.folder + '/' + file;
  currentAudio = new Audio(path);
  currentAudio.onended = stopPreview;
  currentAudio.onerror = () => {
    stopPreview();
    console.error('Could not load: ' + path);
  };
  currentAudio.play();
  isPlaying = true;
  vu.classList.add('playing');
  previewBtn.classList.add('playing');
  previewBtn.textContent = '■ Stop';
}

previewBtn.addEventListener('click', () => {
  if (isPlaying) {
    stopPreview();
  } else {
    playPreview();
  }
});

textInput.addEventListener('input', () => { updateCharcount(); updateOutput(); });
formatInput.addEventListener('input', updateOutput);

outputPanel.addEventListener('click', () => {
  navigator.clipboard.writeText(cmdText.textContent).then(() => {
    outputPanel.classList.add('copied');
    copyHint.textContent = 'copied!';
    setTimeout(() => {
      outputPanel.classList.remove('copied');
      copyHint.textContent = 'click to copy';
    }, 1400);
  });
});

outputPanel.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); outputPanel.click(); }
});

buildGrid();
updateCharcount();
updateOutput();