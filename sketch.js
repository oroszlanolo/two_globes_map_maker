//TODO: !! RECTANGLE MOVING !!
//TODO: help lines while grabbing
//TODO: add grid button for helping grid
//TODO: Add cirkle to objects
//TODO: Make the objects objectum oriented

let colorEnum={
	Red: 0,
	Blue: 1,
	Black: 2,
	Yellow: 3
}
let toolEnum={
	Move: 0,
	Rect: 1,
	Line: 2,
	Start: 3,
	End: 4,
	Test: 5
}

function getColNum(col){
	var ret;
	switch(col){
		case "Red":
		ret = 0;
		break;
		case "Blue":
		ret = 1;
		break;
		case "Black":
		ret = 2;
		break;
	}
	return ret;
}
function colToString(col){
	var ret;
	switch(col){
		case 0:
		ret = "Red";
		break;
		case 1:
		ret = "Blue";
		break;
		case 2:
		ret = "Black";
		break;
	}
	return ret;
}

const WIDTH = 800;
const HEIGHT = 600;

let level = [];
let myEnd;
let myStart;

let currentTool;
let currentObj;
let drawing;
let isSelected;

let moveButt;
let lineButt;
let rectButt;
let startButt;
let endButt;
let testButt;
let printButton;
let activeButt;
let deleteButt;
let selector;

let myGlobes;

//SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP
function setup() {
	currentTool = 0;
	isSelected = false;
	createCanvas(WIDTH,HEIGHT);
	setupButtons();
	background(200);
	drawing = false;
	myGlobes = new Globes(0,0,50);
}

function setupButtons(){
	createP('');
	//first line
	var butts = createElement("div");
	butts.style("padding","5px");
	moveButt = createButton("Mozgató Eszköz");
	moveButt.style('background-color','blue');
	moveButt.style('color','white');
	moveButt.mouseClicked(CBMove);
	moveButt.parent(butts);
	activeButt = moveButt;
	lineButt = createButton("Szakasz");
	lineButt.style('background-color','white');
	lineButt.style('color','black');
	lineButt.mouseClicked(CBLine);
	lineButt.parent(butts);
	rectButt = createButton("Téglalap");
	rectButt.style('background-color','white');
	rectButt.style('color','black');
	rectButt.mouseClicked(CBRect);
	rectButt.parent(butts);
	startButt = createButton("Kezdőpont");
	startButt.style('background-color','white');
	startButt.style('color','black');
	startButt.mouseClicked(CBStart);
	startButt.parent(butts);
	endButt = createButton("Cél");
	endButt.style('background-color','white');
	endButt.style('color','black');
	endButt.mouseClicked(CBEnd);
	endButt.parent(butts);
	testButt = createButton("Teszt");
	testButt.mouseClicked(CBTest);
	testButt.style('background-color','white');
	testButt.style('color','black');
	testButt.style("margin-left","100px");
	testButt.parent(butts);
	createP('');
	//seconf line
	deleteButt = createButton("Törlés");
	deleteButt.mouseClicked(CBDelete);
	deleteButt.style("margin","5px");
	selector = createSelect();
	selector.option("Red");
	selector.option("Blue");
	selector.option("Black");
	selector.changed(CBSelect);
	selector.style("margin","5px");
	createP('');
	//third line
	printButton = createButton('Nyomtatás');
	printButton.style("margin","5px");
	printButton.mouseClicked(CBPrint);
}

//DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW 
function draw() {
	background(200);
	if(drawing){
		switch(currentTool){
			case toolEnum.Line:
			currentObj.moveP2(mouseX,mouseY);
			drawHelpLines();
			break;
			case toolEnum.Rect:
			currentObj.x2 = mouseX;
			currentObj.y2 = mouseY;
			drawHelpLines();
			break;
			case toolEnum.Start:
			myStart.r = dist(myStart.x,myStart.y,mouseX,mouseY);
			break;
			case toolEnum.End:
			myEnd.r = dist(myEnd.x,myEnd.y,mouseX,mouseY);
			break;
			case toolEnum.Move:
			if(currentObj && currentObj.grabbed){
				currentObj.grab(mouseX,mouseY);
			}
			break;
		}
	}
	drawObjects();
	if(myStart != null){
		myStart.draw();
	}
	if(myEnd != null){
		myEnd.draw();
	}
	if(currentTool == toolEnum.Test){
		if(mouseIsPressed){
			myGlobes.mini();
		}else{
			myGlobes.maxi();
		}
		myGlobes.move(mouseX,mouseY);
		myGlobes.draw();
	}
}

function drawHelpLines(){
	stroke(160,160,160,200);
	line(0,currentObj.y1,width,currentObj.y1);
	line(currentObj.x1,0,currentObj.x1,height);
	stroke(160,160,160,100);
	line(currentObj.x1-1000,currentObj.y1+1000,currentObj.x1+1000,currentObj.y1-1000);
	line(currentObj.x1-1000,currentObj.y1-1000,currentObj.x1+1000,currentObj.y1+1000);
}

function isCrashed(){
	for(let obj of level){
		if(obj.crash(myGlobe.red) || obj.crash(myGlobe.blue)){
			return true;
		}
	}
	return false;
}

