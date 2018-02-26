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
	End: 4
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
let printButton;
let activeButt;
let deleteButt;

let dummy;

//SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP
function setup() {
	currentTool = 0;
	isSelected = false;
	createCanvas(WIDTH,HEIGHT);
	setupButtons();
	background(200);
	drawing = false;
}

function setupButtons(){
	createP('');
	moveButt = createButton("Mozgató Eszköz");
	moveButt.style('background-color','blue');
	moveButt.style('color','white');
	moveButt.mouseClicked(CBMove);
	activeButt = moveButt;
	lineButt = createButton("Szakasz");
	lineButt.style('background-color','white');
	lineButt.style('color','black');
	lineButt.mouseClicked(CBLine);
	rectButt = createButton("Téglalap");
	rectButt.style('background-color','white');
	rectButt.style('color','black');
	rectButt.mouseClicked(CBRect);
	startButt = createButton("Kezdőpont");
	startButt.style('background-color','white');
	startButt.style('color','black');
	startButt.mouseClicked(CBStart);
	endButt = createButton("Cél");
	endButt.style('background-color','white');
	endButt.style('color','black');
	endButt.mouseClicked(CBEnd);
	createP('');
	deleteButt = createButton("Törlés");
	deleteButt.mouseClicked(CBDelete);
	createP('');
	printButton = createButton('Nyomtatás');
	printButton.mouseClicked(CBPrint);
}

//DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW DRAW 
function draw() {
	background(200);
	if(drawing){
		switch(currentTool){
			case toolEnum.Line:
			currentObj.x2 = mouseX;
			currentObj.y2 = mouseY;
			break;
			case toolEnum.Rect:
			currentObj.x2 = mouseX;
			currentObj.y2 = mouseY;
			break;
			case toolEnum.Start:
			myStart.r = dist(myStart.x,myStart.y,mouseX,mouseY);
			break;
			case toolEnum.End:
			myEnd.r = dist(myEnd.x,myEnd.y,mouseX,mouseY);
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
		currentObj = new Line(mouseX,mouseY,mouseX,mouseY);
		level.push(currentObj);
		break;
		case toolEnum.Rect:
		currentObj = new Rectangle(mouseX,mouseY,mouseX,mouseY);
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
			if(!currentObj.crash(new Globe(mouseX,mouseY,5,3))){
				isSelected = selectOut();
			}

		}

	}
	drawing = true;
}
function mouseReleased(){
	drawing = false;
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
	activeButt.style('background-color','white');
	activeButt.style('color','black');
	activeButt =  moveButt;
	activeButt.style('background-color','blue');
	activeButt.style('color','white');
	currentTool = toolEnum.Move;
}
function CBLine(){
	deselect();
	activeButt.style('background-color','white');
	activeButt.style('color','black');
	activeButt =  lineButt;
	activeButt.style('background-color','blue');
	activeButt.style('color','white');
	currentTool = toolEnum.Line;
}
function CBRect(){
	deselect();
	activeButt.style('background-color','white');
	activeButt.style('color','black');
	activeButt =  rectButt;
	activeButt.style('background-color','blue');
	activeButt.style('color','white');
	currentTool = toolEnum.Rect;
}
function CBStart(){
	deselect();
	activeButt.style('background-color','white');
	activeButt.style('color','black');
	activeButt =  startButt;
	activeButt.style('background-color','blue');
	activeButt.style('color','white');
	currentTool = toolEnum.Start;
}
function CBEnd(){
	deselect();
	activeButt.style('background-color','white');
	activeButt.style('color','black');
	activeButt =  endButt;
	activeButt.style('background-color','blue');
	activeButt.style('color','white');
	currentTool = toolEnum.End;
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
function printOut(obj){
	switch(obj.constructor){
		case Line:
		print("level.push(new Line(" + obj.x1 + "," + obj.y1 + "," + obj.x2 + "," + obj.y2 + "));");
		break;
		case Rectangle:
		print("level.push(new Rectangle(" + obj.x1 + "," + obj.y1 + "," + obj.x2 + "," + obj.y2 + "));");
		break;
		case startingPoint:
		print("myStart = new startingPoint(" + obj.x + "," + obj.y + "," + obj.r +  ");");
		break;
		case EndPoint:
		print("myEnd = new EndPoint(" + obj.x + "," + obj.y + "," + obj.r +  ");");
		break;
	}
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
