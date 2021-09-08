import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Api } from '../common/api'

const server = io()

export const useConnection = () => {
  const [connected, setConnected] = useState(false)

  server.on('connect', () => setConnected(true))
  server.on('disconnect', () => setConnected(false))

  return connected
}

export const useCards = () => {
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

  return { cards, changeCard }
}
