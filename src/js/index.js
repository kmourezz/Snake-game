import Config from './config.js';
import Forms from './forms.js';
import Field from './field.js';
import '../scss/style.scss';

(function(document, window) {
  let gameField, dt, time, userDimension,
      isGameCanContinue = false,
      domScore = document.querySelector('.game-score');
  const frequency = Config.gameFrequencyUpdate;

  const init = () => {
    dt = 0;
    time = Date.now();
    isGameCanContinue = true;
    gameField = new Field(userDimension);

    const element = document.querySelector('.game-field');
    element.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.width = gameField.getHorizontalSize();
    canvas.height = gameField.getVerticalSize();
    canvas.style.width = `${gameField.getHorizontalSize()}px`;
    canvas.style.height = `${gameField.getVerticalSize()}px`;
    const context = canvas.getContext('2d');

    gameField.setContext(context);
    gameField.createBackground();

    let dataCtx = canvas.toDataURL(),
        backgroundImg = new Image();
    backgroundImg.src = dataCtx;
    canvas.style.backgroundImage = `url(${backgroundImg.src})`;
    context.clearRect(0, 0, canvas.width, canvas.height);

    element.appendChild(canvas);

    gameField.init();

    const update = () => {
      let currentTime = Date.now();
      dt += (currentTime - time);
      if (dt >= Math.round(1000/frequency)) {
        dt %= Math.round(1000/frequency);
        gameField.update();
      }
      time = currentTime;
      if (isGameCanContinue) {
        window.requestAnimationFrame(update);
      }
    };

    document.onkeyup = function(e) {
      if (!isGameCanContinue) {
        return;
      }
      let isTurn = false;
      switch (e.keyCode) {
        case 37:
          isTurn = gameField.turnLeft();
          break;
        case 38:
          isTurn = gameField.turnTop();
          break;
        case 39:
          isTurn = gameField.turnRight();
          break;
        case 40:
          isTurn = gameField.turnBottom();
          break;
      }
      if (isTurn) {
        dt = 0;
      }
    };

    window.requestAnimationFrame(update);
  };

  const updateScore = () => {
    domScore.innerText = `Score: ${gameField.score}`;
  };

  document.querySelector('.modal').addEventListener('click', function(e) {
    switch (e.target.dataset.action) {
      case 'play':
        if (Forms.checkCorrectFieldDimension()) {
          Forms.hideModal();
          userDimension = Forms.getCorrectFieldDimension();
          init();
          updateScore();
        }
        break;
      case 'default':
        Forms.toDefault();
        break;
      case 'close':
        Forms.hideModal();
    }
  });

  document.addEventListener('score', updateScore);

  document.addEventListener('crash', () => {
    isGameCanContinue = false;
    Forms.setScore(gameField.score);
    Forms.messageFormShow();
  });

  //Enter main point
  Forms.enterFormShow();
})(document, window);
