//TODO: help lines while grabbing

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
	Cirk: 3,
	Start: 4,
	End: 5,
	Test: 6
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

const WIDTH = 840;
const HEIGHT = 600;

let level = [];
let myEnd;
let myStart;
var levelData;

let currentTool;
let currentObj;
let mouseDown;
let isSelected;



let myGlobes;

//SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP
function setup() {
	currentTool = 0;
	isSelected = false;
	var canv = createCanvas(WIDTH,HEIGHT);
	canv.drop(CBLoad);
	setupButtons();
	background(200);
	addBorder();
	mouseDown = false;
	myGlobes = new Globes(0,0,40);
}


//DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW 
function draw() {
	background(220);
	if(mouseDown){
		switch(currentTool){
			case toolEnum.Line:
			currentObj.moveP2(mouseX,mouseY);
			drawHelpLines();
			break;
			case toolEnum.Rect:
			currentObj.moveP2(mouseX,mouseY);
			drawHelpLines();
			break;
			case toolEnum.Cirk:
			currentObj.setR(dist(currentObj.x,currentObj.y,mouseX,mouseY));
			break;
			case toolEnum.Start:
			myStart.setR(dist(myStart.x,myStart.y,mouseX,mouseY));
			break;
			case toolEnum.End:
			myEnd.setR(dist(myEnd.x,myEnd.y,mouseX,mouseY));
			break;
			case toolEnum.Move:
			if(currentObj && currentObj.grabbed){
				currentObj.grab(mouseX,mouseY);
			}
			break;
		}
	}
	if(netCheckBox.checked()){
		drawNet();
	}
	drawObjects();
	if(myStart != null){
		myStart.draw();
	}
	if(myEnd != null){
		myEnd.draw();
	}
	if(currentTool == toolEnum.Test){
		drawTest();
	}
}

function drawTest(){
	if(mouseIsPressed){
		myGlobes.mini();
	}else{
		myGlobes.maxi();
	}
	myGlobes.move(mouseX,mouseY);
	myGlobes.draw();
	if(isCrashed()){
		background(255,0,0,60);
	}
}

function drawNet(){
	stroke(160,160,160,200);
	for(var i = 120; i < width; i += 120){
		line(i,0,i,height);
	}
	for(var i = 120; i < height; i += 120){
		line(0,i,width,i);
	}
	stroke(160,160,160,100);
	for(var i = 60; i < width; i += 120){
		line(i,0,i,height);
	}
	for(var i = 60; i < height; i += 120){
		line(0,i,width,i);
	}
}

function drawHelpLines(){
	var x1 = currentObj.x1;
	var x2 = currentObj.x2;
	var y1 = currentObj.y1;
	var y2 = currentObj.y2;
	stroke(160,70,160,200);
	line(0,y1,width,y1);
	line(x1,0,x1,height);
	stroke(160,70,160,80);
	line(x1-1000,y1+1000,x1+1000,y1-1000);
	line(x1-1000,y1-1000,x1+1000,y1+1000);
	
	for(var i = x1 - 840; i < x1 + 840; i += 120){
		line(i,y1-5,i,y1+5);
	}
	for(var i = x1 - 780; i < x1 + 840; i += 120){
		line(i,y1-3,i,y1+3);
	}
	for(var i = y1 - 600; i < y1 + 600; i += 120){
		line(x1-5,i,x1+5,i);
	}
	for(var i = y1 - 540; i < y1 + 600; i += 120){
		line(x1-3,i,x1+3,i);
	}

	stroke(160,70,160,80);
	strokeWeight(0.5);
	line(0,y2,width,y2);
	line(x2,0,x2,height);
	strokeWeight(1);
}

function isCrashed(){
	for(let obj of level){
		if(obj.crash(myGlobes.red) || obj.crash(myGlobes.blue)){
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
		case toolEnum.Cirk:
		currentObj = new Cirkle(mouseX,mouseY,0,getColNum(selector.selected()));
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
	mouseDown = true;
}
function mouseReleased(){
	mouseDown = false;
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



//mouseDown functions

function drawCirkle(x,y,r,R,G,B, active, tt){
	stroke(R,G,B);
	if(active){
		fill(0,255,0,100);
	}else{
		fill(R,G,B,100);
	}
	ellipse(x,y,2*r);
	if(tt){
		stroke(0,0,0);
		fill(0,0,0);
		textAlign(CENTER,CENTER);
		textSize(r/2);
		text(tt,x,y);
	}
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
	strokeWeight(1.5);
	if(active){
		stroke(R,128,B);
	}else{
		stroke(R,G,B);
	}
	line(x1,y1,x2,y2);
	strokeWeight(1);
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
