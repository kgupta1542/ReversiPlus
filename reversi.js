var whitePieces = new Array();//All white pieces on the board
var blackPieces = new Array();//All black pieces on the board
var board = document.getElementById("board");
var allPotentialMoves = new Array();
var tempArr = new Array();
var possibleMoves = new Array();

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
		return null;
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
	var oppType = (type == "W") ? "B" : "W";
	
	possibleMoves = [];
	var i;
	var nextType;
	
	//Search to left
	nextType = getType(row, col - 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(col - i >= 0 && getType(row, col - i) == oppType){//Stop searching if: 1) at end of board
			i++;
		}
		if(hasPiece(row, col - i) == false){//2) there is an empty space
			possibleMoves.push([row, col - i]);//This is a possible move
		}
	}
	
	nextType = getType(row, col + 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(col + i <= 7 && getType(row, col + i) == oppType){//Stop searching if: 1) at end of board
			i++;
		}
		if(hasPiece(row, col + i) == false){//2) there is an empty space
			possibleMoves.push([row, col + i]);//This is a possible move
		}
	}
	
	//Seach upwards
	nextType = getType(row - 1, col);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row - i >= 0 && getType(row - i, col) == oppType){//Stop searching if: 1) at end of board
			i++;
		}
		if(hasPiece(row - i, col) == false){//2) there is an empty space
			possibleMoves.push([row - i, col]);//This is a possible move
		}
	}
	
	//Search downwards
	nextType = getType(row + 1, col);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row + i <= 7 && getType(row + i, col) == oppType){//Stop searching if: 1) at end of board
			i++;
		}
		if(hasPiece(row + i, col) == false){//2) there is an empty space
			possibleMoves.push([row + i, col]);//This is a possible move
		}
	}
	
	//Search up-left diagonal
	nextType = getType(row - 1, col - 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row - i >= 0 && col - i >= 0 && getType(row, col - i) == oppType){//Stop searching if: 1) at end of board
			i++;
		}
		if(hasPiece(row - i, col - i) == false){//2) there is an empty space
			possibleMoves.push([row - i, col - i]);//This is a possible move
		}
	}
	
	//Search up-right diagonal
	nextType = getType(row - 1, col + 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row - i >= 0 && col + i <= 7 && getType(row - i, col + i) == oppType){//Stop searching if: 1) at end of board
			i++;
		}
		if(hasPiece(row - i, col + i) == false){//2) there is an empty space
			possibleMoves.push([row - i, col + i]);//This is a possible move
		}
	}
	
	//Search down-left diagonal
	nextType = getType(row + 1, col - 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row + i <= 7 && col - i >= 0 && getType(row + i, col - i) == oppType){//Stop searching if: 1) at end of board
			i++;
		}
		if(hasPiece(row + i, col - i) == false){//2) there is an empty space
			possibleMoves.push([row + i, col - i]);//This is a possible move
		}
	}
	
	//Search down-right diagonal
	nextType = getType(row + 1, col + 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row + i <= 7 && col + i <= 7 && getType(row + i, col + i) == oppType){//Stop searching if: 1) at end of board
			i++;
		}
		if(hasPiece(row + i, col + i) == false){//2) there is an empty space
			possibleMoves.push([row + i, col + i]);//This is a possible move
		}
	}
	
	return possibleMoves;
}

function indicatePotentialMoves(arr){//Change color of potential moves and add event listener
	console.log(arr);
	for(var i = 0; i < arr.length; i++){
		getUnit(arr[i][0],arr[i][1]).style.backgroundColor = "beige";
	}
}

function clearPotentialMoves(){
	for(var i = 0; i < allPotentialMoves.length; i++){//Color in all potential moves for all pieces
		for(var j = 0; j < allPotentialMoves[i].length; j++){
			getUnit(allPotentialMoves[i][j][0],allPotentialMoves[i][j][1]).style.backgroundColor = "white";
		}
	}
}

function addWhitePiece(tar){
		if (tar.target.classList[0] === 'unit' && tar.target.style.backgroundColor == "beige") {
	    	var selectedRow = parseInt(tar.target.parentElement.id.substring(4));
			var selectedCol = parseInt(tar.target.classList[1].substring(4));
			createGamePiece(selectedRow, selectedCol, "W");
			board.removeEventListener("mousedown", addWhitePiece);
			clearPotentialMoves();
			blackPlayerTurn();
	    }
}

function addBlackPiece(tar){
	if (tar.target.classList[0] === 'unit' && tar.target.style.backgroundColor == "beige") {
    	var selectedRow = parseInt(tar.target.parentElement.id.substring(4));
		var selectedCol = parseInt(tar.target.classList[1].substring(4));
		createGamePiece(selectedRow, selectedCol, "B");
		board.removeEventListener("mousedown", addBlackPiece);
		clearPotentialMoves();
		whitePlayerTurn();
    }
}

function whitePlayerTurn(){//Gameplay for white player
	allPotentialMoves = [];
	tempArr = [];
	
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
	
	board.addEventListener('mousedown', addWhitePiece, false);
}

function blackPlayerTurn(){
	allPotentialMoves = [];
	tempArr = [];
	
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
	
	board.addEventListener('mousedown', addBlackPiece, false);
}

initGame();
whitePlayerTurn();
