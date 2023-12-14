import Grid2048 from "./components/Grid2048";
import WorkInProgress from "../../components/WorkInProgress";

function Game2048() {
  return (
    <div>
      <h1>2048</h1>
      <Grid2048 />
      <WorkInProgress />
    </div>
  );
}

export default Game2048;
