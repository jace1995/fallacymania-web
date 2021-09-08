const handSize = 5 // количество карт на руке

import { Socket } from 'socket.io'
import { random, shuffle } from 'lodash'
import { Api } from '../common/api'
import { cardsBase } from '../common/cards'

const hands: Record<string, string[]> = {}
let deck: string[] = shuffle(cardsBase)

const getBusyCards = () => Object.values(hands).reduce(
  (list, hand) => [...list, ...hand], 
  [] as string[]
)

const takeRandomCard = () => {
  if (!deck.length) {
    const busyCards = getBusyCards()
    deck = shuffle(
      cardsBase.filter(
        card => !busyCards.includes(card)
      )
    )
  }
  
  return deck.splice(random(deck.length-1), 1)[0]
}

export const connectApi = (client: Socket) => {
  hands[client.id] = []

  client.on('disconnect', () => {
    // deck = shuffle([...deck, ...hands[client.id]]) // замешать карты в колоду при отключении
    delete hands[client.id]
  })

  client.on(Api.get_cards, (cb: (cards: string[]) => void) => {
    const hand = hands[client.id]
    for (let i = 0; i < handSize; i++) {
      const card = takeRandomCard()
      hand.push(card)
    }
    cb(hand)
  })

  client.on(Api.change_card, (oldCard: string, cb: (newCard: string) => void) => {
    const hand = hands[client.id]
    const card = takeRandomCard()
    hand.splice(hand.indexOf(oldCard), 1, card)
    cb(card)
  })
}
