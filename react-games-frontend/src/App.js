import "./App.css";
import Messaging from "./pages/Messaging/Messaging";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem("user");
    if (user) {
      let savedUser = JSON.parse(user);
      return savedUser;
    } else {
      return { userName: "Guest" };
    }
  });
  useEffect(() => {
    if (user.userName === "") {
      navigate("/login");
    }
  }, []);
  return (
    <div>
      <Navbar name={user.userName} />
      <Outlet />
      <Messaging />
    </div>
  );
}

export default App;
