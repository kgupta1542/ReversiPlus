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
	if(getUnit(row, col).children.length > 0){
		return true;
	}
	else{
		return false;
	}
}
    
function createGamePiece(type){//Create specificied game piece
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

function initGame(){//Create beginning 4 pieces on board
	getUnit(3,3).appendChild(createGamePiece("W"));
	whitePieces.push([3,3]);
	
	getUnit(3,4).appendChild(createGamePiece("B"));
	blackPieces.push([3,4]);
	
	getUnit(4,4).appendChild(createGamePiece("W"));
	whitePieces.push([4,4]);
	
	getUnit(4,3).appendChild(createGamePiece("B"));
	blackPieces.push([4,3]);
}

function findPotentialMoves(row, col){//Search algorithm to identify all possible move locations
	var type = getType(row, col);
	var possibleMoves = new Array();
	var i;
	
	//Search to left
	if(hasPiece(row, col - 1)){
		if(getType(row, col - 1) != type){//Check if it is the opposite player's piece
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
	}
	
	//Search to right
	if(hasPiece(row, col + 1)){
		if(getType(row, col + 1) != type){//Check if it is the opposite player's piece
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
	}
	
	//Seach upwards
	if(hasPiece(row - 1, col)){
		if(getType(row - 1, col) != type){//Check if it is the opposite player's piece
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
	}
	
	//Search downwards
	if(hasPiece(row + 1, col)){
		if(getType(row + 1, col) != type){//Check if it is the opposite player's piece
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

function indicatePotentialMoves(arr){
	for(var i = 0; i < arr.length; i++){
		getUnit(arr[i][0],arr[i][1]).style.backgroundColor = "beige";
	}
}

function whitePlayerTurn(){
	for(var i = 0; i < whitePieces.length; i++){//Find all potential moves for all pieces
		indicatePotentialMoves(findPotentialMoves(whitePieces[i][0],whitePieces[i][1]));
	}
}

function blackPlayerTurn(){
	for(var i = 0; i < blackPieces.length; i++){//Find all potential moves for all pieces
		indicatePotentialMoves(findPotentialMoves(blackPieces[i][0],blackPieces[i][1]));
	}
}

initGame();
blackPlayerTurn();