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
var panel = document.getElementById("ui");
var endGameLabel = document.getElementById("endGame");
var oppPlayerType = document.getElementById("oppPlayerType");
var oppPlayerLevel = document.getElementById("oppPlayerLevel");
var boardColorSelect = document.getElementById("boardColor");
var boardColor = boardColorSelect.value;
var highlightColorSelect = document.getElementById("highlightColor");
var highlightColor = highlightColorSelect.value;
var panelColorSelect = document.getElementById("panelColor");
var panelColor = panelColorSelect.value;
var buttonColorSelect = document.getElementById("buttonColor");
var buttonColor = buttonColorSelect.value;
var defaultColor = document.getElementById("defaultColor");
var aiTurnLabel = document.getElementById("aiTurn");
var noMoveTurns = 0;

//Color Controls===================================================================
function hexToRGB(h) {
	let r = 0, g = 0, b = 0;
	r = "0x" + h[1] + h[2];
	g = "0x" + h[3] + h[4];
	b = "0x" + h[5] + h[6];
  
	return "rgb("+ +r + ", " + +g + ", " + +b + ")";
}

function setCookie(cname,cvalue){
    document.cookie = cname + "=" + cvalue;
}

boardColorSelect.addEventListener('change', updateBoardColor, false);

function updateBoardColor(){
	boardColor = boardColorSelect.value;
	setCookie("boardColor",boardColor);
	
	for(var i = 0; i < 8; i++){
		for(var j = 0; j < 8; j++){
			getUnit(i,j).style.backgroundColor = boardColor;
		}
	}
	indicatePotentialMoves();
}

highlightColorSelect.addEventListener('change', updateHighlightColor, false);

function updateHighlightColor(){
	highlightColor = highlightColorSelect.value;
	setCookie("highlightColor",highlightColor);
	indicatePotentialMoves();
}

panelColorSelect.addEventListener('change', updatePanelColor, false);

function updatePanelColor(){
	panelColor = panelColorSelect.value;
	setCookie("panelColor",panelColor);
	panel.style.backgroundColor = panelColor;
}

buttonColorSelect.addEventListener('change', updateButtonColor, false);

function updateButtonColor(){
	buttonColor = buttonColorSelect.value;
	setCookie("buttonColor",buttonColor);
	mode.style.backgroundColor = buttonColor;
	reset.style.backgroundColor = buttonColor;
	oppPlayerType.style.backgroundColor = buttonColor;
	oppPlayerLevel.style.backgroundColor = buttonColor;
	aiTurnLabel.style.backgroundColor = buttonColor;
}

defaultColor.addEventListener('mouseup', setDefaultColors, false);

function setDefaultColors(){
	boardColorSelect.value = "#2eae52";
	highlightColorSelect.value = "#4eee92";
	panelColorSelect.value = "#2eae52";
	buttonColorSelect.value = "#4eee92";
	
	updateBoardColor();
	updateHighlightColor();
	updatePanelColor();
	updateButtonColor();
}

function initColorSet(){
	var allCookies = document.cookie;
   	var cookieArray = allCookies.split(';');
	for(var i = 0; i < cookieArray.length; i++){
		currCookie = cookieArray[i].split('=')[0].replace(/ /g,'');
		if(currCookie == "boardColor"){
			boardColorSelect.value = cookieArray[i].split('=')[1];
		}
		else if(currCookie == "highlightColor"){
			highlightColorSelect.value = cookieArray[i].split('=')[1];
		}
		else if(currCookie == "panelColor"){
			panelColorSelect.value = cookieArray[i].split('=')[1];
		}
		else if(currCookie == "buttonColor"){
			buttonColorSelect.value = cookieArray[i].split('=')[1];
		}
	}
	
	updateBoardColor();
	updateHighlightColor();
	updatePanelColor();
	updateButtonColor();
}

//UI Controls========================================================================================
function toggleTurn(){//Changes turn on UI
	turn.innerHTML = (turn.innerHTML == "White Player") ? "Black Player" : "White Player";
	aiTurnLabel.style.opacity = (turn.innerHTML == "White Player") ? 1 : 0.5;
	aiTurnLabel.disabled = (aiTurnLabel.disabled) ? false : true;
}

