import React, { useState } from 'react'

function TicTacToe() {

  const [pieces, setPieces] = useState("")

  return (
    <div className='tic-tac-toe-container'>
      <section></section>
      <section className='tic-tac-toe-board'>

      </section>
      <section></section>
    </div>
  )
}

export default TicTacToe