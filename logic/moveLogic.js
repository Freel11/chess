import { squares } from '../setup/board.js'
import { placePiece } from './placePiece.js'

let turn = 'light'
const turnKeeper = document.getElementById('turn-keeper')
turnKeeper.innerText = "White's"
const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']


export function nextMove() {
	const pieces = document.querySelectorAll(`[data-side=${turn}]`)
	pieces.forEach(piece => {
		piece.addEventListener('click', selectHandler)
	})
}

export function checkOccupation() {
	squares.forEach(rank => {
		rank.forEach(square =>{
			if (square.hasChildNodes()) {
				square.dataset.occupied = true
			} else {
				square.dataset.occupied = false
			}
		})
	})
}

function selectHandler(e) {
	const pieceContainers = document.querySelectorAll('.piece-container')
	pieceContainers.forEach(pieceContainer => {
		pieceContainer.classList.remove('selected')
	})

	const pieceContainer = e.target.closest('.piece-container')
	pieceContainer.classList.add('selected')

	showAvailableMoves(pieceContainer)
}

function showAvailableMoves(piece) {
	const originalPosition = piece.dataset.position
	const rank = originalPosition[1]
	const file = originalPosition[0]
	const possibleSquares = []
	const side = piece.dataset.side

	resetPossibleSquares()

	if (piece.classList.contains('pawn-container')) {

		let possibleSquare = document.getElementById(`${file}${side == 'light' ? parseInt(rank) + 1 : parseInt(rank) - 1}`)

		if (possibleSquare.dataset.occupied == 'false') {
			possibleSquares.push(possibleSquare)
		}

		if (piece.dataset.has_moved == 'false' && possibleSquares.length > 0) {
			possibleSquare = document.getElementById(`${file}${side == 'light' ? parseInt(rank) + 2 : parseInt(rank) - 2}`)
			if (possibleSquare.dataset.occupied == 'false') {
				possibleSquares.push(possibleSquare)
			}
		}

		checkAttack(possibleSquares, originalPosition, 'pawn', side)
		submitPossibleSquares(possibleSquares)
	}

	if (piece.classList.contains('knight-container')) {
		checkKnightMove(possibleSquares, originalPosition, side)
		submitPossibleSquares(possibleSquares)
	}

	if (piece.classList.contains('bishop-container')) {
		checkBishopMove(possibleSquares, originalPosition, side)
		submitPossibleSquares(possibleSquares)
	}

	if (piece.classList.contains('rook-container')) {
		checkRookMove(possibleSquares, originalPosition, side)
		submitPossibleSquares(possibleSquares)
	}

	if (piece.classList.contains('queen-container')) {
		checkBishopMove(possibleSquares, originalPosition, side)
		checkRookMove(possibleSquares, originalPosition, side)
		submitPossibleSquares(possibleSquares)
	}

	if (piece.classList.contains('king-container')) {
		checkKingMove(possibleSquares, originalPosition, side)
		submitPossibleSquares(possibleSquares)
	}
}

function submitPossibleSquares(array) {
	if (array.length > 0) {
		array.forEach(square => {
			square.dataset.show_possible = true
			square.addEventListener('click', moveHandler)
		})
	}
}

function moveHandler(e) {
	const piece = document.querySelector('.selected')

	if (e.target.closest('.chess-square').dataset.occupied == 'true') {
		attackToSquare(piece, piece.parentNode, e.target.closest('.chess-square'))
	} else {
		moveToSquare(piece, piece.parentNode, e.target)
	}


	if (turn == 'light') {
		turn = 'dark'
		turnKeeper.innerText = 'Black\'s'
	} else {
		turn = 'light'
		turnKeeper.innerText = 'White\'s'
	}

	removeListeners('both')
	nextMove()
}

function removeListeners(key) {

	if (key == 'squares' || key == 'both') {
		squares.forEach(rank => {
			rank.forEach(square => {
				square.removeEventListener('click', moveHandler)
			})
		})
	}

	if (key == 'peices' || key == 'both') {
		const pieces = document.querySelectorAll('.piece-container')
		pieces.forEach(piece => {
			piece.removeEventListener('click', selectHandler)
		})
	}
}

