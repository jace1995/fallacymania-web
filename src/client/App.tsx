import React from 'react'
import './App.css'
import { useCards } from './api'

export const App = () => {
  const { cards, changeCard } = useCards()

  return (
    <div className="container">
      {
        cards.map(card => (
          <img
            className="card"
            key={card}
            src={`/cards/${card}.png`}
            alt={card} 
            onClick={() => changeCard(card)}
          />
        ))
      }
    </div>
  )
}
