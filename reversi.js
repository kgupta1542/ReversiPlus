//Global Variables======================================================================
var whitePieces = new Array();//All white pieces on the board
var blackPieces = new Array();//All black pieces on the board
var board = document.getElementById("board");//Board DOM element
var allPotentialMoves = new Array();//All potential moves for a single turn
var tempArr = new Array();//Temporary array for storage
var potentialMoves = new Array();//Temporary array for potential moves of each search direction
var flippablePieces = new Array();//All pieces that need to be flipped
var tempFlippableArr = new Array();//Temporary array for flippable pieces in each search direction
var flipPlusPieces = new Array();//All flip Plus pieces
var moves = 4;//Number of pieces on board
var turn = document.getElementById("turn");//Turn DOM Element
var mode = document.getElementById("gameMode");
var reset = document.getElementById("reset");
var endGameLabel = document.getElementById("endGame");
var oppPlayerType = document.getElementById("oppPlayerType");
var oppPlayerLevel = document.getElementById("oppPlayerLevel");
var noMoveTurns = 0;

//UI Controls========================================================================================
function toggleTurn(){//Changes turn on UI
	turn.innerHTML = (turn.innerHTML == "White Player") ? "Black Player" : "White Player";
}

mode.addEventListener('mousedown', toggleMode, false);

function toggleMode(){
	mode.innerHTML = (mode.innerHTML == "Plus Mode") ? "Classic" : "Plus Mode";
}

reset.addEventListener('mousedown', resetBoard, false);

function resetBoard(){
	for(var i = 0; i < 8; i++){
		for(var j = 0; j < 8; j++){
			getUnit(i,j).innerHTML = "";
		}
	}
	
	whitePieces = [];
	blackPieces = [];
	
	clearPotentialMoves();
	initGame();
	turn.parentElement.style.display = "block";
	endGameLabel.style.display = "none";
	
	gameTurn("W");
}

oppPlayerType.addEventListener('mousedown', toggleOppPlayerType, false);

function toggleOppPlayerType(){
	oppPlayerType.innerHTML = (oppPlayerType.innerHTML == "vs Human") ? "vs AI" : "vs Human";
	oppPlayerType.parentElement.style.width = (oppPlayerType.innerHTML == "vs Human") ? "275px" : "390px";
	oppPlayerLevel.style.display = (oppPlayerType.innerHTML == "vs Human") ? "none" : "inline";
}

function updateScore(){//Updates score on UI
	document.getElementById("whiteScore").innerText = whitePieces.length;
	document.getElementById("blackScore").innerText = blackPieces.length;
}

//Game Play Setup=====================================================================================
function getUnit(row, col){//Get DOM object at specified coordinate
	return document.getElementsByClassName("row")[row].children[col];
}

function getType(row, col){//Get color of piece at specified coordinate
	if(hasPiece(row, col)){
		return getUnit(row, col).children[0].className;
	}
	else{
		return null;
	}
}

function hasPiece(row, col){//Returns:
	if(row <= 7 && col <= 7 && row >= 0 && col >= 0){
		if(getUnit(row, col).childElementCount > 0){
			return true;//If there is a piece
		}
		else{
			return false;//If there is an empty cell
		}
	}
	else{
		return null;//If specified coordinate is off the board
	}
}
    
//Game Piece Creation==============================================================================
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

function createGamePiece(row, col, type){//Loads game piece in specified unit
	removeGamePiece(row,col,type);//Clears cell
	getUnit(row,col).appendChild(createGamePieceElement(type));//Loads game piece
	getUnit(row,col).style.backgroundColor == "#2eae52";//Removes highlight
	
	var searchArr = (type == "W") ? whitePieces : blackPieces;
	var exists = false;
	for(var i = 0; i < searchArr.length; i++){
		if(JSON.stringify(searchArr[i]) == JSON.stringify([row,col])){
			exists = true;
		}
	}
	
	if(!exists){
		searchArr.push([row,col]);
	}
}

function removeGamePiece(row,col,type){//Clears game piece from game board and local array
	var searchArr = (type == "W") ? blackPieces : whitePieces;
	for(var i = 0; i < searchArr.length; i++){
		if(JSON.stringify(searchArr[i]) == JSON.stringify([row,col])){
			searchArr.splice(i,1);
		}
	}
	
	getUnit(row,col).innerHTML = "";
}

