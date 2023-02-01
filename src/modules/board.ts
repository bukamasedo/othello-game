class Board {
  x: number
  y: number

  constructor () {
    this.x = 8
    this.y = 8
  }

  create () {
    const appElement = document.querySelector<HTMLDivElement>('#app')
    const boardElement = document.createElement('table')
    boardElement.className = 'board'

    for (let i = 0; i < this.y; i++) {
      const trElement = document.createElement('tr')
      trElement.id = 'col'
      for (let j = 0; j < this.x; j++) {
        const tdElement = document.createElement('td')
        const cellElement = document.createElement('div')
        tdElement.id = 'row'
        cellElement.id = 'cell'
        cellElement.dataset.x = `${j}`
        cellElement.dataset.y = `${i}`
        tdElement.append(cellElement)
        trElement.append(tdElement)
      }
      boardElement?.append(trElement)
    }
    appElement?.append(boardElement)
  }
}

export default Board
