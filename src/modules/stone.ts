class Stone {
  color: string
  x: number
  y: number

  constructor (color: string, x: number, y: number) {
    this.color = color
    this.x = x
    this.y = y
  }

  create () {
    const cell = document.querySelector<HTMLDivElement>(
      `[data-x="${this.x}"][data-y="${this.y}"]`
    )
    if (cell != null) cell.className = this.color
  }
}

export default Stone
