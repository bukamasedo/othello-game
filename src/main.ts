import './style.css'
import Board from '@/src/modules/board'
import Display from '@/src/modules/display'
import Stone from '@/src/modules/stone'
import Player from '@/src/modules/player'
import Modal from '@/src/modules/modal'

let blackOrder = true
const board = new Board()
const display = new Display('黒のターン', 2, 2)
const stone1 = new Stone('white', 3, 3)
const stone2 = new Stone('black', 4, 3)
const stone3 = new Stone('black', 3, 4)
const stone4 = new Stone('white', 4, 4)
const modal = new Modal()
const blackPlayer = new Player('black')
const whitePlayer = new Player('white')

board.create()
display.create()
stone1.create()
stone2.create()
stone3.create()
stone4.create()
modal.create()

let placeToPutStoneList = blackPlayer.search()

const cellElements = document.querySelectorAll<HTMLTableCellElement>('#row')
cellElements.forEach((element) => {
  element.addEventListener('click', (e: MouseEvent) => {
    const target = e.target
    if (target instanceof HTMLElement) {
      const datasetX = Number(target.dataset.x)
      const datasetY = Number(target.dataset.y)

      const placedStone = placeToPutStoneList.filter(
        (item) => item.x === datasetX && item.y === datasetY
      )
      if (placedStone.length === 0) return

      blackOrder
        ? blackPlayer.put(datasetX, datasetY)
        : whitePlayer.put(datasetX, datasetY)

      blackOrder
        ? blackPlayer.reverse(placedStone)
        : whitePlayer.reverse(placedStone)

      blackOrder = !blackOrder

      blackPlayer.count()
      whitePlayer.count()

      blackPlayer.changeDisplay('black', blackOrder)
      whitePlayer.changeDisplay('white', !blackOrder)

      placeToPutStoneList = blackOrder
        ? blackPlayer.search()
        : whitePlayer.search()

      if (placeToPutStoneList.length === 0) {
        blackOrder = !blackOrder

        blackPlayer.changeDisplay('black', blackOrder)
        whitePlayer.changeDisplay('white', !blackOrder)

        placeToPutStoneList = blackOrder
          ? blackPlayer.search()
          : whitePlayer.search()

        if (placeToPutStoneList.length === 0) {
          return modal.show('終了')
        }

        modal.show('パス')
      }
    }
  })
})

const maskElement = document.querySelector<HTMLDivElement>('.mask')
maskElement?.addEventListener('click', () => {
  modal.delete()
})