//Potential Moves=================================================================================================
function findPotentialMoves(row, col){//Search algorithm to identify all possible move locations
	var type = getType(row, col);
	var oppType = (type == "W") ? "B" : "W";
	
	potentialMoves = [];//Clear potential moves
	var i;
	var nextType;
	
	//Search to left
	nextType = getType(row, col - 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(col - i >= 0 && getType(row, col - i) == oppType){//Keep searching while you're on the board and are on an opponent piece
			i++;
		}
		if(hasPiece(row, col - i) == false){//2) there is an empty space
			potentialMoves.push([row, col - i, "left"]);//This is a possible move
		}
	}
	
	//Search to right
	nextType = getType(row, col + 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(col + i <= 7 && getType(row, col + i) == oppType){//Keep searching while you're on the board and are on an opponent piece
			i++;
		}
		if(hasPiece(row, col + i) == false){//If there is an empty space
			potentialMoves.push([row, col + i, "right"]);//This is a possible move
		}
	}
	
	//Seach upwards
	nextType = getType(row - 1, col);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row - i >= 0 && getType(row - i, col) == oppType){//Keep searching while you're on the board and are on an opponent piece
			i++;
		}
		if(hasPiece(row - i, col) == false){//If there is an empty space
			potentialMoves.push([row - i, col, "up"]);//This is a possible move
		}
	}
	
	//Search downwards
	nextType = getType(row + 1, col);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row + i <= 7 && getType(row + i, col) == oppType){//Keep searching while you're on the board and are on an opponent piece
			i++;
		}
		if(hasPiece(row + i, col) == false){//If there is an empty space
			potentialMoves.push([row + i, col, "down"]);//This is a possible move
		}
	}
	
	//Search up-left diagonal
	nextType = getType(row - 1, col - 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row - i >= 0 && col - i >= 0 && getType(row - i, col - i) == oppType){//Keep searching while you're on the board and are on an opponent piece
			i++;
		}
		if(hasPiece(row - i, col - i) == false){//If there is an empty space
			potentialMoves.push([row - i, col - i, "up-left"]);//This is a possible move
		}
	}
	
	//Search up-right diagonal
	nextType = getType(row - 1, col + 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row - i >= 0 && col + i <= 7 && getType(row - i, col + i) == oppType){//Keep searching while you're on the board and are on an opponent piece
			i++;
		}
		if(hasPiece(row - i, col + i) == false){//If there is an empty space
			potentialMoves.push([row - i, col + i,"up-right"]);//This is a possible move
		}
	}
	
	//Search down-left diagonal
	nextType = getType(row + 1, col - 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row + i <= 7 && col - i >= 0 && getType(row + i, col - i) == oppType){//Keep searching while you're on the board and are on an opponent piece
			i++;
		}
		if(hasPiece(row + i, col - i) == false){//If there is an empty space
			potentialMoves.push([row + i, col - i,"down-left"]);//This is a possible move
		}
	}
	
	//Search down-right diagonal
	nextType = getType(row + 1, col + 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		while(row + i <= 7 && col + i <= 7 && getType(row + i, col + i) == oppType){//Keep searching while you're on the board and are on an opponent piece
			i++;
		}
		if(hasPiece(row + i, col + i) == false){//If there is an empty space
			potentialMoves.push([row + i, col + i,"down-right"]);//This is a possible move
		}
	}
	
	return potentialMoves;
}

function indicatePotentialMoves(){//Highlight all potential moves
	for(var i = 0; i < allPotentialMoves.length; i++){
		for(var j = 0; j < allPotentialMoves[i].length; j++){
			getUnit(allPotentialMoves[i][j][0],allPotentialMoves[i][j][1]).style.backgroundColor = "#4eee92";
		}
	}
}

function clearPotentialMoves(){//Reset all highlighted potential moves
	for(var i = 0; i < allPotentialMoves.length; i++){
		for(var j = 0; j < allPotentialMoves[i].length; j++){
			getUnit(allPotentialMoves[i][j][0],allPotentialMoves[i][j][1]).style.backgroundColor = "#2eae52";
		}
	}
}

