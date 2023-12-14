import { useEffect, useState } from "react";
import "./MagicMemory.css";
import SingleCard from "./components/SingleCard.js";

const cardImages = [
  { src: "assets/images/magic-memory/helmet-1.png", matched: false },
  { src: "assets/images/magic-memory/potion-1.png", matched: false },
  { src: "assets/images/magic-memory/ring-1.png", matched: false },
  { src: "assets/images/magic-memory/scroll-1.png", matched: false },
  { src: "assets/images/magic-memory/shield-1.png", matched: false },
  { src: "assets/images/magic-memory/sword-1.png", matched: false },
];

function MagicMemory() {
  const audio = new Audio("assets/images/magic-memory/card-flip.mp3")
  const correct_audio = new Audio("assets/images/common/correct.mp3")
  const succes_audio = new Audio("assets/images/common/success.mp3")
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);

  //Shuffle Cards
  const shuffleCards = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
  };

  //Handle choice
  const handleChoice = (card) => {
    audio.playbackRate = 3
    audio.play()
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const checkGameCompeleted = () => {
    setCards((prevCards) => {
      let compeleted = true
      prevCards.forEach(card => {
        if (!card.matched) {
          compeleted = false
        }
      });
      console.log(prevCards);
      if (compeleted) { succes_audio.play() }
      return prevCards
    })


  }

  //Compare Choice
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      if (choiceOne.src === choiceTwo.src) {
        correct_audio.play()
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 200);
      }
    }
  }, [choiceOne, choiceTwo]);

  //reset Turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    checkGameCompeleted()
  };

  useEffect(() => {
    shuffleCards()
  }, [])
  // console.log(cards, turns);

  return (
    <div className="container">
      <h1 style={{color:"white"}}>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
          />
        ))}
      </div>
      <p>Turns : {turns}</p>
    </div>
  );
}

export default MagicMemory;
