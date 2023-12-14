import React, { useEffect, useState } from "react";

function WorkInProgress() {
  const [dots, setDots] = useState(".");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (count === 10) {
        setCount(0);
      } else {
        setCount(count + 1);
      }

      if (dots === "......") {
        setDots(".");
      } else {
        setDots(dots + ".");
      }
    }, 500);
  }, [count, dots]);

  return <p>Work in Progress{dots}</p>;
}

export default WorkInProgress;