//Flip Pieces (including Flip Plus)============================================================================
function findFlippablePieces(row, col){//Search algorithm to identify all possible move locations
	var type = getType(row, col);
	var oppType = (type == "W") ? "B" : "W";
	
	flippablePieces = [];
	var i;
	var nextType;
	
	//Search to left
	nextType = getType(row, col - 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		tempFlippableArr = [[row,col-1]];
		while(col - i >= 0 && getType(row, col - i) == oppType){//Stop searching if: 1) at end of board
			tempFlippableArr.push([row, col - i]);
			i++;
		}
		if(getType(row, col - i) == type){//2) there is an empty space
			flippablePieces = flippablePieces.concat(tempFlippableArr);//This is a possible move
		}
	}
	
	nextType = getType(row, col + 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		tempFlippableArr = [[row,col + 1]];
		while(col + i <= 7 && getType(row, col + i) == oppType){//Stop searching if: 1) at end of board
			tempFlippableArr.push([row, col + i]);
			i++;
		}
		if(getType(row, col + i) == type){//2) there is an empty space
			flippablePieces = flippablePieces.concat(tempFlippableArr);//This is a possible move
		}
	}
	
	//Seach upwards
	nextType = getType(row - 1, col);
	if(nextType == oppType){
		i = 2;//Initialize counter
		tempFlippableArr = [[row - 1,col]];
		while(row - i >= 0 && getType(row - i, col) == oppType){//Stop searching if: 1) at end of board
			tempFlippableArr.push([row - i, col]);
			i++;
		}
		if(getType(row - i, col) == type){//2) there is an empty space
			flippablePieces = flippablePieces.concat(tempFlippableArr);//This is a possible move
		}
	}
	
	//Search downwards
	nextType = getType(row + 1, col);
	if(nextType == oppType){
		i = 2;//Initialize counter
		tempFlippableArr = [[row + 1,col]];
		while(row + i <= 7 && getType(row + i, col) == oppType){//Stop searching if: 1) at end of board
			tempFlippableArr.push([row + i, col]);
			i++;
		}
		if(getType(row + i, col) == type){//2) there is an empty space
			flippablePieces = flippablePieces.concat(tempFlippableArr);//This is a possible move
		}
	}
	
	//Search up-left diagonal
	nextType = getType(row - 1, col - 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		tempFlippableArr = [[row - 1,col - 1]];
		while(row - i >= 0 && col - i >= 0 && getType(row - i, col - i) == oppType){//Stop searching if: 1) at end of board
			tempFlippableArr.push([row - i, col - i]);
			i++;
		}
		if(getType(row - i, col - i) == type){//2) there is an empty space
			flippablePieces = flippablePieces.concat(tempFlippableArr);//This is a possible move
		}
	}
	
	//Search up-right diagonal
	nextType = getType(row - 1, col + 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		tempFlippableArr = [[row - 1,col + 1]];
		while(row - i >= 0 && col + i <= 7 && getType(row - i, col + i) == oppType){//Stop searching if: 1) at end of board
			tempFlippableArr.push([row - i, col + i]);
			i++;
		}
		if(getType(row - i, col + i) == type){//2) there is an empty space
			flippablePieces = flippablePieces.concat(tempFlippableArr);//This is a possible move
		}
	}
	
	//Search down-left diagonal
	nextType = getType(row + 1, col - 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		tempFlippableArr = [[row + 1,col - 1]];
		while(row + i <= 7 && col - i >= 0 && getType(row + i, col - i) == oppType){//Stop searching if: 1) at end of board
			tempFlippableArr.push([row + i, col - i]);
			i++;
		}
		if(getType(row + i, col - i) == type){//2) there is an empty space
			flippablePieces = flippablePieces.concat(tempFlippableArr);//This is a possible move
		}
	}
	
	//Search down-right diagonal
	nextType = getType(row + 1, col + 1);
	if(nextType == oppType){
		i = 2;//Initialize counter
		tempFlippableArr = [[row + 1,col + 1]];
		while(row + i <= 7 && col + i <= 7 && getType(row + i, col + i) == oppType){//Stop searching if: 1) at end of board
			tempFlippableArr.push([row + i, col + i]);
			i++;
		}
		if(getType(row + i, col + i) == type){//2) there is an empty space
			flippablePieces = flippablePieces.concat(tempFlippableArr);//This is a possible move
		}
	}
	
	return flippablePieces;
}

function flipPieces(arr, type){
	for(var i = 0; i < arr.length; i++){
		createGamePiece(arr[i][0],arr[i][1],type);
	}
	updateScore();
}

function findFlipPlusPieces(type){
	flippablePiecesCopy = JSON.parse(JSON.stringify(flippablePieces));
	flipPlusPieces = [];
	
	for(var i = 0; i < flippablePiecesCopy.length; i++){
		findFlippablePieces(flippablePiecesCopy[i][0],flippablePiecesCopy[i][1]);
		flipPlusPieces = flipPlusPieces.concat(flippablePieces);
	}
}

