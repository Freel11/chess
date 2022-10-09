import { NEW_PIECE } from '../setup/pieces.js'

export function placePiece(element, piece, side, position) {
	element.classList.add(`${piece}-container`, 'piece-container')
	element.innerHTML = NEW_PIECE[piece][side]
	element.dataset.position = position.id
	element.dataset.side = side

	if (piece == 'pawn' && (position.id[1] == '2' || position.id[1] == '7')) {
		element.dataset.has_moved = false
	} else if (piece == 'pawn') {
		element.dataset.has_moved = true
	}

	position.appendChild(element)	
}