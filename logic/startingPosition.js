import { placePiece } from './placePiece.js'
import { squares } from '../setup/board.js'

export function startingPosition() {
	squares.forEach((rank, i) => {
		let side
		i < 4 ? side = 'light' : side = 'dark'

// On the first and the eighth rank you place the major and minor pieces
		if (i == 0 || i == 7) {
				placePiece(document.createElement('div'), 'rook', side, rank[0])
				placePiece(document.createElement('div'), 'knight', side, rank[1])
				placePiece(document.createElement('div'), 'bishop', side, rank[2])
				placePiece(document.createElement('div'), 'queen', side, rank[3])
				placePiece(document.createElement('div'), 'king', side, rank[4])
				placePiece(document.createElement('div'), 'bishop', side, rank[5])
				placePiece(document.createElement('div'), 'knight', side, rank[6])				
				placePiece(document.createElement('div'), 'rook', side, rank[7])
		}

// On the second and seventh rank you place the pawns
		if (i == 1 || i == 6 ) {
			for (let j = 0; j < 8; j++) {
				placePiece(document.createElement('div'), 'pawn', side, rank[j])
			}
		}
	})
}