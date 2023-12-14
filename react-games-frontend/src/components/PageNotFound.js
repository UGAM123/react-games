import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    setTimeout(() => {
      setCount(count - 1);
      if (count === 0) {
        navigate("/react-games/home");
      }
      console.log(count);
    }, 1000);
  }, [count]);

  return (
    <div style={{ color: "white" }}>
      <h2>Unexpected Application Error!</h2>
      <h3> ❌ 404 Not Found</h3>
      <p>Navigating to home in {count} seconds.</p>
    </div>
  );
}

export default PageNotFound;
