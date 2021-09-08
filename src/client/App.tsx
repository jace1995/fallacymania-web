import React from 'react'
import './App.css'
import { useCards, useConnection } from './api'

export const App = () => {
  const connected = useConnection()
  const { cards, changeCard } = useCards()

  return (
    connected ? (
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
    ) : (
      <h1>Нет соединения с сервером</h1>
    )
  )
}
