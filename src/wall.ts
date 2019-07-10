import P5 from 'p5';
declare const p5:P5;

export class Wall {
	p1:P5.Vector;
	p2:P5.Vector;

	constructor(p1:P5.Vector, p2:P5.Vector, public boundry=false) {
		this.p1 = p1;
		this.p2 = p2;
	}

	draw() {
		p5.stroke(255,0,0);
		p5.line(this.p1.x,this.p1.y, this.p2.x,this.p2.y);
		p5.line(this.p1.x-1,this.p1.y-1, this.p2.x+1,this.p2.y+1);
	}
}