mode.addEventListener('mouseup', toggleMode, false);

function toggleMode(){
	mode.innerHTML = (mode.innerHTML == "Plus Mode") ? "Classic" : "Plus Mode";
}

reset.addEventListener('mouseup', resetBoard, false);

function resetBoard(){
	for(var i = 0; i < 8; i++){
		for(var j = 0; j < 8; j++){
			getUnit(i,j).innerHTML = "";
			getUnit(i,j).style.backgroundColor = boardColor;
		}
	}
	
	whitePieces = [];
	blackPieces = [];
	
	aiTurnLabel.disabled = true;
	aiTurnLabel.style.opacity = 0.5;
	
	allPotentialMoves = [];
	moves = 4;
	initGame();
	turn.parentElement.style.display = "block";
	endGameLabel.style.display = "none";
	
	gameTurn("B");
}

oppPlayerType.addEventListener('mouseup', toggleOppPlayerType, false);

function toggleOppPlayerType(){
	oppPlayerType.innerHTML = (oppPlayerType.innerHTML == "vs Human") ? "vs AI" : "vs Human";
	oppPlayerType.parentElement.style.width = (oppPlayerType.innerHTML == "vs Human") ? "275px" : "390px";
	oppPlayerLevel.style.display = (oppPlayerType.innerHTML == "vs Human") ? "none" : "inline";
	aiTurnLabel.style.display = (oppPlayerType.innerHTML == "vs Human") ? "none" : "inline";
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
	getUnit(row,col).style.backgroundColor == boardColor;//Removes highlight
	
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
			getUnit(allPotentialMoves[i][j][0],allPotentialMoves[i][j][1]).style.backgroundColor = highlightColor;
		}
	}
}

function clearPotentialMoves(){//Reset all highlighted potential moves
	for(var i = 0; i < allPotentialMoves.length; i++){
		for(var j = 0; j < allPotentialMoves[i].length; j++){
			getUnit(allPotentialMoves[i][j][0],allPotentialMoves[i][j][1]).style.backgroundColor = boardColor;
		}
	}
}

//Flip Pieces (including Flip Plus)============================================================================
function findFlippablePieces(row, col, type){//Search algorithm to identify all possible move locations
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
		findFlippablePieces(flippablePiecesCopy[i][0],flippablePiecesCopy[i][1],type);
		flipPlusPieces = flipPlusPieces.concat(flippablePieces);
	}
}

