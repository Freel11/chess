const chessBoard = document.getElementById('chess-board')
export const squares = []
let square

for(let i = 0; i < 8; i++) {
	squares.push([])
	for (let j = 0; j < 8; j++) {
		square = document.createElement('div')
		square.classList.add('chess-square')
		squares[i].push(square)
	}
}

squares.forEach((rank, i) => {
	for(let n = 0; n < rank.length; n++) {
		// If the rank is an even numbered rank
		if (i % 2 == 0) {
			// On even ranks every second sqaure is a dark square
			if (n % 2 == 0) {
				rank[n].classList.add('dark-square')
			} else {
				rank[n].classList.add('light-square')
			}

		} else {
			// On odd ranks, every second square is a light square
			if (n % 2 == 0) {
				rank[n].classList.add('light-square')
			} else {
				rank[n].classList.add('dark-square')
			}
		}

		chessBoard.appendChild(rank[n])
	}
})

squares.reverse()
squares.forEach(rank => {
	rank.reverse()
})

for (let rank = 0; rank < squares.length; rank++) {
	for (let file = 0; file < squares[rank].length; file++) {
		let letter
		switch(file) {
			case 0:
				letter = 'A'
				break
			case 1:
				letter = 'B'
				break
			case 2:
				letter = 'C'
				break
			case 3:
				letter = 'D'
				break
			case 4:
				letter = 'E'
				break
			case 5:
				letter = 'F'
				break
			case 6:
				letter = 'G'
				break
			case 7:
				letter = 'H'
				break
		}

		squares[rank][file].setAttribute('id', `${letter}${rank + 1}`)
	}
}