class Rectangle{
	constructor(x1,y1,x2,y2,color = colorEnum.Black){
		this.type = "rectangle";
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.active = false;
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
		if(cirkle.x > x1-cirkle.r && cirkle.x < x2+cirkle.r && cirkle.y > y1-cirkle.r && cirkle.y < y2+cirkle.r){
			return true;
		}
		return false;
	}
}

class Line{
	constructor(x1,y1,x2,y2,color = colorEnum.Black){
		this.type = "line";
		this.x1 = roundTo5(x1);
		this.y1 = roundTo5(y1);
		this.x2 = roundTo5(x2);
		this.y2 = roundTo5(y2);
		this.active = false;
		this.grabbed = false;
		this.grabP = 0;
		this.oldV = {
			x1 : 0,
			y1 : 0,
			x2 : 0,
			y2 : 0
		}
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
	moveP1(x,y){
		this.x1 = roundTo5(x);
		this.y1 = roundTo5(y);
	}
	moveP2(x,y){
		this.x2 = roundTo5(x);
		this.y2 = roundTo5(y);
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

class EndPoint{
	constructor(xVal,yVal,r){
		this.type = "end";
		this.x = xVal;
		this.y = yVal;
		this.r = r;
		this.active = false;
	}
	move(x,y){
		this.x = x;
		this.y = y;
	}
	draw(){
		drawCirkle(this.x,this.y,this.r,255,255,0, this.active);
	}
  crash(cirkle){
    if(dist(this.x,this.y,cirkle.x,cirkle.y) < this.r+cirkle.r){
      return true;
    }
    return false;
  }
};

class startingPoint{
	constructor(xVal,yVal,r){
		this.type = "start";
		this.x = xVal;
		this.y = yVal;
		this.r = r;
		this.active = false;
	}
	crash(cirkle){
		return dist(this.x,this.y,cirkle.x,cirkle.y) <= this.r;
	}
	draw(){
		drawStart(this.x,this.y,this.r, this.active);
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
