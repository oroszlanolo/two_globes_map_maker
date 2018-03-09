class Angular{
	constructor(x1,y1,x2,y2,color = colorEnum.Black){
		this.x1 = roundTo5(x1);
		this.y1 = roundTo5(y1);
		this.x2 = roundTo5(x2);
		this.y2 = roundTo5(y2);
		this.active = false;
		this.colorize(color);

		this.grabP = 0;
		this.grabbed = false;
		this.oldV = {
			x1 : 0,
			y1 : 0,
			x2 : 0,
			y2 : 0
		}
	}
	colorize(color){
		this.color = color;
		if(this.color == colorEnum.Red){
			this.R = 255;
			this.B = 0;
		}else if(this.color == colorEnum.Blue){
			this.R = 0;
			this.B = 255;
		}else{
			this.R = 0;
			this.B = 0;
		}
		this.G = 0;
	}
	moveP1(x,y){
		this.x1 = roundTo5(x);
		this.y1 = roundTo5(y);
	}
	moveP2(x,y){
		this.x2 = roundTo5(x);
		this.y2 = roundTo5(y);
	}
}

class Rectangle extends Angular{
	constructor(x1,y1,x2,y2,color = colorEnum.Black){
		super(x1,y1,x2,y2,color);
		this.type = "rectangle";
	}
	/*
	1 : x1,y1
	2 : x1,y2
	3 : x2,y1
	4 : x2,y2
	5 : move
	*/
	grabPoint(x,y){
		this.oldV.x1 = this.x1 - x;
		this.oldV.y1 = this.y1 - y;
		this.oldV.x2 = this.x2 - x;
		this.oldV.y2 = this.y2 - y;
		if(dist(x,y,this.x1,this.y1) < 5){
			this.grabP = 1;
			this.grabbed = true;
			return;
		}
		if(dist(x,y,this.x1,this.y2) < 5){
			this.grabP = 2;
			this.grabbed = true;
			return;
		}
		if(dist(x,y,this.x2,this.y1) < 5){
			this.grabP = 3;
			this.grabbed = true;
			return;
		}
		if(dist(x,y,this.x2,this.y2) < 5){
			this.grabP = 4;
			this.grabbed = true;
			return;
		}
		var cirk = new Globe(x,y,5,3);
		if(this.crash(cirk)){
			this.grabP = 5;
			this.grabbed = true;
		}
	}

	grab(x,y){
		switch(this.grabP){
			case 1:
			this.moveP1(x,y);
			break;
			case 2:
			this.moveP1(x,this.y1);
			this.moveP2(this.x2,y);
			break;
			case 3:
			this.moveP1(this.x1,y);
			this.moveP2(x,this.y2);
			break;
			case 4:
			this.moveP2(x,y);
			break;
			case 5:
			this.moveP1(x+this.oldV.x1, y+this.oldV.y1);
			this.moveP2(x+this.oldV.x2, y+this.oldV.y2);
			break;
		}
	}

	draw(){
		drawRect(this.x1,this.y1,this.x2,this.y2,this.R,this.G,this.B, this.active);
	}
	crash(cirkle){
		if(this.color == cirkle.color){
			return false;
		}
		var x1,x2,y1,y2;
		if(this.x1 < this.x2){
			x1 = this.x1;
			x2 = this.x2;
		}else{
			x1 = this.x2;
			x2 = this.x1
		}
		if(this.y1 < this.y2){
			y1 = this.y1;
			y2 = this.y2;
		}else{
			y1 = this.y2;
			y2 = this.y1
		}
		return (cirkle.x > x1-cirkle.r && cirkle.x < x2+cirkle.r && cirkle.y > y1-cirkle.r && cirkle.y < y2+cirkle.r);
	}
}