function moveToSquare(piece, origin, destination) {
	const side = piece.dataset.side
	piece.remove()
	let queenRank
	side == 'light' ? queenRank = '8' : queenRank = '1'

	if (piece.classList.contains('pawn-container') && destination.id[1] == queenRank) {
		placePiece(document.createElement('div'), 'queen', side, destination)
	} else if (piece.classList.contains('pawn-container')) {
		placePiece(document.createElement('div'), 'pawn', side, destination)
	}

	if (piece.classList.contains('knight-container')) {
		placePiece(document.createElement('div'), 'knight', side, destination)
	}

	if (piece.classList.contains('bishop-container')) {
		placePiece(document.createElement('div'), 'bishop', side, destination)
	}

	if (piece.classList.contains('rook-container')) {
		placePiece(document.createElement('div'), 'rook', side, destination)
	}

	if (piece.classList.contains('queen-container')) {
		placePiece(document.createElement('div'), 'queen', side, destination)
	}

	if (piece.classList.contains('king-container')) {
		placePiece(document.createElement('div'), 'king', side, destination)
	}

	resetPossibleSquares()
	checkOccupation()
}

function attackToSquare(piece, origin, destination) {
	const capturedPiece = destination.childNodes[0]
	capturedPiece.remove()
	moveToSquare(piece, origin, destination)
}

export function resetPossibleSquares() {
	removeListeners('squares')
	squares.forEach(rank => {
		rank.forEach(square => {
			square.dataset.show_possible = false
		})
	})
}

function checkAttack(array, position, piece, side) {
	let possibleAttacks = []

	if (piece == 'pawn') {

		for(let i = 0; i < FILES.length; i++) {
			if (FILES[i] == position[0]) {
				let firstPossibleAttack, secondPossibleAttack

				if (side == 'light') {
					firstPossibleAttack = document.getElementById(`${FILES[i - 1]}${parseInt(position[1]) + 1}`)
					secondPossibleAttack = document.getElementById(`${FILES[i + 1]}${parseInt(position[1]) + 1}`)
				}

				if (side == 'dark') {
					firstPossibleAttack = document.getElementById(`${FILES[i - 1]}${parseInt(position[1]) - 1}`)
					secondPossibleAttack = document.getElementById(`${FILES[i + 1]}${parseInt(position[1]) - 1}`)
				}

				if (firstPossibleAttack && firstPossibleAttack.dataset.occupied == 'true' && firstPossibleAttack.childNodes[0].dataset.side != side) {
					possibleAttacks.push(firstPossibleAttack)
				}

				if (secondPossibleAttack && secondPossibleAttack.dataset.occupied == 'true' && secondPossibleAttack.childNodes[0].dataset.side != side) {
					possibleAttacks.push(secondPossibleAttack)
				}
			}
		}

		if (possibleAttacks.length > 0) {
			possibleAttacks.forEach(attack => {
				array.push(attack)
			})
		}
	}
}

function checkKnightMove(array, position, side) {
	let possibleSquare
	const offsets = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]]
	for (let i = 0; i < FILES.length; i++) {
		if (FILES[i] == position[0]) {
			for (let j = 0; j < offsets.length; j++) {
				possibleSquare = document.getElementById(`${FILES[i + offsets[j][0]]}${parseInt(position[1]) + offsets[j][1]}`)
				if (possibleSquare && (possibleSquare.dataset.occupied == "false" || possibleSquare.childNodes[0].dataset.side != side)) {
					array.push(possibleSquare)
				}
			}
		}
	}
}

