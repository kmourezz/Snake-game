export default {
  _modal: document.querySelector('.modal'),
  _enterForm: document.querySelector('.enter-form'),
  _messageForm: document.querySelector('.message-form'),
  _inputHorizontal: document.querySelector('.enter-form input[data-id="dim-horz"]'),
  _inputVertical: document.querySelector('.enter-form input[data-id="dim-vert"]'),
  _score: document.querySelector('.final-score .mark'),

  enterFormShow() {
    this._modal.classList.remove('hidden');
    this._enterForm.classList.remove('hidden');
    this._messageForm.classList.add('hidden');
    this.toDefault();
  },

  toDefault() {
    this._inputHorizontal.value = 20;
    this._inputVertical.value = 20;
  },

  checkCorrectFieldDimension() {
    let horizontal = Math.min(Math.max(this._inputHorizontal.value, 10), 100);
    let vertical = Math.min(Math.max(this._inputVertical.value, 10), 100);
    if (horizontal != this._inputHorizontal.value || vertical != this._inputVertical.value) {
      this._inputHorizontal.value = horizontal;
      this._inputVertical.value = vertical;
      return false;
    }
    return true;
  },

  getCorrectFieldDimension() {
    return {
      horizontal: this._inputHorizontal.value,
      vertical: this._inputVertical.value
    }
  },

  messageFormShow() {
    this._modal.classList.remove('hidden');
    this._messageForm.classList.remove('hidden');
    this._enterForm.classList.add('hidden');
  },

  hideModal() {
    this._modal.classList.add('hidden');
    this._enterForm.classList.add('hidden');
    this._messageForm.classList.add('hidden');
  },

  setScore(score) {
    this._score.innerText = score;
  }
};
