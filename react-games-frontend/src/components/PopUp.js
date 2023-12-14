import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

function PopUp(props) {
  const navigate = useNavigate();
  return props.trigger ? (
    <div className="pop-up">
      <div>
        {props.children}
        <button
          style={{ color: "black" }}
          onClick={() => navigate("/games-in-react/home")}
        >
          Close
        </button>
        <button style={{ color: "black" }} onClick={() => props.restartGame()}>
          Restart
        </button>
      </div>
    </div>
  ) : (
    ""
  );
}

export default PopUp;
