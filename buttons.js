let moveButt;
let lineButt;
let rectButt;
let cirkButt;
let startButt;
let endButt;
let testButt;
let printButton;
let activeButt;
let deleteButt;
let resetButt;

let mapName;
let selector;
let netCheckBox;

function setupButtons(){
	createP('');
    //first line
    firstLine();
    //second line
    secondLine();
    //third line
    thirdLine();
	createP('');
    //fourth line
    fourthLine();

}

function firstLine(){
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
	cirkButt = createButton("Kör");
	cirkButt.style('background-color','white');
	cirkButt.style('color','black');
	cirkButt.mouseClicked(CBCirk);
	cirkButt.parent(butts);
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
}
function secondLine(){
	netCheckBox = createCheckbox('Segítő háló', false);
	netCheckBox.style("margin","10px");
}
function thirdLine(){
	deleteButt = createButton("Törlés");
	deleteButt.mouseClicked(CBDelete);
	deleteButt.style("margin","5px");
	selector = createSelect();
	selector.option("Red");
	selector.option("Blue");
	selector.option("Black");
	selector.changed(CBSelect);
	selector.value("Black");
	selector.style("margin","5px");
	resetButt = createButton("Minden törlése");
	resetButt.mouseClicked(CBReset);
	resetButt.style("margin","5px");
	resetButt.style("margin-left","100px");
}
function fourthLine(){
	mapName = createInput("my_map");
	mapName.style("margin","5px");
	printButton = createButton('Nyomtatás');
	printButton.style("margin","5px");
	printButton.mouseClicked(CBPrint);
}

//CALLBACKS CALLBACKS CALLBACKS CALLBACKS CALLBACKS CALLBACKS CALLBACKS CALLBACKS

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
function CBCirk(){
	deselect();
	buttonActivater(cirkButt);
	currentTool = toolEnum.Cirk;
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
	json.name = mapName.value();
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
	var saveName = mapName.value() + ".json";
	saveJSON(json, saveName);
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
	if(isSelected && currentObj.type != "end" && currentObj.type != "start"){
		var col = getColNum(selector.selected());
		currentObj.colorize(col);
	}
}

function CBReset(){
	level = [];
	addBorder();
	myStart = null;
	myEnd = null;
}

function CBLoad(file){
	levelData = loadJSON(file.data,CBLoadObjects);
}
function CBLoadObjects(){
	var sPoint = levelData.start;
	if(sPoint){
		myStart = new startingPoint(sPoint.x,sPoint.y,sPoint.r);
	}

	var ePoint = levelData.end;
	if(ePoint){
		myEnd = new EndPoint(ePoint.x,ePoint.y,ePoint.r);
	}

	var obs = levelData.objects;
	level = [];
	for(var i = 0; i < obs.length; i++){
		switch(obs[i].type){
			case "line":
			loadLine(obs[i]);
			break;
			case "rectangle":
			loadRect(obs[i]);
			break;
		}
	}
	addBorder();
}
function loadLine(ln){
    var tmpLine = new Line(ln.x1,ln.y1,ln.x2,ln.y2,ln.color);
    level.push(tmpLine);
}
function loadRect(rt){
    var tmpRect = new Rectangle(rt.x1,rt.y1,rt.x2,rt.y2,rt.color);
    level.push(tmpRect);
}
function addBorder(){
    level.push(new Line(0,0,0,HEIGHT));
    level.push(new Line(0,0,WIDTH,0));
    level.push(new Line(WIDTH,0,WIDTH,HEIGHT));
    level.push(new Line(0,HEIGHT,WIDTH,HEIGHT));
}