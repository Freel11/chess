import { squares } from '../setup/board.js'
import { placePiece } from './placePiece.js'

export function nextMove() {
	const pieces = document.querySelectorAll('[data-occupied=true]')

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
	if (piece.classList.contains('pawn-container')) {
		const originalPosition = piece.dataset.position
		const rank = originalPosition[1]
		const file = originalPosition[0]
		const possibleSquares = []

		possibleSquares.push(document.getElementById(`${file}${piece.dataset.side == 'light' ? parseInt(rank) + 1 : parseInt(rank) - 1}`))

		if (piece.dataset.has_moved == 'false') {
			possibleSquares.push(document.getElementById(`${file}${piece.dataset.side == 'light' ? parseInt(rank) + 2 : parseInt(rank) - 2}`))
		}
		
		resetPossibleSquares()

		possibleSquares.forEach(square => {
			square.dataset.show_possible = true
			square.addEventListener('click', moveHandler)
		})
	}

	function moveHandler(e) {
		moveToSquare(piece, piece.parentNode, e.target)
		nextMove()
		removeListeners()
	}

	function removeListeners() {
		squares.forEach(rank => {
			rank.forEach(square => {
				square.removeEventListener('click', moveHandler)
				if (square.dataset.occupied == 'false') {
					console.log(square)
					square.removeEventListener('click', selectHandler)
				}
			})
		})
	}
}

function moveToSquare(piece, origin, destination) {
	const side = piece.dataset.side
	piece.remove()
	placePiece(document.createElement('div'), 'pawn', side, destination)
	resetPossibleSquares()
	checkOccupation()
}

export function resetPossibleSquares() {
	squares.forEach(rank => {
		rank.forEach(square => {
			square.dataset.show_possible = false
		})
	})
}