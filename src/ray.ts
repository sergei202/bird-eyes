import P5							from 'p5';
import { collisionLineCircle }		from './collision';
import { Wall } from './wall';
declare const p5:P5;

export class Ray {
	pos:P5.Vector;
	dir:P5.Vector;
	dist:number;		// Distance to nearest wall
	close:number;		// 1-0 of how close something is
	sight = 250;
	angle = 0;			// Used to calculate the actual distance to get rid of the fisheye effect

	constructor(pos:P5.Vector, dir:P5.Vector, angle:number) {
		this.pos = pos;
		this.dir = dir;
		this.angle = angle;
	}

	draw() {
		p5.push();
		p5.stroke(0,192,0, 128);
		p5.fill(0,192,0, 128);
		p5.translate(this.pos.x, this.pos.y);
		p5.circle(0,0, 4);
		this.dir.setMag(20);
		p5.line(0,0, this.dir.x,this.dir.y);
		p5.pop();
	}

	castRayWalls(walls:Wall[]) {
		var closest:any = null;
		walls.forEach(wall => {
			var result = this.castRayWall(wall);
			if(!result) return;
			if(!closest || result.dist<closest.dist) closest = result;
		});
		if(!closest) {
			this.dist = this.sight;
			this.close = 0;
			return false;
		}
		this.dist = closest.dist;
		this.close = 1 - this.dist/this.sight;

		p5.stroke(128,128,128);
		p5.fill(255);
		p5.line(this.pos.x,this.pos.y, closest.x,closest.y);
		p5.circle(closest.x,closest.y, 8);
	}



	castRayWall(wall:Wall) {
		var dir = this.dir.setMag(this.sight);	// Set max sight distance to be the width of the canvas
		var x1=this.pos.x, y1=this.pos.y,	x2=this.pos.x+dir.x, y2=this.pos.y+dir.y;
		var x3=wall.p1.x, y3=wall.p1.y,		x4=wall.p2.x, y4=wall.p2.y;

		var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
		var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

		// if uA and uB are between 0-1, lines are colliding
		if(uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
			var interX = x1 + (uA * (x2-x1));
			var interY = y1 + (uA * (y2-y1));
			// p5.stroke(128,128,128,64);
			// p5.line(this.pos.x,this.pos.y, interX,interY);
			// p5.circle(interX,interY, 1);
			var dist = p5.dist(x1,y1, interX,interY);
			dist *= Math.cos(this.angle);
			return {x:interX, y:interY, dist};
		}
		return null;
	}
}
