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

		if (possibleSquares.length > 0) {
			possibleSquares.forEach(square => {
				square.dataset.show_possible = true
				square.addEventListener('click', moveHandler)
			})
		}
	}

	if (piece.classList.contains('knight-container')) {
		checkKnightMove(possibleSquares, originalPosition, -1, 2, side)
		checkKnightMove(possibleSquares, originalPosition, -1, -2, side)
		checkKnightMove(possibleSquares, originalPosition, 1, 2, side)
		checkKnightMove(possibleSquares, originalPosition, 1, -2, side)
		checkKnightMove(possibleSquares, originalPosition, 2, -1, side)
		checkKnightMove(possibleSquares, originalPosition, 2, 1, side)
		checkKnightMove(possibleSquares, originalPosition, -2, -1, side)
		checkKnightMove(possibleSquares, originalPosition, -2, 1, side)

		if (possibleSquares.length > 0) {
			possibleSquares.forEach(square => {
				square.dataset.show_possible = true
				square.addEventListener('click', moveHandler)
			})
		}
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

function checkKnightMove(array, position, fileOffset, rankOffset, side) {
	let possibleSquare
	for (let i = 0; i < FILES.length; i++) {
		if (FILES[i] == position[0]) {
			possibleSquare = document.getElementById(`${FILES[i + fileOffset]}${parseInt(position[1]) + rankOffset}`)
			if (possibleSquare && possibleSquare.dataset.occupied == "false") {
				array.push(possibleSquare)
			} else if (possibleSquare && possibleSquare.childNodes[0].dataset.side != side) {
				array.push(possibleSquare)
			}
		}
	}
}