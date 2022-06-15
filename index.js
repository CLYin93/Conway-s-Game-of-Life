const unitLength = 20;
const boxColor = 150;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;

/**my create */
let playCheck = true;
let tempcheck = false;
let fs = 5;
// let runTime = 0;
// let gtion = 0;
let neighbors = 0;
let minPeople = 2;
let maxPeople = 3;
let newPeople = 3;

let tempMinPeople = 0;
let tempMaxPeople = 0;

let upCount = 0;
let rightCount = 0;

let patternsName = "GosperGliderGun";

let saveX = [];
let saveY = [];

let patterns = {
  GosperGliderGun: [
    [
      0, 0, 1, 1, 10, 10, 10, 11, 11, 12, 12, 13, 13, 14, 15, 15, 16, 16, 16,
      17, 20, 20, 20, 21, 21, 21, 22, 22, 24, 24, 24, 24, 34, 34, 35, 35,
    ],
    [
      4, 5, 4, 5, 4, 5, 6, 3, 7, 2, 8, 2, 8, 5, 3, 7, 4, 5, 6, 5, 2, 3, 4, 2, 3,
      4, 1, 5, 0, 1, 5, 6, 2, 3, 2, 3,
    ],
  ],
};

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth * 0.75, windowHeight * 0.75 - 50);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor((windowWidth * 0.75) / unitLength);
  rows = floor((windowHeight * 0.75 - 50) / unitLength);

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
      currentBoard[i][j] = [
        0, 0, 0,
      ]; /**[0,0,0] 1st:check life, 2rd: check generation, 3nd:temp, */
      nextBoard[i][j] = [0, 0, 0];
    }
  }
}

function windowResized() {
  // console.log(true);
  resizeCanvas(windowWidth * 0.75, windowHeight * 0.75 - 50);
  columns = floor((windowWidth * 0.75) / unitLength);
  rows = floor((windowHeight * 0.75 - 50) / unitLength);
}

function bugCheck() {
  // console.log(maxPeople)
  if (minPeople > maxPeople) {
    minPeople = tempMinPeople;
    alert("you can not do this!  Rules: minPeople < maxPeople");
  }
  if (maxPeople < minPeople) {
    maxPeople = tempMaxPeople;
    alert("you can not do this!  Rules: maxPeople > minPeople");
  }
}

function draw() {
  background(240, 196, 93);
  tempBox();

  keyboardMode();
  frameRate(fs);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j][0] == 1) {
        if (currentBoard[i][j][1] > 2) {
          boxColorg(currentBoard[i][j][1]);
        } else {
          fill(200);
        }
      } else {
        fill(255);
      }
      if (currentBoard[i][j][2] == 1) {
        fill(200);
      }

      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }

  generate();
}

function generate() {
  bugCheck();
  if (playCheck) {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        // Count all living members in the Moore neighborhood(8 boxes surrounding)
        neighbors = 0;

        for (let i of [-1, 0, 1]) {
          for (let j of [-1, 0, 1]) {
            let count = 0;

            if (i == 0 && j == 0) {
              // the cell itself is not its own neighbor
              continue;
            } else {
              // The modulo operator is crucial for wrapping on the edge
              neighbors +=
                currentBoard[(x + i + columns) % columns][
                  (y + j + rows) % rows
                ][0];
            }
          }
        }

        // // Rules of Life
        // if (currentBoard[x][y][0] == 1 && neighbors < 2) {
        //   // Die of Loneliness
        //   nextBoard[x][y][0] = 0;
        //   nextBoard[x][y][1] = 0;
        //   nextBoard[x][y][2] = 0;
        // } else if (currentBoard[x][y][0] == 1 && neighbors > 3) {
        //   // Die of Overpopulation
        //   nextBoard[x][y][0] = 0;
        //   nextBoard[x][y][1] = 0;
        //   nextBoard[x][y][2] = 0;
        // } else if (currentBoard[x][y][0] == 0 && neighbors == 3) {
        //   // New life due to Reproduction
        //   nextBoard[x][y][0] = 1;
        //   nextBoard[x][y][1] = 0;
        // } else {
        //   // Stasis
        //   nextBoard[x][y][0] = currentBoard[x][y][0];
        //   nextBoard[x][y][1] = currentBoard[x][y][1];
        //   nextBoard[x][y][1] += 1;
        // }

        if (currentBoard[x][y][0] == 1) {
          if (neighbors < minPeople) {
            nextBoard[x][y][0] = 0;
            nextBoard[x][y][1] = 0;
            nextBoard[x][y][2] = 0;
            continue;
          } else if (neighbors > maxPeople) {
            nextBoard[x][y][0] = 0;
            nextBoard[x][y][1] = 0;
            nextBoard[x][y][2] = 0;
            continue;
          } else if (neighbors >= minPeople && neighbors <= maxPeople) {
            nextBoard[x][y][0] = currentBoard[x][y][0];
            nextBoard[x][y][1] = currentBoard[x][y][1];
            nextBoard[x][y][1] += 1;
            continue;
          }
        } else if (currentBoard[x][y][0] == 0) {
          if (neighbors == newPeople) {
            nextBoard[x][y][0] = 1;
            nextBoard[x][y][1] = 0;
          } else {
            nextBoard[x][y][0] = 0;
            nextBoard[x][y][1] = 0;
          }
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
  currentBoard[x][y][0] = 1;
  currentBoard[x][y][1] = 0;
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

function tempBox() {
  // console.log(tempcheck)
  if (tempcheck) {
  } else {
    // console.log("hi")
    /* have bug! (if I zoom in and zoom out my chrome bug can fix  */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          currentBoard[i][j][2] = 0;
        }
      }
    } else {
      let x = Math.floor(mouseX / unitLength);
      let y = Math.floor(mouseY / unitLength);

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          currentBoard[i][j][2] = 0;
        }
      }
      // console.log(x);
      currentBoard[x][y][2] = 1;
    }
  }
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
        currentBoard[x][y][0] = 1;
        fill(boxColor);
        stroke(strokeColor);
      }
    }
  }
}

