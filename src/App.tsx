import React, { useEffect } from 'react'
import './App.css'
import { useState } from 'react'
import { io } from 'socket.io-client'
import { Api } from './config'

const server = io()

export const App = () => {
  const [cards, updateCards] = useState<string[]>([])

  useEffect(() => {
    server.on('connect', () => {
      server.emit(Api.get_cards, (cards: string[]) => updateCards(cards))
    })
  }, [])

  const changeCard = (oldCard: string) => server.emit(
    Api.change_card,
    oldCard,
    (newCard: string) => updateCards(
      cards => cards.map(
        card => card === oldCard ? newCard : card
      )
    )
  )

  return (
    <div className="container">
      {
        cards.map(card => (
          <img
            key={card}
            src={`/cards/${card}.jpg`}
            alt={card} 
            onClick={() => changeCard(card)}
          />
        ))
      }
    </div>
  )
}
