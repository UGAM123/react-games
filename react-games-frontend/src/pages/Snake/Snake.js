import { useEffect, useLayoutEffect, useState } from "react";
import WorkInProgress from "../../components/WorkInProgress";
import "./Snake.css";

function Snake() {
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [touchIdentifier, setTouchIdentifier] = useState(null);
  const [snakeMoveTimer, setsnakeMoveTimer] = useState(
    setTimeout(() => {
      moveSnake();
      setLastUpdated(Date.now());
    }, 500)
  );
  const [direction, setDirection] = useState("LEFT");
  const [food, setFood] = useState({ x: 8, y: 10 });
  const [snake, setSnake] = useState(() => {
    return [
      { x: 10, y: 10 },
      { x: 11, y: 10 },
    ];
  });

  const checkFoodEaten = () => {
    if (snake[0].x === food.x && snake[0].y === food.y) {
      setFood({
        x: Math.floor(Math.random() * (20 - 1 + 1) + 1),
        y: Math.floor(Math.random() * (20 - 1 + 1) + 1),
      });
      growSnake();
    }
  };
  const growSnake = () => {
    setSnake((prevSnake) => {
      let prevSnakeLength = prevSnake.length;
      let x_diff =
        prevSnake[prevSnakeLength - 1].x - prevSnake[prevSnakeLength - 2].x;
      let y_diff =
        prevSnake[prevSnakeLength - 1].y - prevSnake[prevSnakeLength - 2].y;
      let newBlock = {
        x: prevSnake[prevSnakeLength - 1].x + x_diff,
        y: prevSnake[prevSnakeLength - 1].y + y_diff,
      };
      prevSnake.push(newBlock);
      return prevSnake;
    });
  };
  const moveSnake = () => {
    if (direction === "LEFT") {
      setSnake((prevSnake) => {
        let newSnake = [{ x: 0, y: 0 }];
        newSnake[0].x = prevSnake[0].x - 1;
        newSnake[0].y = prevSnake[0].y;
        newSnake.push(...prevSnake);
        newSnake.pop();
        return newSnake;
      });
    } else if (direction === "RIGHT") {
      setSnake((prevSnake) => {
        let newSnake = [{ x: 0, y: 0 }];
        newSnake[0].x = prevSnake[0].x + 1;
        newSnake[0].y = prevSnake[0].y;
        newSnake.push(...prevSnake);
        newSnake.pop();
        return newSnake;
      });
    } else if (direction === "UP") {
      setSnake((prevSnake) => {
        let newSnake = [{ x: 0, y: 0 }];
        newSnake[0].x = prevSnake[0].x;
        newSnake[0].y = prevSnake[0].y - 1;
        newSnake.push(...prevSnake);
        newSnake.pop();
        return newSnake;
      });
    } else if (direction === "DOWN") {
      setSnake((prevSnake) => {
        let newSnake = [{ x: 0, y: 0 }];
        newSnake[0].x = prevSnake[0].x;
        newSnake[0].y = prevSnake[0].y + 1;
        newSnake.push(...prevSnake);
        newSnake.pop();
        return newSnake;
      });
    }
  };
  const changeDirection = (key) => {
    console.log(key);
    setDirection((prevDirection) => {
      let newDirection = prevDirection;
      if ((key === "ArrowUp" || key === "w") && prevDirection != "DOWN") {
        newDirection = "UP";
      } else if (
        (key === "ArrowDown" || key === "s") &&
        prevDirection != "UP"
      ) {
        newDirection = "DOWN";
      } else if (
        (key === "ArrowLeft" || key === "a") &&
        prevDirection != "RIGHT"
      ) {
        newDirection = "LEFT";
      } else if (
        (key === "ArrowRight" || key === "d") &&
        prevDirection != "LEFT"
      ) {
        newDirection = "RIGHT";
      }
      return newDirection;
    });
  };

  const renderElements = () => {
    // Get Html Element to render the elements
    let snakeBoard = document.getElementById("snake-board");
    snakeBoard.replaceChildren();

    snake.forEach((element) => {
      let snakeElement = document.createElement("div");
      snakeElement.style.gridColumnStart = element.x;
      snakeElement.style.gridRowStart = element.y;
      snakeElement.classList.add("snake");
      snakeBoard.append(snakeElement);
    });

    let foodElement = document.createElement("div");
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;
    foodElement.classList.add("food");
    snakeBoard.append(foodElement);
  };

  const detectKeyPress = (e) => {
    if (e instanceof KeyboardEvent) {
      const key = e.key;
      if (key.includes("Arrow")) {
        changeDirection(key);
      }
    } else if (e instanceof TouchEvent) {
      if (e.type == "touchstart") {
        document.body.style.overflow = "hidden";
        let identifier = e.changedTouches[0].identifier;
        let touchX = e.changedTouches[0].screenX;
        let touchY = e.changedTouches[0].screenY;
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
                    ? changeDirection("ArrowRight")
                    : changeDirection("ArrowLeft");
                } else {
                  y_diff <= 0
                    ? changeDirection("ArrowUp")
                    : changeDirection("ArrowDown");
                }
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
    let touchArea = document.getElementById("snake-board");
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
  }, []);
  useEffect(() => {
    renderElements();
    checkFoodEaten();
  });
  useLayoutEffect(() => {
    setTimeout(() => {
      moveSnake();
      setLastUpdated(Date.now());
    }, 500);
  }, [lastUpdated]);

  return (
    <div>
      <h3>Snake</h3>
      <div id="snake-board"></div>
      <WorkInProgress />
    </div>
  );
}

export default Snake;