function boxColorg(t) {
  if (t >= 360) {
    t = t % 360;
  }
  fill(color(`hsl(${t}, 100%, 50%)`));
}

function saveP() {
  playCheck = false;

  patternsName = document.querySelector("#PatternName").value;
  document.querySelector("#PatternName").value = "";

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      if (currentBoard[x][y][0] == 1) {
        saveX.push(x);
        saveY.push(y);

        console.log(saveX, saveY);
        playCheck = true;

        // console.log( currentBoard[x][y])
      } else {
      }
    }
  }

  patterns[patternsName] = [saveX, saveY];

  {
    var x = document.getElementById("loadPS");
    var option = document.createElement("option");
    option.text = `${patternsName}`;
    option.value = `${patternsName}`;
    x.add(option);
  }
}

function loadP() {
  init();
  let count = 0;
  // console.log(patternsName)
  playCheck = false;

  for (const [key, value] of Object.entries(patterns)) {
    // console.log(key)
    // console.log(patternsName)
    if (patternsName == key) {
      // console.log(count)

      let firstValue = Object.values(patterns)[count];
      // console.log(firstValue[0]);

      for (let i = 0; i <= firstValue[0].length - 1; i++) {
        let x = firstValue[0][i];
        let y = firstValue[1][i];
        console.log(x);
        console.log(y);
        // let a = [1,0,0]

        currentBoard[x][y][0] = 1;
        currentBoard[x][y][1] = 0;
      }
      count = 0;
    } else {
      count += 1;
    }
  }
}

function keyboardMode() {
  if (tempcheck) {
    playCheck = false;

    console.log(rightCount);

    currentBoard[rightCount][upCount][2] = 1;
    keyTyped();
    // conddsole.log(key)
    function keyTyped() {
      // console.log(rightCount)
      // console.log(upCount)
      if (key === "d") {
        currentBoard[rightCount][upCount][2] = 0;
        rightCount += 1;
        console.log(rightCount);
        currentBoard[rightCount][upCount][2] = 1;
        key = 0;
      } else if (key === "s") {
        currentBoard[rightCount][upCount][2] = 0;
        upCount += 1;
        currentBoard[rightCount][upCount][2] = 1;
        key = 0;
      } else if (key === "w") {
        if (upCount == 0) {
        } else {
          currentBoard[rightCount][upCount][2] = 0;
          upCount -= 1;
          currentBoard[rightCount][upCount][2] = 1;
          key = 0;
        }
      } else if (key === "a") {
        if (rightCount == 0) {
        } else {
          currentBoard[rightCount][upCount][2] = 0;
          rightCount -= 1;
          currentBoard[rightCount][upCount][2] = 1;
          key = 0;
        }
      } else if (key == "e") {
        console.log("HI");
        currentBoard[rightCount][upCount][0] = 1;
        currentBoard[rightCount][upCount][1] = 1;
        return;
      } else if (key == "q") {
        tempcheck = false;
        playCheck = true;
        rightCount=0
        upCount =0
      }
    }
  } else {
  }
}

/**------------------------------------------------------------------------------------------ */
document.querySelector("#reset-game").addEventListener("click", function () {
  init();
});

document.querySelector("#saveP").addEventListener("click", function () {
  saveP();
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

/*------------------------------------------ Rules of Life----------------------------------*/
document.querySelector("#minPeople").addEventListener("change", function () {
  // tempMinPeople = minPeople
  minPeople = parseInt(this.value);
});

document.querySelector("#maxPeople").addEventListener("change", function () {
  // tempMaxPeople = maxPeople
  maxPeople = parseInt(this.value);
});

document.querySelector("#newPeople").addEventListener("change", function () {
  newPeople = parseInt(this.value);
});

/*------------------------------------------ Rules of Life----------------------------------*/

document.querySelector("#saveP").addEventListener("change", function () {
  saveP();
});

document.querySelector("#loadP").addEventListener("click", function () {
  loadP();
});

document.querySelector("#loadPS").addEventListener("change", function () {
  patternsName = this.value;
});

/* Set the width of the sidebar to 250px (show it) */
function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}

document.querySelector("#keyboardMode").addEventListener("click", function () {
  tempcheck = true;
});