//AI Player Functionality
function aiTurn(){
	var type = (turn.innerHTML == "White Player") ? "W" : "B";
	var maxScoreIndex = [0,0];
	var maxScore = 0;
	var currScore;
	var currFlippablePieces;
	
	for(var i = 0; i < allPotentialMoves.length; i++){
		for(var j = 0; j < allPotentialMoves[i].length; j++){
			currFlippablePieces = findFlippablePieces(allPotentialMoves[i][j][0],allPotentialMoves[i][j][1]);
			
			if(mode.innerHTML == "Classic" || parseInt(oppPlayerLevel.value) == 1){
				currScore = currFlippablePieces.length;
			}
			else if(parseInt(oppPlayerLevel.value) == 2){
				currScore = currFlippablePieces.length;
				for(var k = 0; k < currFlippablePieces.length; k++){
					currScore += findFlippablePieces(currFlippablePieces[k][0],currFlippablePieces[k][1]).length;
				}
			}
			
			console.log("Score for (" + allPotentialMoves[i][j][0] + "," + allPotentialMoves[i][j][1] + ") is: " + currScore);
			if(currScore > maxScore){
				maxScore = currScore;
				maxScoreIndex[0] = i;
				maxScoreIndex[1] = j;
			}
		}
	}
	
	console.log("Chosen move is: (" + allPotentialMoves[maxScoreIndex[0]][maxScoreIndex[1]][0] + "," + allPotentialMoves[maxScoreIndex[0]][maxScoreIndex[1]][1] + ")");
	gamePlay(allPotentialMoves[maxScoreIndex[0]][maxScoreIndex[1]][0],allPotentialMoves[maxScoreIndex[0]][maxScoreIndex[1]][1],type);
}

//gameTurn ==================================================================================================
function initGame(){//Create beginning 4 pieces on board
	turn.innerHTML = "White Player";
	
	createGamePiece(3,3,"W");
	createGamePiece(3,4,"B");
	createGamePiece(4,4,"W");
	createGamePiece(4,3,"B");
	
	updateScore();
}

function addPiece(tar){
	var type = (turn.innerHTML == "White Player") ? "W" : "B";
	
	if (tar.target.classList[0] === 'unit' && tar.target.style.backgroundColor == "rgb(78, 238, 146)") {
		var selectedRow = parseInt(tar.target.parentElement.id.substring(4));
		var selectedCol = parseInt(tar.target.classList[1].substring(4));
		gamePlay(selectedRow, selectedCol, type);
    }
}

function gamePlay(row, col, type){
	var oppType = (type == "W") ? "B" : "W";
	
	createGamePiece(row, col, type);
	board.removeEventListener("mousedown", addPiece);
	findFlippablePieces(row, col);
	flipPieces(flippablePieces, type);
	
	if(mode.innerHTML == "Plus Mode"){
		findFlipPlusPieces(type);
		flipPieces(flipPlusPieces,type);
	}
	
	moves += 1;
	clearPotentialMoves();
	
	if(moves < 64 && blackPieces.length > 0 && whitePieces.length > 0){
		toggleTurn();
		gameTurn(oppType);
	}
	else{
		endGame();
	}
}

function gameTurn(type){
	var searchArr = (turn.innerHTML == "White Player") ? whitePieces : blackPieces;
	var oppType = (turn.innerHTML == "White Player") ? "B" : "W";
	
	allPotentialMoves = [];
	tempArr = [];
	
	for(var i = 0; i < searchArr.length; i++){//Find all potential moves for all pieces
		tempArr = findPotentialMoves(searchArr[i][0],searchArr[i][1]);
		if(tempArr.length > 0){
			allPotentialMoves.push(tempArr);
		}
	}
	
	if(allPotentialMoves.length > 0){
		noMoveTurns = 0;
		indicatePotentialMoves();
	}
	else{//If there are no potential moves, skip turn
		noMoveTurns++;
		
		if(noMoveTurns >= 2){//If neither player has a move, end the game
			endGame();
		}
		else{
			alert("No Available Moves. " + turn.innerHTML + " Turn Skipped!");
			toggleTurn();
			gameTurn(oppType);
		}
	}
	
	if(type == "B" && oppPlayerType.innerHTML == "vs AI"){
		aiTurn();
	}
	else{
		board.addEventListener('mousedown', addPiece, false);
	}
}

function endGame(){
	endGameLabel.style.display = "block";
	turn.parentElement.style.display = "none";
	
	var text = (blackPieces.length > whitePieces.length) ? "Black Player Wins!" : "White Player Wins!";
	endGameLabel.innerText = text;
}

initGame();
gameTurn("W");
