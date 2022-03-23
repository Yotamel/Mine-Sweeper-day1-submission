function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  
  function getRadioValue(elRadioBtns) {
    for (var button of elRadioBtns) {
        if (button.checked) {
            return {SIZE:button.size,MINES:+button.value}
        }
    }
}

function generateItem(item, itemImg) {
	var itemIndex = getItemPosition()
	while (gBoard[itemIndex.i][itemIndex.j].gameElement) itemIndex = getItemPosition()
	gBoard[itemIndex.i][itemIndex.j].gameElement = item
	renderCell(itemIndex, itemImg)
}

function getItemPosition() {
	var row = getRandomInt(0, gBoard[0].length)
	var col = getRandomInt(0, gBoard.length)
	return { i: row, j: col }
}