import "./Home.css";
import games from "../../json/games.json";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="grid-view">
      {games.map((game) => {
        return (
          <div className="grid-item" key={game.name}>
            <Link to={"/games" + game.path} style={{ color: "white" }}>
              <img src={game.image} alt={game.name + "-logo"} />
              <p>{game.name}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
