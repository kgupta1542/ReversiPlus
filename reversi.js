var whitePieces = new Array();//All white pieces on the board
var blackPieces = new Array();//All black pieces on the board

function getUnit(row, col){//Get DOM object at soecified coordinate
	return document.getElementsByClassName("row")[row].children[col];
}

function getType(row, col){
	if(hasPiece(row, col)){
		return getUnit(row, col).children[0].className;
	}
	else{
		return null;
	}
}

function hasPiece(row, col){
	if(row <= 7 && col <= 7 && row >= 0 && col >= 0){
		if(getUnit(row, col).childElementCount > 0){
			return true;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
}
    
function createGamePieceElement(type){//Create specificied game piece
	var piece;
	if(type == "W"){
		var piece = document.createElement("img");
		piece.src = "reversiPlusWhitePiece.png";
		piece.className = "W";
		piece.style.height = "50px";
		piece.style.width = "50px";
		return piece;
	}
	else{
		var piece = document.createElement("img");
		piece.src = "reversiPlusBlackPiece.png";
		piece.className = "B";
		piece.style.height = "38px";
		piece.style.width = "38px";
		piece.style.padding = "6px 6px 6px 6px";
		return piece;
	}
}

function createGamePiece(row, col, type){
	getUnit(row,col).innerHTML = "";
	getUnit(row,col).appendChild(createGamePieceElement(type));
	getUnit(row,col).style.backgroundColor == "white";
	
	if(type == "W"){
		whitePieces.push([row, col]);
	}
	else{
		blackPieces.push([row,col]);
	}
}

function initGame(){//Create beginning 4 pieces on board
	createGamePiece(3,3,"W");
	createGamePiece(3,4,"B");
	createGamePiece(4,4,"W");
	createGamePiece(4,3,"B");
}

function findPotentialMoves(row, col){//Search algorithm to identify all possible move locations
	var type = getType(row, col);
	var possibleMoves = new Array();
	var i;
	var nextType;
	
	//Search to left
	nextType = getType(row, col - 1);
	if(nextType != null && nextType != type){
		i = 2;//Initialize counter
		while(col - i >= 0){//Stop searching if: 1) at end of board
			if(hasPiece(row, col - i) == false){//2) there is an empty space
				possibleMoves.push([row, col - i]);//This is a possible move
				break;
			}
			else if(getType(row, col - i) == type){//3) you hit your own piece
				break;
			}
			i++;
		}
	}
	
	//Search to right
	nextType = getType(row, col + 1);
	if(nextType != null && nextType != type){
		i = 2;//Initialize counter
		while(col + i <= 7){//Stop searching if: 1) at end of board
			if(hasPiece(row, col + i) == false){//2) there is an empty space
				possibleMoves.push([row, col + i]);//This is a possible move
				break;
			}
			else if(getType(row, col + i) == type){//3) you hit your own piece
				break;
			}
			i++;
		}
	}
	
	//Seach upwards
	nextType = getType(row - 1, col);
	if(nextType != null && nextType != type){
		i = 2;//Initialize counter
		while(row - i >= 0){//Stop searching if: 1) at end of board
			if(hasPiece(row - i, col) == false){//2) there is an empty space
				possibleMoves.push([row - i, col]);//This is a possible move
				break;
			}
			else if(getType(row - i, col) == type){//3) you hit your own piece
				break;
			}
			i++;
		}
	}
	
	//Search downwards
	nextType = getType(row + 1, col);
	if(nextType != null && nextType != type){
		i = 2;//Initialize counter
		while(row + i <= 7){//Stop searching if: 1) at end of board
			if(hasPiece(row + i, col) == false){//2) there is an empty space
				possibleMoves.push([row + i, col]);//This is a possible move
				break;
			}
			else if(getType(row + i, col) == type){//3) you hit your own piece
				break;
			}
			i++;
		}
	}
	
	//Search up-left diagonal
	if(hasPiece(row - 1, col - 1)){
		if(getType(row - 1, col - 1) != type){//Check if it is the opposite player's piece
			i = 2;//Initialize counter
			while(row - i >= 0 && col - i >= 0){//Stop searching if: 1) at end of board
				if(hasPiece(row - i, col - i) == false){//2) there is an empty space
					possibleMoves.push([row - i, col - i]);//This is a possible move
					break;
				}
				else if(getType(row - i, col - i) == type){//3) you hit your own piece
					break;
				}
				i++;
			}
		}
	}
	
	//Search up-right diagonal
	if(hasPiece(row - 1, col + 1)){
		if(getType(row - 1, col + 1) != type){//Check if it is the opposite player's piece
			i = 2;//Initialize counter
			while(row - i >= 0 && col + i <= 7){//Stop searching if: 1) at end of board
				if(hasPiece(row - i, col + i) == false){//2) there is an empty space
					possibleMoves.push([row - i, col + i]);//This is a possible move
					break;
				}
				else if(getType(row - i, col + i) == type){//3) you hit your own piece
					break;
				}
				i++;
			}
		}
	}
	
	//Search down-left diagonal
	if(hasPiece(row + 1, col - 1)){
		if(getType(row + 1, col - 1) != type){//Check if it is the opposite player's piece
			i = 2;//Initialize counter
			while(row + i <= 7 && col - i >= 0){//Stop searching if: 1) at end of board
				if(hasPiece(row + i, col - i) == false){//2) there is an empty space
					possibleMoves.push([row + i, col - i]);//This is a possible move
					break;
				}
				else if(getType(row + i, col - i) == type){//3) you hit your own piece
					break;
				}
				i++;
			}
		}
	}
	
	//Search down-right diagonal
	if(hasPiece(row + 1, col + 1)){
		if(getType(row + 1, col + 1) != type){//Check if it is the opposite player's piece
			i = 2;//Initialize counter
			while(row + i <= 7 && col + i <= 7){//Stop searching if: 1) at end of board
				if(hasPiece(row + i, col + i) == false){//2) there is an empty space
					possibleMoves.push([row + i, col + i]);//This is a possible move
					break;
				}
				else if(getType(row + i, col + i) == type){//3) you hit your own piece
					break;
				}
				i++;
			}
		}
	}
	
	return possibleMoves;
}

function indicatePotentialMoves(arr){//Change color of potential moves and add event listener
	for(var i = 0; i < arr.length; i++){
		getUnit(arr[i][0],arr[i][1]).style.backgroundColor = "beige";
	}
}

function whitePlayerTurn(){//Gameplay for white player
	var allPotentialMoves = new Array();
	var tempArr;
	
	for(var i = 0; i < whitePieces.length; i++){//Find all potential moves for all pieces
		tempArr = findPotentialMoves(whitePieces[i][0],whitePieces[i][1]);
		if(tempArr.length > 0){
			allPotentialMoves.push(tempArr);
		}
	}
	
	if(allPotentialMoves.length > 0){
		for(var j = 0; j < allPotentialMoves.length; j++){//Color in all potential moves for all pieces
			indicatePotentialMoves(allPotentialMoves[j]);
		}
	}
	else{//If there are no potential moves, skip turn
		blackPlayerTurn();
	}
	
	document.getElementById("board").addEventListener('click', function (evt) {
	    var clicked = false;
		if (evt.target.classList[0] === 'unit' && evt.target.style.backgroundColor == "beige") {
	    	var selectedRow = parseInt(evt.target.parentElement.id.substring(4));
			var selectedCol = parseInt(evt.target.classList[1].substring(4));
			createGamePiece(selectedRow, selectedCol, "W");
			blackPlayerTurn();
	    }
	}, false);
}

function blackPlayerTurn(){
	var allPotentialMoves = new Array();
	var tempArr;
	
	for(var i = 0; i < blackPieces.length; i++){//Find all potential moves for all pieces
		tempArr = findPotentialMoves(blackPieces[i][0],blackPieces[i][1]);
		if(tempArr.length > 0){
			allPotentialMoves.push(tempArr);
		}
	}
	
	if(allPotentialMoves.length > 0){
		for(var j = 0; j < allPotentialMoves.length; j++){
			indicatePotentialMoves(allPotentialMoves[j]);
		}
	}
	else{
		whitePlayerTurn();
	}
	
	document.getElementById("board").addEventListener('click', function (evt) {
	    var clicked = false;
		if (evt.target.classList[0] === 'unit' && evt.target.style.backgroundColor == "beige") {
	    	var selectedRow = parseInt(evt.target.parentElement.id.substring(4));
			var selectedCol = parseInt(evt.target.classList[1].substring(4));
			createGamePiece(selectedRow, selectedCol, "B");
			whitePlayerTurn();
	    }
	}, false);
}

function gamePlay(){
	var whiteLastTurn = false;
	while(whitePieces.length + blackPieces.length < 64){
		if(whiteLastTurn = false){
			whitePlayerTurn();
			whiteLastTurn = true;
		}
		else{
			blackPlayerTurn();
			whiteLastTurn = false;
		}
	}
}

initGame();
whitePlayerTurn();