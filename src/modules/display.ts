class Display {
  textPlate: string
  blackPieceCount: number
  whitePieceCount: number

  constructor (
    textPlate: string,
    blackPieceCount: number,
    whitePieceCount: number
  ) {
    this.textPlate = textPlate
    this.blackPieceCount = blackPieceCount
    this.whitePieceCount = whitePieceCount
  }

  create () {
    const appElement = document.querySelector<HTMLDivElement>('#app')
    const wrapElement = document.createElement('div')
    wrapElement.className = 'wrap'
    wrapElement.innerHTML = `<div><h2>黒</h2><p id="black-stone-count">${this.blackPieceCount}</p></div><h1 class="text-plate">${this.textPlate}</h1><div><h2>白</h2><p id="white-stone-count">${this.whitePieceCount}</p>`
    appElement?.append(wrapElement)
  }
}

export default Display
