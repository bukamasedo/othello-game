import './style.css'

interface CheckPieceDirectionList {
  x: number
  y: number
}

interface ReversePieceList {
  x: number
  y: number
  piece: number
}

interface AllDirectionsList {
  x: number
  y: number
  directionX: number
  directionY: number
  piece: number
}

// 駒の配置の初期値(0=無し, 1=黒, =白)
const boardColorList: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]

const checkPieceDirectionList: CheckPieceDirectionList[] = [
  { x: 0, y: -1 }, // 上
  { x: 1, y: -1 }, // 右上
  { x: 1, y: 0 }, // 右
  { x: 1, y: 1 }, // 右下
  { x: 0, y: 1 }, // 下
  { x: -1, y: 1 }, // 左下
  { x: -1, y: 0 }, // 左
  { x: -1, y: -1 } // 左上
]

const blackPiece = 1
const whitePiece = 2

let blackOrder = true

// 駒の色を判別
const checkPieceColor = <N, E extends Element>(piece: N, target: E) => {
  if (piece === whitePiece) target.className = 'white-piece'
  if (piece === blackPiece) target.className = 'black-piece'
}

// オセロボードの初期表示
const init = () => {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML =
    '<table class="board"></table><div id="order">黒のターン</div>'

  const boardElement = document.querySelector<HTMLTableElement>('.board')

  for (let i = 0; i < boardColorList.length; i++) {
    const trElement = document.createElement('tr')
    trElement.className = 'col'

    for (let j = 0; j < boardColorList[i].length; j++) {
      const tdElement = document.createElement('td')
      const divElement = document.createElement('div')
      tdElement.className = 'row'
      divElement.id = 'cell'
      divElement.dataset.col = `${i}`
      divElement.dataset.row = `${j}`
      tdElement.append(divElement)
      trElement.append(tdElement)

      checkPieceColor(boardColorList[i][j], divElement)
    }
    boardElement?.append(trElement)
  }
}

init()

const checkReversePieces = <N>(col: N, row: N): ReversePieceList[] | [] => {
  const allZeroRowList = new Array(8).fill(0)
  const allDirectionsList: AllDirectionsList[] = []
  let rowList = []
  let piece = 0

  // どの方向に何色の駒があるか
  for (let i = 0; i < checkPieceDirectionList.length; i++) {
    const directionY = checkPieceDirectionList[i].y
    const y = Number(col) + directionY
    rowList =
      boardColorList[y] === undefined || boardColorList[y].length === 0
        ? allZeroRowList
        : boardColorList[y]

    const directionX = checkPieceDirectionList[i].x
    const x = Number(row) + directionX
    piece = rowList[x]
    piece = piece === undefined ? 0 : piece

    const directionList: AllDirectionsList = {
      ...{ x },
      ...{ y },
      ...{ directionX },
      ...{ directionY },
      ...{ piece }
    }
    allDirectionsList.push(directionList)
  }

  // 八方に駒がない場合
  if (allDirectionsList.every((item) => item.piece === 0)) return []

  const isDirection = (direction: number): boolean => {
    if (direction > 7 || direction < 0) return false
    return true
  }

  const reversePieceList: ReversePieceList[] = []

  // 駒を挟めているか
  const checkPinchPiece = <N extends number>(
    piece: N,
    x: N,
    y: N,
    directionX: N,
    directionY: N
  ) => {
    const pieceList = []

    // クリックしたマスの2つ目のこま
    pieceList.push({
      x,
      y,
      piece: boardColorList[y][x]
    })

    for (let i = 0; i < boardColorList.length; i++) {
      const nextDirectionY = y + directionY + directionY * i
      const nextDirectionX = x + directionX + directionX * i

      if (!isDirection(nextDirectionY)) return
      if (!isDirection(nextDirectionX)) return

      if (boardColorList[nextDirectionY][nextDirectionX] === 0) {
        pieceList.splice(0)
        break
      }
      if (boardColorList[nextDirectionY][nextDirectionX] === piece) break
      pieceList.push({
        x: nextDirectionX,
        y: nextDirectionY,
        piece: boardColorList[nextDirectionY][nextDirectionX]
      })
    }

    if (pieceList.length === 0) return
    reversePieceList.push(...pieceList)
    pieceList.splice(0)
  }

  // 相手の駒があるか
  const checkEnamyColorFilter = <N>(piece: N): any[] =>
    allDirectionsList.filter((item) => item.piece === piece)

  for (let i = 0; i < allDirectionsList.length; i++) {
    const x = allDirectionsList[i].x
    const y = allDirectionsList[i].y
    const directionX = allDirectionsList[i].directionX
    const directionY = allDirectionsList[i].directionY

    if (blackOrder) {
      if (checkEnamyColorFilter(whitePiece).length === 0) return []
      if (allDirectionsList[i].piece === whitePiece) {
        checkPinchPiece(blackPiece, x, y, directionX, directionY)
      }
    } else {
      if (checkEnamyColorFilter(blackPiece).length === 0) return []
      if (allDirectionsList[i].piece === blackPiece) {
        checkPinchPiece(whitePiece, x, y, directionX, directionY)
      }
    }
  }
  return reversePieceList
}

const onReversePiece = <N extends number>(x: N, y: N) => {
  boardColorList[y][x] =
    blackOrder ? blackPiece : whitePiece

  // 該当のセルを指定
  const searchByDataForCellElement = document.querySelectorAll(
    `[data-col="${y}"][data-row="${x}"]`
  )
  // 駒を画面に表示
  checkPieceColor(
    boardColorList[y][x],
    searchByDataForCellElement[0]
  )
}

// マスをクリック時
const cellElements = document.querySelectorAll<HTMLDivElement>('#cell')
cellElements.forEach((element) => {
  element.addEventListener('click', (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      // 駒をクリックしたら処理終了
      const className = e.target.className
      const isPieceClass =
        className === 'black-piece' || className === 'white-piece'
      if (isPieceClass) return

      // クリックした位置を取得
      const col = Number(e.target.dataset.col)
      const row = Number(e.target.dataset.row)

      // ひっくり返せるコマがあるか
      if (checkReversePieces(col, row).length === 0) return
      const reversePieceList = checkReversePieces(col, row)

      // 配列に駒を配置
      boardColorList[col][row] = blackOrder ? blackPiece : whitePiece
      onReversePiece(row, col)

      for (let i = 0; i < reversePieceList.length; i++) {
        boardColorList[reversePieceList[i].y][reversePieceList[i].x] =
          blackOrder ? blackPiece : whitePiece

        onReversePiece(reversePieceList[i].x, reversePieceList[i].y)
      }

      // 出番を更新する
      blackOrder = !blackOrder
      const checkOrderText = blackOrder ? '黒のターン' : '白のターン'
      document.querySelector<HTMLDivElement>('#order')!.innerText =
        checkOrderText
    }
  })
})