function drawObjects(){
	for(let obj of level){
		obj.draw();
	}
}

function mousePressed(){
	if(mouseX > width || mouseY > height){
		return;
	}
	switch(currentTool){
		case toolEnum.Line:
		currentObj = new Line(mouseX,mouseY,mouseX,mouseY,getColNum(selector.selected()));
		level.push(currentObj);
		break;
		case toolEnum.Rect:
		currentObj = new Rectangle(mouseX,mouseY,mouseX,mouseY,getColNum(selector.selected()));
		level.push(currentObj);
		break;
		case toolEnum.Start:
		myStart = new startingPoint(mouseX,mouseY,0);
		break;
		case toolEnum.End:
		myEnd = new EndPoint(mouseX,mouseY,0);
		break;
		case toolEnum.Move:
		if(!isSelected){
			isSelected = selectOut();
		}else{
			if(currentObj.crash(new Globe(mouseX,mouseY,5,3))){
				currentObj.grabPoint(mouseX,mouseY);
			}else{
				isSelected = selectOut();
			}

		}

	}
	drawing = true;
}
function mouseReleased(){
	drawing = false;
	if(currentObj){
		currentObj.grabbed = false;
	}
}

function selectOut(){
	deselect();
	var cirkle = new Globe(mouseX,mouseY,5,3);
	if(myStart != null && myStart.crash(cirkle)){
		currentObj = myStart;
		currentObj.active = true;
		return true;
	}
	if(myEnd != null && myEnd.crash(cirkle)){
		currentObj = myEnd;
		currentObj.active = true;
		return true;
	}
	for(var tmp of level){
		if(tmp.crash(cirkle)){
			currentObj = tmp;
			currentObj.active = true;
			selector.value(colToString(currentObj.color));
			return true;
		}
	}
	return false;
}

function deselect(){
	if(currentObj != null){
		currentObj.active = false;
	}
	isSelected = false;
}


//callbacks
function CBMove(){
	deselect();
	buttonActivater(moveButt);
	currentTool = toolEnum.Move;
}
function CBLine(){
	deselect();
	buttonActivater(lineButt);
	currentTool = toolEnum.Line;
}
function CBRect(){
	deselect();
	buttonActivater(rectButt);
	currentTool = toolEnum.Rect;
}
function CBStart(){
	deselect();
	buttonActivater(startButt);
	currentTool = toolEnum.Start;
}
function CBEnd(){
	deselect();
	buttonActivater(endButt);
	currentTool = toolEnum.End;
}
function CBTest(){
	deselect();
	buttonActivater(testButt);
	currentTool = toolEnum.Test;
}
function buttonActivater(butt){
	activeButt.style('background-color','white');
	activeButt.style('color','black');
	activeButt =  butt;
	activeButt.style('background-color','blue');
	activeButt.style('color','white');
}

function CBPrint(){

	var json = {};
	json.level = 0;
	if(myStart){
		json.start = {
			x : myStart.x,
			y : myStart.y,
			r : myStart.r
		}
	}
	if(myEnd){
		json.end = {
			x : myEnd.x,
			y : myEnd.y,
			r : myEnd.r
		}
	}
	json.objects = [];
	for(var i = 0; i < level.length; i++){
		json.objects[i] = {
			type : level[i].type,
			x1 : level[i].x1,
			y1 : level[i].y1,
			x2 : level[i].x2,
			y2 : level[i].y2,
			color : level[i].color
		}
	}
	saveJSON(json, "savedLevel.json");
}

function CBDelete(){
	for(var i = level.length - 1; i >= 0; i--){
		if(level[i].active){
			level.splice(i,1);
			isSelected = false;
		}
	}
	if(myStart && myStart.active){
		myStart = null;
	}
	if(myEnd && myEnd.active){
		myEnd = null;
	}
}

function CBSelect(myObj){
	print(selector.selected());
	if(isSelected){
		var col = getColNum(selector.selected());
		currentObj.colorize(col);
	}
}

//Drawing functions

function drawCirkle(x,y,r,R,G,B, active){
	stroke(R,G,B);
	if(active){
		fill(0,255,0);
	}else{
		fill(R,G,B);
	}
	ellipse(x,y,2*r);
}
function drawRect(x1,y1,x2,y2,R,G,B, active){
	stroke(R,G,B);
	if(active){
		fill(0,255,0,100);
	}else{
		fill(R,G,B,100);
	}
	rect(x1,y1,x2-x1,y2-y1);
}

function drawLine(x1,y1,x2,y2,R,G,B, active){
	if(active){
		stroke(R,128,B);
	}else{
		stroke(R,G,B);
	}
	line(x1,y1,x2,y2);
}
function drawStart(x,y,r, active){
	stroke(100,100,100,100);
	if(active){
		fill(255,255,128);
	}else{
		fill(255,255,255);
	}
	ellipse(x,y,2*r);
}

function drawNextLevel(){
	fill(230,230,230,100);
	stroke(0,200,0,100);
	rect(0,0,WIDTH,HEIGHT);
	fill(0,150,0,100);
	stroke(0,150,0,180);
	textSize(72);
	textAlign(CENTER);
	text("NEXT LEVEL",WIDTH/2,HEIGHT/2);
}
