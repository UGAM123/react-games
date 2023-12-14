import { useEffect, useLayoutEffect, useState } from "react";
import "./Grid.css";
import PopUp from "../../../components/PopUp";

function Grid2048() {
  const whoosh = new Audio("assets/images/common/whoosh.mp3");
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchIdentifier, setTouchIdentifier] = useState(null);
  const [blocks, setBlocks] = useState(() => {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  });

  const removeZeros = (row) => {
    return row.filter((num) => num !== 0);
  };

  const addZeros = (row) => {
    while (row.length < 4) {
      row.push(0);
    }
    return row;
  };

  const slide = (row) => {
    // Slide
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        setScore((prevScore) => prevScore + row[i]);
        row[i] *= 2;
        row[i + 1] = 0;
      }
    }
    return row;
  };

  const slideUp = () => {
    for (let i = 0; i < blocks.length; i++) {
      let row = [];
      for (let j = 0; j < blocks[i].length; j++) {
        row.push(blocks[j][i]);
      }
      // remove zeros from the row
      row = removeZeros(row); // [2,2,0,2]

      row = slide(row);

      row = removeZeros(row);
      row = addZeros(row);
      setBlocks((blocks) => {
        blocks[0][i] = row[0];
        blocks[1][i] = row[1];
        blocks[2][i] = row[2];
        blocks[3][i] = row[3];
        return blocks;
      });
    }
  };

  const slideDown = () => {
    for (let i = 0; i < blocks.length; i++) {
      let row = [];
      for (let j = 0; j < blocks[i].length; j++) {
        row.push(blocks[j][i]);
      }
      row = row.reverse();
      // remove zeros from the row
      row = removeZeros(row); // [2,2,0,2]

      row = slide(row);

      row = removeZeros(row);
      row = addZeros(row);
      row = row.reverse();
      setBlocks((blocks) => {
        blocks[0][i] = row[0];
        blocks[1][i] = row[1];
        blocks[2][i] = row[2];
        blocks[3][i] = row[3];
        return blocks;
      });
    }
  };

  const slideLeft = () => {
    blocks.forEach((row, index) => {
      row = removeZeros(row); // remove zeros from the row

      // slide: merge if two adjacent are identical
      row = slide(row);

      row = removeZeros(row); // remove zero created after merge

      row = addZeros(row); // add zero to make length = 4
      setBlocks((blocks) => {
        blocks[index] = row;
        return blocks;
      });
    });
  };

  const slideRight = () => {
    blocks.forEach((row, index) => {
      row = row.reverse(); // reversing to use slide left logic
      row = removeZeros(row); // remove zeros from the row

      // slide: merge if two adjacent are identical
      row = slide(row);

      row = removeZeros(row); // remove zero created after merge
      row = addZeros(row); // add zero to make length = 4
      row = row.reverse(); // reverse again to get back the oriinal position
      setBlocks((blocks) => {
        blocks[index] = row;
        return blocks;
      });
    });
  };

  const calculateBlocks = (key) => {
    if (key === "ArrowUp") {
      slideUp();
    } else if (key === "ArrowDown") {
      slideDown();
    } else if (key === "ArrowLeft") {
      slideLeft();
    } else if (key === "ArrowRight") {
      slideRight();
    }
    if (whoosh.paused) {
      whoosh.play();
    } else {
      whoosh.currentTime = 0;
    }
  };

  const checkGameOver = () => {
    let tempBlocks = [...blocks];
    let value = true;
    tempBlocks[0] = removeZeros(tempBlocks[0]);
    tempBlocks[1] = removeZeros(tempBlocks[1]);
    tempBlocks[2] = removeZeros(tempBlocks[2]);
    tempBlocks[3] = removeZeros(tempBlocks[3]);

    tempBlocks.forEach((row, i) => {
      if (row.length < 4) {
        value = false;
        return value;
      }
    });
    tempBlocks.forEach((row, i) => {
      row.forEach((col, j) => {
        if (i < tempBlocks.length - 1 && j < row.length - 1) {
          if (
            tempBlocks[i][j] == tempBlocks[i + 1][j] ||
            tempBlocks[i][j] == tempBlocks[i][j + 1]
          ) {
            value = false;
            console.log(value);
            return value;
          }
        }
      });
    });
    return value;
  };

  const restartGame = () => {
    setBlocks(0);
    setBlocks((prevBlocks) => [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    setGameOver(false);
    generateBlock();
    generateBlock();
  };

  const generateBlock = () => {
    setBlocks((prevBlocks) => {
      var coords = [];
      prevBlocks.forEach((row, i) => {
        row.forEach((element, j) => {
          if (element === 0) {
            coords.push([i, j]);
          }
        });
      });

      if (coords.length !== 0) {
        const randomElement = coords[Math.floor(Math.random() * coords.length)];
        const values = [2, 4];
        prevBlocks[randomElement[0]][randomElement[1]] =
          values[Math.floor(Math.random() * values.length)];
      }
      return prevBlocks;
    });
  };

  const detectKeyPress = (e) => {
    if (e instanceof KeyboardEvent) {
      const key = e.key;
      if (key.includes("Arrow")) {
        calculateBlocks(key);
        generateBlock();
      }
    } else if (e instanceof TouchEvent) {
      if (e.type == "touchstart") {
        document.body.style.overflow = "hidden";
        let identifier = e.changedTouches[0].identifier;
        let touchX = e.changedTouches[0].screenX;
        let touchY = e.changedTouches[0].screenY;
        console.log(identifier);
        setTouchIdentifier((prev) => {
          let newIdentifier = null;
          if (prev == null) {
            newIdentifier = {
              identifier: identifier,
              initialTouchX: touchX,
              initialTouchY: touchY,
            };
            return newIdentifier;
          }
          return null;
        });
      } else if (e.type == "touchend") {
        let identifier = e.changedTouches[0].identifier;
        let latestX = e.changedTouches[0].screenX;
        let latestY = e.changedTouches[0].screenY;
        setTouchIdentifier((prev) => {
          if (prev != null) {
            if (identifier == prev.identifier) {
              let x_diff = latestX - prev.initialTouchX;
              let y_diff = latestY - prev.initialTouchY;
              console.log(x_diff, y_diff);
              if (Math.abs(x_diff) >= 30 || Math.abs(y_diff) >= 30) {
                if (Math.abs(x_diff) > Math.abs(y_diff)) {
                  x_diff >= 0
                    ? calculateBlocks("ArrowRight")
                    : calculateBlocks("ArrowLeft");
                } else {
                  y_diff <= 0
                    ? calculateBlocks("ArrowUp")
                    : calculateBlocks("ArrowDown");
                }
                generateBlock();
              }
              return null;
            }
          }
          return prev;
        });
        document.body.style.overflow = "auto";
      }
    }
  };

  useEffect(() => {
    // console.log("ontouchstart" in document.documentElement);
    let touchArea = document.getElementById("grid2048");
    window.addEventListener(
      "keydown",
      function (e) {
        if (
          ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
            e.code
          ) > -1
        ) {
          e.preventDefault();
        }
      },
      false
    );
    document.addEventListener("keyup", detectKeyPress, true);
    touchArea.addEventListener("touchstart", detectKeyPress, true);
    touchArea.addEventListener("touchend", detectKeyPress, true);
    generateBlock();
    generateBlock();
  }, []);
  useLayoutEffect(() => {
    setTimeout(() => {
      if (checkGameOver(...blocks)) {
        console.log("Game Over : ", checkGameOver(...blocks));
        setGameOver(true);
      }
      setLastUpdated(Date.now());
    }, 100);
  }, [lastUpdated, touchIdentifier]);
  const flattenedArray = blocks.flat();
  return (
    <>
      <p>
        Score : <span id="score"> {score} </span>
      </p>
      <div className="grid2048-container" id="grid2048">
        {flattenedArray.map((number, index) => (
          <section key={`${index}`} className={`grid2048-item x${number}`}>
            {number}
          </section>
        ))}
      </div>
      <PopUp trigger={gameOver} restartGame={restartGame}>
        <h1>Game Over</h1>
      </PopUp>
    </>
  );
}

export default Grid2048;
