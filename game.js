
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    const timer = document.querySelector('#timer');
    const emojiBtn = document.querySelector('.emoji-btn');
    let width = 10;
    let bombAmount = 30;
    let flags = 0;
    let squares = [];
    let count = 0; 
    let intervalRef = null; 
    let isGameOver = false;
    
   
    function createBoard() {
    
      const bombsArray = Array(bombAmount).fill('bomb'); 
      const emptyArray = Array(width * width - bombAmount).fill('valid'); 
      const gameArray = emptyArray.concat(bombsArray); 
      const shuffledArray = gameArray.sort(() => Math.random() - 0.5); 
  
      emojiBtn.innerHTML = '🙂';
      flagsLeft.innerHTML = bombAmount;
  
      for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledArray[i]);
        grid.appendChild(square);
        squares.push(square);
  
        square.addEventListener('click', function(e) {
          if (isGameOver) { return }
          emojiBtn.innerHTML = '😬';
          click(square);
        });
  
        square.oncontextmenu = function(e) {
          e.preventDefault();
          addFlag(square);
        }
  
        square.addEventListener('mouseover', function(e) {
          if (isGameOver) { return }
          emojiBtn.innerHTML = '🤔'; 
        });
      }
  
      for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);
  
        if (squares[i].classList.contains('valid')) {
          if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) { total++ };
          if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) { total++ };
          if (i > 10 && squares[i - width].classList.contains('bomb')) { total++ };
          if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) { total++ };
          if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) { total++ };
          if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) { total++ };
          if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) { total++ };
          if (i < 89 && squares[i + width].classList.contains('bomb')) { total++ };
          squares[i].setAttribute('data', total);
        }
      }
    }
    createBoard();
  
    function addFlag(square) {
      if (isGameOver) { return }
      if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
          square.classList.add('flag');
          square.innerHTML = '🚩';
          flags++;
          flagsLeft.innerHTML = bombAmount - flags;
          checkForWin();
        } else { 
          square.classList.remove('flag');
          square.innerHTML = '';
          flags--;
          flagsLeft.innerHTML = bombAmount - flags; 
        } 
      }
    }
  
    function click(square) {
      let currentId = square.id;
      if (isGameOver) { return };
      if (square.classList.contains('checked') || square.classList.contains('flag')) { return };
      if (square.classList.contains('bomb')) {
        gameOver();
      } else {
        let total = square.getAttribute('data');
        if (total != 0) {
          square.classList.add('checked');
          if (total == 1) { square.classList.add('one') }; 
          if (total == 2) { square.classList.add('two') };
          if (total == 3) { square.classList.add('three') };
          if (total == 4) { square.classList.add('four') };
          square.innerHTML = total;
          return
        }
        checkSquare(square, currentId);
      }
      square.classList.add('checked');
    }
  
   
    function checkSquare(square, currentId) {
      const isLeftEdge = (currentId % width === 0)
      const isRightEdge = (currentId % width === width -1)
  
      setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
          const newId = squares[parseInt(currentId) - 1].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) {
          const newId = squares[parseInt(currentId) + 1 - width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId >= 10) {
          const newId = squares[parseInt(currentId - width)].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId >= 11 && !isLeftEdge) {
          const newId = squares[parseInt(currentId) - 1 - width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId <= 98 && !isRightEdge) {
          const newId = squares[parseInt(currentId) + 1].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 90 && !isLeftEdge) {
          const newId = squares[parseInt(currentId) - 1 + width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId <= 88 && !isRightEdge) {
          const newId = squares[parseInt(currentId) + 1 + width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId <= 89) {
          const newId = squares[parseInt(currentId) + width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
      }, 10);
    }
  
    let startTime = function() {
      intervalRef = setInterval(() => {
        count+=10;
        let s = Math.floor((count / 1000));
        timer.innerHTML = s;
        if (s >= 90) {
          clearInterval(intervalRef);
          timeUp();
        }
      }, 10);
      removeEventListener('click', startTime);
    }
    window.addEventListener('click', startTime);
  
    function timeUp() {
      timer.innerHTML = 'BOOM!';
      emojiBtn.innerHTML = '😞';
      result.innerHTML = 'Zaman Doldu!';
      isGameOver = 'true';
  
      squares.forEach(square => {
        if (square.classList.contains('bomb')) {
          square.innerHTML = '💣';
        }
      });
    }
  
    function gameOver(square) {
      clearInterval(intervalRef);
      timer.innerHTML = 'BOOM!';
      emojiBtn.innerHTML = '😵';
      result.innerHTML = 'Oyun Bitti!';
      isGameOver = true;
  
      squares.forEach(square => {
        if (square.classList.contains('bomb')) {
          square.innerHTML = '💣';
        }
      });
    }
  
    function checkForWin() {
      let matches = 0;
  
      for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
          matches++;
        }
        if (matches === bombAmount) {
          clearInterval(intervalRef);
          timer.innerHTML = 'EVET!'
          emojiBtn.innerHTML = '😎';
          result.innerHTML = 'KAZANDIN!';
          isGameOver = true;
        }
      }
    }
  
    emojiBtn.addEventListener('click', function(e) {
      emojiBtn.style.borderColor = '#F0B7A4 #FFEBCF #FFEBCF #F0B7A4';
      location.reload();
    });
  });