function checkBishopMove(array, position, side) {
	for (let i = 0; i < FILES.length; i++) {
		if (FILES[i] == position[0]) {
			let fileIndex = i
			checkDiagonal(1, 1, fileIndex)
			checkDiagonal(1, -1, fileIndex)
			checkDiagonal(-1, 1, fileIndex)
			checkDiagonal(-1, -1, fileIndex)
		}
	}

	function checkDiagonal(fileOffset, rankOffset, fileIndex) {
		let j = true
		let possibleSquare
		while (j) {
			possibleSquare = document.getElementById(`${FILES[fileIndex + fileOffset]}${parseInt(position[1]) + rankOffset}`)
			fileOffset > 0 ? fileOffset++ : fileOffset--
			rankOffset > 0 ? rankOffset++ : rankOffset--

			pushToArray(possibleSquare)

			if (!possibleSquare || possibleSquare.dataset.occupied == 'true') {
				j = false
				break
			}
		}
	}

	function pushToArray(square) {
		if (square && (square.dataset.occupied == 'false' || square.childNodes[0].dataset.side != side)) {
			array.push(square)
		}
	}
}

function checkRookMove (array, position, side) {

	for (let i = 0; i < FILES.length; i++) {
		if (FILES[i] == position[0]) {
			let fileIndex = i
			checkStraight(fileIndex)
		}
	}


	function checkStraight(fileIndex) {
		// Up
		let count = 1
		let j = true
		let possibleSquare
		while (j) {
			possibleSquare = document.getElementById(`${FILES[fileIndex]}${parseInt(position[1]) + count}`)
			pushToArray(possibleSquare)

			count++

			if (!possibleSquare || possibleSquare.dataset.occupied == 'true') {
				j = false
				break
			}
		}

		// Down
		count = -1
		j = true
		while (j) {
			possibleSquare = document.getElementById(`${FILES[fileIndex]}${parseInt(position[1]) + count}`)
			pushToArray(possibleSquare)

			count--

			if (!possibleSquare || possibleSquare.dataset.occupied == 'true') {
				j = false
				break
			}
		}

		// Right
		count = 1
		j = true
		while (j) {
			possibleSquare = document.getElementById(`${FILES[fileIndex + count]}${parseInt(position[1])}`)
			pushToArray(possibleSquare)

			count++

			if (!possibleSquare || possibleSquare.dataset.occupied == 'true') {
				j = false
				break
			}
		}

		// Left
		count = -1
		j = true
		while (j) {
			possibleSquare = document.getElementById(`${FILES[fileIndex + count]}${parseInt(position[1])}`)
			pushToArray(possibleSquare)

			count--

			if (!possibleSquare || possibleSquare.dataset.occupied == 'true') {
				j = false
				break
			}
		}
	}

	function pushToArray(square) {
		if (square && (square.dataset.occupied == 'false' || square.childNodes[0].dataset.side != side)) {
			array.push(square)
		}
	}
}

function checkKingMove(array, position, side) {
	let fileIndex,
			possibleSquare

	for (let i = 0; i < FILES.length; i++) {
		if (FILES[i] == position[0]) {
			fileIndex = i
			break
		}
	} 

	possibleSquare = document.getElementById(`${FILES[fileIndex - 1]}${position[1]}`)
	pushToArray(possibleSquare)

	possibleSquare = document.getElementById(`${FILES[fileIndex + 1]}${position[1]}`)
	pushToArray(possibleSquare)

	possibleSquare = document.getElementById(`${FILES[fileIndex]}${parseInt(position[1]) + 1}`)
	pushToArray(possibleSquare)

	possibleSquare = document.getElementById(`${FILES[fileIndex]}${parseInt(position[1]) - 1}`)
	pushToArray(possibleSquare)

	possibleSquare = document.getElementById(`${FILES[fileIndex + 1]}${parseInt(position[1]) - 1}`)
	pushToArray(possibleSquare)

	possibleSquare = document.getElementById(`${FILES[fileIndex - 1]}${parseInt(position[1]) - 1}`)
	pushToArray(possibleSquare)

	possibleSquare = document.getElementById(`${FILES[fileIndex + 1]}${parseInt(position[1]) + 1}`)
	pushToArray(possibleSquare)

	possibleSquare = document.getElementById(`${FILES[fileIndex - 1]}${parseInt(position[1]) + 1}`)
	pushToArray(possibleSquare)

	console.log(array)


	function pushToArray(square) {
		if (square && (square.dataset.occupied == 'false' || square.childNodes[0].dataset.side != side)) {
			array.push(square)
		}
	}

}