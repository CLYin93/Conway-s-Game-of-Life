const unitLength = 20;
const boxColor = 150;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;

/**my create */
playCheck = true;
let fs = 1;
let runTime = 0;

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard
}

function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

function draw() {
  background(255);

  frameRate(fs);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(boxColor);
      } else {
        fill(255);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }

  generate();
}
function generate() {
  if (playCheck) {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        // Count all living members in the Moore neighborhood(8 boxes surrounding)
        let neighbors = 0;
        for (let i of [-1, 0, 1]) {
          for (let j of [-1, 0, 1]) {
            if (i == 0 && j == 0) {
              // the cell itself is not its own neighbor
              continue;
            }
            // The modulo operator is crucial for wrapping on the edge
            neighbors +=
              currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
          }
        }

        // Rules of Life
        if (currentBoard[x][y] == 1 && neighbors < 2) {
          // Die of Loneliness
          nextBoard[x][y] = 0;
        } else if (currentBoard[x][y] == 1 && neighbors > 3) {
          // Die of Overpopulation
          nextBoard[x][y] = 0;
        } else if (currentBoard[x][y] == 0 && neighbors == 3) {
          // New life due to Reproduction
          nextBoard[x][y] = 1;
        } else {
          // Stasis
          nextBoard[x][y] = currentBoard[x][y];
        }
      }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
  }
}

function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  fill(boxColor);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop();
  mouseDragged();
}

/**
 * When mouse is released
 */

function mouseReleased() {
  loop();
}

function randomCreate() {
  let range = parseFloat(RandomDivBar.value) / 100;

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      if (Math.random() <= range) {
        currentBoard[x][y] = 1;
        fill(boxColor);
        stroke(strokeColor);
      }
    }
  }
}

/**------------------------------------------------------------------------------------------ */
document.querySelector("#reset-game").addEventListener("click", function () {
  init();
});

document.querySelector("#pause-game").addEventListener("click", function () {
  if (playCheck) {
    playCheck = false;
    document.querySelector("#pause-game").innerHTML = "Run";
    document.querySelector("#pause-game").classList.remove("game-run");
    document.querySelector("#pause-game").classList.add("game-pause");
  } else {
    playCheck = true;
    document.querySelector("#pause-game").innerHTML = "Pause";
    document.querySelector("#pause-game").classList.remove("game-pause");
    document.querySelector("#pause-game").classList.add("game-run");
  }
});

document.querySelector("#randomCreate").addEventListener("click", function () {
  init();
  randomCreate();
});

document
  .querySelector("#RandomDivBar")
  .addEventListener("mousemove", function () {
    document.querySelector("#randomNumber").innerHTML = RandomDivBar.value;
  });

document
  .querySelector("#frameRateC")
  .addEventListener("mousemove", function () {
    document.querySelector("#frameRate").innerHTML = frameRateC.value;
    fs = parseInt(frameRateC.value);
  });
