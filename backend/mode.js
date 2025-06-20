// backend/mode.js
let currentMode = 'demo'; // padrão inicial

function getMode() {
  return currentMode;
}

function setMode(newMode) {
  if (['demo', 'real'].includes(newMode)) {
    currentMode = newMode;
  }
}

module.exports = { getMode, setMode };
