function getUnit(row, col){
	return document.getElementsByClassName("row")[row-1].children[col-1];
}

function whiteGamePiece(){
	var piece = document.createElement("img");
	piece.src = "reversiPlusWhitePiece.png";
	piece.id = "whitePiece";
	piece.style.height = "50px";
	piece.style.width = "50px";
	return piece;
}

function blackGamePiece(){
	var piece = document.createElement("img");
	piece.src = "reversiPlusBlackPiece.png";
	piece.id = "blackPiece";
	piece.style.height = "38px";
	piece.style.width = "38px";
	piece.style.padding = "6px 6px 6px 6px";
	return piece;
}

function initGame(){
	getUnit(4,4).appendChild(whiteGamePiece());
	getUnit(4,5).appendChild(blackGamePiece());
	getUnit(5,5).appendChild(whiteGamePiece());
	getUnit(5,4).appendChild(blackGamePiece());
}

initGame();