//AI Player Functionality
function aiTurn(){
	var type = "W";
	var level = parseInt(oppPlayerLevel.value);
	var maxScoreIndex = [0,0];
	var maxScore = 0;
	var currScore;
	var currFlippablePieces;
	var tempPlusPieces = [];
	var currPlusPieces = [];
	
	for(var i = 0; i < allPotentialMoves.length; i++){
		for(var j = 0; j < allPotentialMoves[i].length; j++){
			currFlippablePieces = findFlippablePieces(allPotentialMoves[i][j][0],allPotentialMoves[i][j][1],type);
			
			if(mode.innerHTML == "Classic"){
				currScore = currFlippablePieces.length;
				if(level == 2){
					if((allPotentialMoves[i][j][0] <= 1 || allPotentialMoves[i][j][0] >= 6) && (allPotentialMoves[i][j][1] <= 1 || allPotentialMoves[i][j][1] >= 6)){
						if((allPotentialMoves[i][j][0] + allPotentialMoves[i][j][1]) % 7 == 0 && (allPotentialMoves[i][j][0] - allPotentialMoves[i][j][1]) % 7 == 0){
							console.log("Corner at: " + String.fromCharCode(65 +allPotentialMoves[i][j][1]) + (1+allPotentialMoves[i][j][0]));
							currScore += 4.83;
						}
						else{
							console.log("Danger at: " + String.fromCharCode(65 +allPotentialMoves[i][j][1]) + (1+allPotentialMoves[i][j][0]));
							currScore -= 2.85;
						}
					}
				}
			}
			else if(mode.innerHTML == "Plus Mode"){
				currScore = currFlippablePieces.length;
				tempPlusPieces = [];
				for(var k = 0; k < currFlippablePieces.length; k++){
					tempPlusPieces.concat(findFlippablePieces(currFlippablePieces[k][0],currFlippablePieces[k][1],type));
				}
				
				currScore += currPlusPieces.length;
				
				if(level == 2){
					if((allPotentialMoves[i][j][0] <= 1 || allPotentialMoves[i][j][0] >= 6) && (allPotentialMoves[i][j][1] <= 1 || allPotentialMoves[i][j][1] >= 6)){
						if((allPotentialMoves[i][j][0] + allPotentialMoves[i][j][1]) % 7 == 0 && (allPotentialMoves[i][j][0] - allPotentialMoves[i][j][1]) % 7 == 0){
							console.log("Corner at: " + String.fromCharCode(65 +allPotentialMoves[i][j][1]) + (1+allPotentialMoves[i][j][0]));
							currScore += 7;
						}
						else{
							console.log("Danger at: " + String.fromCharCode(65 +allPotentialMoves[i][j][1]) + (1+allPotentialMoves[i][j][0]));
							currScore -= 7;
						}
					}
				}
			}
			
			console.log("Score for " + String.fromCharCode(65 +allPotentialMoves[i][j][1]) + (1+allPotentialMoves[i][j][0]) + " is: " + currScore);
			if(currScore > maxScore){
				maxScore = currScore;
				maxScoreIndex[0] = i;
				maxScoreIndex[1] = j;
			}
		}
	}
	
	console.log("Chosen move is: " + String.fromCharCode(65 +allPotentialMoves[maxScoreIndex[0]][maxScoreIndex[1]][1]) + (1+allPotentialMoves[maxScoreIndex[0]][maxScoreIndex[1]][0]));
	gamePlay(allPotentialMoves[maxScoreIndex[0]][maxScoreIndex[1]][0],allPotentialMoves[maxScoreIndex[0]][maxScoreIndex[1]][1],type);
}

//gameTurn ==================================================================================================
function initGame(){//Create beginning 4 pieces on board
	turn.innerHTML = "Black Player";
	initColorSet();
	
	createGamePiece(3,3,"W");
	createGamePiece(3,4,"B");
	createGamePiece(4,4,"W");
	createGamePiece(4,3,"B");
	
	updateScore();
}

function addPiece(tar){
	var type = (turn.innerHTML == "White Player") ? "W" : "B";
	
	if (tar.target.classList[0] === 'unit' && tar.target.style.backgroundColor == hexToRGB(highlightColor)) {
		var selectedRow = parseInt(tar.target.parentElement.id.substring(4));
		var selectedCol = parseInt(tar.target.classList[1].substring(4));
		gamePlay(selectedRow, selectedCol, type);
    }
}

function gamePlay(row, col, type){
	var oppType = (type == "W") ? "B" : "W";
	
	if(type == "B"){
		board.removeEventListener("mouseup", addPiece);
	}
	else{
		aiTurnLabel.removeEventListener("mouseup", aiTurn);
	}
	
	createGamePiece(row, col, type);
	findFlippablePieces(row, col, type);
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
			clearPotentialMoves();
			if(type == "W"){
				board.removeEventListener("mouseup", addPiece);
			}
			toggleTurn();
			gameTurn(oppType);
		}
	}
	
	if(type == "W" && oppPlayerType.innerHTML == "vs AI"){
		aiTurnLabel.addEventListener('mouseup', aiTurn, false);
	}
	else{
		board.addEventListener('mouseup', addPiece, false);
	}
}

function endGame(){
	endGameLabel.style.display = "block";
	turn.parentElement.style.display = "none";
	
	var text = (blackPieces.length > whitePieces.length) ? "Black Player Wins!" : "White Player Wins!";
	endGameLabel.innerText = text;
}

initGame();
gameTurn("B");
