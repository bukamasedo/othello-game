import Stone from '@/src/modules/stone'

interface CheckStoneDirectionList {
  x: number
  y: number
}

interface SearchPutList {
  x: number
  y: number
  directionX: number
  directionY: number
  color: string
}

class Player {
  color: string
  stoneCount: number

  constructor (color: string) {
    this.color = color
    this.stoneCount = 0
  }

  search () {
    const maxLength = 8
    const checkStoneDirectionList: CheckStoneDirectionList[] = [
      { x: 1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: -1 }
    ]
    const putStoneList = []

    const isDirection = (direction: number): boolean => {
      if (direction > 7 || direction < 0) return false
      return true
    }

    for (let y = 0; y < maxLength; y++) {
      for (let x = 0; x < maxLength; x++) {
        const cell = document.querySelector<HTMLDivElement>(
          `[data-x="${x}"][data-y="${y}"]`
        )
        if (cell?.className !== '') continue

        for (let i = 0; i < checkStoneDirectionList.length; i++) {
          const directionX = checkStoneDirectionList[i].x
          const directionY = checkStoneDirectionList[i].y

          const dataX = x + checkStoneDirectionList[i].x
          const dataY = y + checkStoneDirectionList[i].y
          const allDirectionsCell = document.querySelector<HTMLDivElement>(
            `[data-x="${dataX}"][data-y="${dataY}"]`
          )
          if (allDirectionsCell === null) continue
          if (allDirectionsCell.className === '') continue
          if (allDirectionsCell.className === this.color) continue
          console.log(allDirectionsCell)

          for (let i = 0; i < maxLength; i++) {
            const nextDirectionX = x + directionX + directionX * i
            const nextDirectionY = y + directionY + directionY * i

            if (!isDirection(nextDirectionY)) continue
            if (!isDirection(nextDirectionX)) continue

            const nextDirectionCell = document.querySelector<HTMLDivElement>(
              `[data-x="${nextDirectionX}"][data-y="${nextDirectionY}"]`
            )

            if (nextDirectionCell?.className === this.color && i === 0) break
            if (nextDirectionCell?.className === '') break
            if (nextDirectionCell?.className === this.color) {
              const rowElement = document
                .querySelector<HTMLTableCellElement>(
                  `[data-x="${x}"][data-y="${y}"]`
              )
                ?.closest('#row')
              if (rowElement != null) {
                this.addClassName(rowElement, 'can-placed')
              }
              putStoneList.push({
                ...{ x },
                ...{ y },
                ...{ directionX },
                ...{ directionY },
                color: this.color
              })
            }
          }
        }
      }
    }
    return putStoneList
  }

  addClassName (element: Element, className: string) {
    element?.classList.add(className)
  }

  removeClassName (element: Element, className: string) {
    element?.classList.remove(className)
  }

  put (datasetX: number, datasetY: number) {
    const stone = new Stone(this.color, datasetX, datasetY)
    stone.create()
  }

  reverse (placedStone: SearchPutList[]) {
    const maxLength = 8
    for (let i = 0; i < placedStone.length; i++) {
      for (let j = 1; j <= maxLength; j++) {
        const nextDirectionCell = document.querySelector<HTMLDivElement>(
          `[data-x="${
            placedStone[i].x + placedStone[i].directionX * j
          }"][data-y="${placedStone[i].y + placedStone[i].directionY * j}"]`
        )

        if (nextDirectionCell?.className === undefined) break
        if (nextDirectionCell?.className === '') break
        if (nextDirectionCell?.className === this.color) break
        nextDirectionCell.className = this.color === 'black' ? 'black' : 'white'
      }
    }
  }

  count () {
    const maxLength = 8
    this.stoneCount = 0

    for (let y = 0; y < maxLength; y++) {
      for (let x = 0; x < maxLength; x++) {
        const isNonClass =
          document.querySelector<HTMLDivElement>(
            `[data-x="${x}"][data-y="${y}"]`
          )?.className === ''

        if (!isNonClass) {
          // 駒の数を数える
          const cellColor = document.querySelector<HTMLDivElement>(
            `[data-x="${x}"][data-y="${y}"]`
          )?.className
          cellColor === this.color && this.stoneCount++
        }
      }
    }
  }

  changeDisplay (color: string, blackOrder: boolean) {
    if (color === 'black') {
      const blackStoneCountElement =
        document.querySelector<HTMLParagraphElement>('#black-stone-count')
      if (blackStoneCountElement != null) {
        blackStoneCountElement.innerText = `${this.stoneCount}`
      }
    } else if (color === 'white') {
      const whiteStoneCountElement =
        document.querySelector<HTMLParagraphElement>('#white-stone-count')
      if (whiteStoneCountElement != null) {
        whiteStoneCountElement.innerText = `${this.stoneCount}`
      }
    }

    if (blackOrder) {
      const textPlateElement =
        document.querySelector<HTMLHeadElement>('.text-plate')
      const text = color === 'black' ? '黒のターン' : '白のターン'
      if (textPlateElement != null) textPlateElement.innerText = `${text}`
    }

    const rowElement = document.querySelectorAll<HTMLTableCellElement>('#row')
    for (let i = 0; i < rowElement.length; i++) {
      if (rowElement.length !== 0) { this.removeClassName(rowElement[i], 'can-placed') }
    }
  }
}

export default Player