class Line extends Angular{
	constructor(x1,y1,x2,y2,color = colorEnum.Black){
		super(x1,y1,x2,y2,color);
		this.type = "line";
	}
	grabPoint(x,y){
		this.oldV.x1 = this.x1 - x;
		this.oldV.y1 = this.y1 - y;
		this.oldV.x2 = this.x2 - x;
		this.oldV.y2 = this.y2 - y;
		if(dist(x,y,this.x1,this.y1) < 5){
			this.grabP = 1;
			this.grabbed = true;
			return;
		}
		if(dist(x,y,this.x2,this.y2) < 5){
			this.grabP = 2;
			this.grabbed = true;
			return;
		}
		var cirkle = new Globe(x,y,5,3);
		if(this.crash(cirkle)){
			this.grabP = 3;
			this.grabbed = true;
			return;
		}
	}
	grab(x,y){
		switch(this.grabP){
			case 1:
			this.moveP1(x,y);
			break;
			case 2:
			this.moveP2(x,y);
			break;
			case 3:
			this.moveP1(x+this.oldV.x1, y+this.oldV.y1);
			this.moveP2(x+this.oldV.x2, y+this.oldV.y2);
			break;
		}
	}
	draw(){
		drawLine(this.x1,this.y1,this.x2,this.y2,this.R,this.G,this.B, this.active);
	}
	crash(cirkle){
		if(cirkle.color == this.color){
			return false;
		}
		var A = this.y2 - this.y1;
		var B = this.x1 - this.x2;
		var C = (this.x2-this.x1)*this.y1 - (this.y2-this.y1)*this.x1;
		var d = abs(A*cirkle.x + B*cirkle.y + C) / sqrt(pow(A,2)+pow(B,2));
		if(d > cirkle.r){
			return false;
		}
		var a = dist(this.x1,this.y1,cirkle.x,cirkle.y);
		var b = dist(this.x2,this.y2,cirkle.x,cirkle.y);
		var c = dist(this.x1,this.y1,this.x2,this.y2);
		if(a > cirkle.r && a*a+c*c<b*b){
			return false;
		}
		if(b > cirkle.r && b*b+c*c<a*a){
			return false;
		}
		return true;
	}
}


class Cirkle{
	constructor(xVal,yVal,r,color = colorEnum.Black){
		this.type = "cirkle";
		this.x = roundTo5(xVal);
		this.y = roundTo5(yVal);
		this.setR(r);
		this.active = false;
		this.grabP = 0;
		this.grabbed = false;
		this.colorize(color);
	}
	colorize(color){
		this.color = color;
		if(this.color == colorEnum.Red){
			this.R = 255;
			this.B = 0;
		}else if(this.color == colorEnum.Blue){
			this.R = 0;
			this.B = 255;
		}else{
			this.R = 0;
			this.B = 0;
		}
		this.G = 0;
	}
	//grabP:
	//	0	-	move
	//	1	-	resize
	grabPoint(x,y){
		if(dist(this.x,this.y,x,y) < max(3,this.r - 5)){
			this.grabbed = true;
			this.grabP = 0;
			return;
		}
		if(dist(this.x,this.y,x,y) < this.r + 5){
			this.grabbed = true;
			this.grabP = 1;
		}
	}
	grab(x,y){
		if(this.grabP === 0){
			this.move(x,y);
		}else{
			this.r = roundTo5(dist(this.x,this.y,x,y));
		}
	}
	move(x,y){
		this.x = roundTo5(x);
		this.y = roundTo5(y);
	}
	setR(d){
		this.r = roundTo5(d);
		if(this.r < 5){
			this.r = 5;
		}
	}
	crash(cirkle){
	  return (this.color != cirkle.color && dist(this.x,this.y,cirkle.x,cirkle.y) < this.r+cirkle.r);
	}
	draw(){
		if(this.type == "cirkle"){
			drawCirkle(this.x,this.y,this.r,this.R,this.G,this.B, this.active, "");
		}else{
			drawCirkle(this.x,this.y,this.r,this.R,this.G,this.B, this.active, this.type.toUpperCase());
		}
	}
}

class EndPoint extends Cirkle{
	constructor(xVal,yVal,r){
		super(xVal,yVal,r);
		this.type = "end";
		this.R = 255;
		this.G = 255;
		this.B = 0;
	}
};

class startingPoint extends Cirkle{
	constructor(xVal,yVal,r){
		super(xVal,yVal,r);
		this.type = "start";
		this.R = 255;
		this.G = 255;
		this.B = 255;
	}
	crash(cirkle){
		return dist(this.x,this.y,cirkle.x,cirkle.y) <= this.r;
	}
}

function roundTo5(x){
	var rem = (x % 5);
	if(rem < 2.5){
		return x - (x % 5);
	}else{
		return x - (x % 5) + 5;
	}
}
