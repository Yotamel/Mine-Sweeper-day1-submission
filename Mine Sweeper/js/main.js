'use strict'
//for the first submission I will focus on functionality, will try to make some repeating code lines into functions tomorrow
var gBoard; //{mineAround, isMine, isShown, isMarked}
var gLevel;
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };
var gPrevCellList; // for future undo, will be used to determine if the user clicked for the first time in the meantime

var elRadioBtns = document.querySelectorAll('input[name="difficulty"]')

function gameInit() {
	gLevel = getRadioValue(elRadioBtns)
	gGame.isOn = true
	gPrevCellList = []
	createBoard(gLevel.SIZE)
	renderBoard(gBoard)
}

function createBoard(size) {
	gBoard = createMat(size, size)
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			gBoard[i][j] = { minesAround: 0, isMine: false, isShown: false, isMarked: false };
		}
	}
}

function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];
			var cellId = getIdName({ i: i, j: j })
			strHTML += '\t<td class="cell" id="' + cellId +
				'"  onclick="cellClicked(' + i + ',' + j + ')" >\n\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	var elBoard = document.querySelector('.game-table');
	elBoard.innerHTML = strHTML;
}

function cellClicked(i, j) {
	var currCell = gBoard[i][j]
	var elCurCell = document.querySelector(`#cell-${i}-${j}`)
	currCell.isShown = true
	elCurCell.classList.add("shown")
	if (!gPrevCellList.length) createMines(gLevel.MINES) //creating mines if it's the first time the user pressed a cell
	gPrevCellList = []
	sweepAround(i, j)
}

function getIdName(Idx) {
	var cellClass = 'cell-' + Idx.i + '-' + Idx.j;
	return cellClass;
}

function createMines(minescount) {
	var minePos = getItemPosition()
	console.log(minescount)
	for (var idx = 0; idx < minescount; idx++) {
		while (gBoard[minePos.i][minePos.j].isShown && gBoard[minePos.i][minePos.j].isMine) {
			minePos = getItemPosition()
		}
		gBoard[minePos.i][minePos.j].isMine = true
		console.log(`mine created at ${minePos.i} ${minePos.j}`)
		var minePos = getItemPosition()
	}
	createMineAround()
}

function createMineAround(){
	for(var i = 0;i < gBoard.length; i ++){
		for (var j = 0; j < gBoard[0].length; j++){
			gBoard[i][j].minesAround = getMinesAround(i,j)
			var elCurCell = document.querySelector(`#cell-${i}-${j}`) // for testing
			elCurCell.innerHTML = gBoard[i][j].minesAround //for testing
		}
	}
}


function getMinesAround(rowIdx, colIdx) {
	var mineCount = 0
	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i > gBoard.length - 1) continue
		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			if (j < 0 || j > gBoard[0].length - 1) continue
			if (i === rowIdx && j === colIdx) continue
			if (gBoard[i][j].isMine) mineCount++
		}
	}
	return mineCount
}

function sweepAround(rowIdx, colIdx) {
	if (gBoard[rowIdx][colIdx].isMine) {
		gGame.isOn = false
		console.log("game over!")
	}
	if (gBoard[rowIdx][colIdx].minesAround !== 0) return gPrevCellList.push(gBoard[rowIdx][colIdx]) //the return will be used in the undo
	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i > gBoard.length - 1) continue
		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			if (j < 0 || j > gBoard[0].length - 1) continue
			if (i === rowIdx && j === colIdx) continue
			if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
				gPrevCellList.push(gBoard[i][j])
				gBoard[i][j].isShown = true
				var elCurCell = document.querySelector(`#cell-${i}-${j}`)
				elCurCell.classList.add("shown")
			}
		}
	}
}

