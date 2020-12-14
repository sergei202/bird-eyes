import P5 from 'p5';
import { Wall } from './wall';
declare const p5:P5;

export class Cell {
	size:number;
	x:number;
	y:number;
	walls:boolean[];
	visited = false;

	constructor(x:number, y:number, size:number) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.walls = [true,true,true,true];
	}

	draw(highlight=false) {
		p5.noStroke();
		if(this.visited) {
			p5.fill(0,64,0);
			p5.rect(this.px,this.py, this.size,this.size);
		}
		if(highlight) {
			p5.fill(128,0,0);
			p5.rect(this.px,this.py, this.size,this.size);
		}
		p5.noFill();
		p5.stroke(255);
		if(this.walls[0]) p5.line(this.px,this.py,this.px+this.size,this.py);
		if(this.walls[1]) p5.line(this.px+this.size,this.py,this.px+this.size,this.py+this.size);
		if(this.walls[2]) p5.line(this.px,this.py+this.size,this.px+this.size,this.py+this.size);
		if(this.walls[3]) p5.line(this.px,this.py,this.px,this.py+this.size);
	}

	get px() {
		return this.x*this.size;
	}
	get py() {
		return this.y*this.size;
	}

	topWall():Wall {
		var a = p5.createVector(this.px,this.py);
		var b = p5.createVector(this.px+this.size,this.py);
		return new Wall(a,b);
	}
	bottomWall():Wall {
		var a = p5.createVector(this.px,this.py+this.size);
		var b = p5.createVector(this.px+this.size,this.py+this.size);
		return new Wall(a,b);
	}
	leftWall():Wall {
		var a = p5.createVector(this.px,this.py);
		var b = p5.createVector(this.px,this.py+this.size);
		return new Wall(a,b);
	}
	rightWall():Wall {
		var a = p5.createVector(this.px+this.size,this.py);
		var b = p5.createVector(this.px+this.size,this.py+this.size);
		return new Wall(a,b);
	}
}

export class Maze {
	size:number;
	cells:Cell[] = [];
	stack:Cell[] = [];
	current:Cell = null;

	constructor(size=50) {
		this.size = size;

		for(var j=0;j<p5.floor(p5.height/this.size);j++) {
			for(var i=0;i<p5.floor(p5.width/this.size);i++) {
				var cell = new Cell(i,j, this.size);
				this.cells.push(cell);
			}
		}

		this.current = this.cells[0];
		while(1) {
			this.current.visited = true;
			var next = this.getAvailNeighbor(this.current);
			if(next) {
				this.removeWalls(this.current,next);
				this.stack.push(this.current);
				this.current = next;
			} else {
				if(!this.stack.length) {
					console.log('Done');
					break;
				}
				this.current = this.stack.pop();
			}
		}
	}

	draw() {
		this.cells.forEach(cell => cell.draw());

		if(this.current) {
			p5.fill(0,0,255);
			p5.noStroke();
			p5.rect(this.current.px,this.current.py, this.size,this.size);
			p5.noFill();
		}
	}

	getNeighbors(cell:Cell):Cell[] {
		return this.cells.filter(c => ((c.x===cell.x-1 || c.x===cell.x+1) || (c.y===cell.y-1 || c.y===cell.y+1)) && (c.x===cell.x || c.y===cell.y));
	}

	getAvailNeighbor(cell:Cell):Cell {
		var neighbors = this.getNeighbors(cell).filter(c => !c.visited);
		return p5.random(neighbors);
	}

	removeWalls(a:Cell, b:Cell) {
		var dx = a.x-b.x;
		var dy = a.y-b.y;
		// console.log('removeWalls: dx=%o,dy=%o,\t a=%o, b=%o', dx,dy, a,b);
		if(dx===-1) {
			a.walls[1] = false;
			b.walls[3] = false;
		}
		if(dx===1) {
			a.walls[3] = false;
			b.walls[1] = false;
		}
		if(dy===-1) {
			a.walls[2] = false;
			b.walls[0] = false;
		}
		if(dy===1) {
			a.walls[0] = false;
			b.walls[2] = false;
		}

	}
}