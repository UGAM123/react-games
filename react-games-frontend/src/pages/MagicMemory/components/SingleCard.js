import "./SingleCard.css";

export default function SingleCard({ card, handleChoice, flipped }) {
  const handleClick = () => {
    handleChoice(card);
  };
  return (
    <div className="card">
      <div className={flipped ? "flipped":""}>
        <img className="front" src={card.src} alt="card front"></img>
        <img
          className="back"
          src="react-games/assets/images/magic-memory/cover.png"
          onClick={handleClick}
          alt="card back"
        ></img>
      </div>
    </div>
  );
}
