/* config */

const handSize = 3 // количество карт на руке

import express from 'express'
import * as http from 'http'
import { Server, Socket } from 'socket.io'
import { Api } from './src/config'
import { random, shuffle } from 'lodash'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname + '/public'))

app.get('/*', ({}, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

const cardsBase: string[] = 
`Зеро
Обращение к силе
Высмеивание
Аргумент к социальной неуспешности
Генетическая логическая ошибка
А сам какой?
Переход на личности
Соломенное чучело
Апелляция к природе
Апелляция к эмоциям
Желаемое за действительное
Форма поверх содержания
Аргумент к последствиям
Аргумент к сложности/невероятности
Аргументация новизной
Перфекционистское заблуждение
Мнение масс (Все в одном вагоне)
Апелляция к авторитету
Анонимный авторитет
Аргумент к утверждению/уверенности
Два зла образуют добро
Апелляция к традиции
Уловка Галилея
Порочный круг
Ошибка в ошибке
Противоречие
Ассоциативная ошибка
Аргументация возможностью
После этого = вследствие этого
Специальные требования
Часть-целое
Случай из жизни
Бремя доказательства
Золотая середина
Ошибка подтверждения
Нефальсифицируемость
Поспешное обобщение
Ошибка наблюдателя
Отвлекающий манёвр
Скользкий путь
Чёрное и белое (Ложная дилемма)
Двусмысленность
Ложная аналогия
Наводящий вопрос
Презумпция типичности`.split('\n')

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

/* handlers */

io.on('connection', (socket) => {
  hands[socket.id] = []

  socket.on('disconnect', () => {
    deck = shuffle([...deck, ...hands[socket.id]])
    delete hands[socket.id]
  })

  socket.on(Api.get_cards, (cb: (cards: string[]) => void) => {
    const hand = hands[socket.id]
    for (let i = 0; i < handSize; i++) {
      const card = takeRandomCard()
      hand.push(card)
    }
    console.log('hand', hand, deck.length)
    cb(hand)
  })

  socket.on(Api.change_card, (oldCard: string, cb: (newCard: string) => void) => {
    const hand = hands[socket.id]
    const card = takeRandomCard()
    hand.splice(hand.indexOf(oldCard), 1, card)
    console.log('hand', hand, deck.length)
    cb(card)
  })
})

/* start server */

server.listen(3022, () => {
  console.log('--- Server started ---')
})
