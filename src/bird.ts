import P5						from 'p5';
import { Wall }					from './wall';
import { Ray }					from './ray';
import { collisionLineCircle }	from './collision';
declare const p5:P5;

class Eye {
	pos:P5.Vector;
	dir:P5.Vector;
	rays:Ray[];

	constructor(count:number, fov:number, pos:P5.Vector, dir:P5.Vector) {
		this.pos = pos;
		this.dir = dir;

		var step = fov/(count-1);

		this.rays = Array.from({length:count}).map((u,i) => {
			var rayDir = this.dir.copy();
			var angle = step*i - fov/2;
			if(count===1) angle = 0;		// Special case if only one ray
			rayDir.rotate(angle);
			return new Ray(pos, rayDir);
		});
	}

	castRays(walls:Wall[]) {
		this.rays.forEach(ray => {
			ray.castRayWalls(walls);
		});
		return false;
	}

	draw() {
		this.rays.forEach(ray => ray.draw());
		p5.push();
		p5.translate(this.pos.x, this.pos.y);
		p5.stroke(0,0,255,255);
		// this.dir.setMag(20);
		// p5.line(0,0, this.dir.x,this.dir.y);
		p5.pop();
		this.drawSight();
	}

	drawSight() {
		var width = 400/this.rays.length;
		p5.push();
		p5.translate(p5.width - width*this.rays.length-5, 5);
			
		// p5.noStroke();
		this.rays.forEach((ray,i) => {
			var closeness = (1-ray.dist/p5.width);
			closeness = Math.pow(closeness,3); 
			p5.fill(closeness * 255);
			p5.rect(i*width,0, width, 100);
			// var height = closeness*200;
			// p5.rect(i*width, 100-height/2, width,height);
		});
		p5.pop();
	}

	update(newPos:P5.Vector, angle:number) {
		this.pos = newPos;
		this.dir.rotate(angle);
		this.rays.forEach(ray => {
			ray.pos = this.pos;
			ray.dir.rotate(angle);
		});
	}
}


export class Bird {
	pos:P5.Vector;
	vel:P5.Vector;
	acc:P5.Vector;
	size = 30;
	alive = true;
	eye:Eye;

	speed = 1;
	angle = 0;
	maxSpeed = 5;
	turnSpeed = 0.01;

	constructor(pos:P5.Vector) {
		this.pos = pos;
		this.vel = p5.createVector(this.speed,0);
		this.acc = p5.createVector(0,0);

		this.eye = new Eye(50, Math.PI/2, p5.createVector(pos.x,pos.y), p5.createVector(1,0));
	}

	draw() {
		p5.push();
		p5.fill(this.alive ? 255 : 64);
		p5.noStroke();

		p5.translate(this.pos.x, this.pos.y);
		p5.rotate(this.vel.heading());

		// p5.triangle(0,0-this.size/2, this.size,0, 0,0+this.size/2);
		p5.circle(0,0, this.size);
		p5.pop();

		if(this.alive) this.eye.draw();
	}

	update(walls:Wall[]) {
		if(!this.alive) return;

		var angle = 0;
		if(p5.keyIsDown(37)) angle = -(this.turnSpeed + this.speed/100);
		if(p5.keyIsDown(38) && this.speed+0.1<this.maxSpeed) this.speed += 0.1;
		if(p5.keyIsDown(40) && this.speed>0.1) this.speed -= 0.1;
		if(p5.keyIsDown(39)) angle = +(this.turnSpeed + this.speed/100);

		this.vel.rotate(angle);
		this.vel.setMag(this.speed);

		this.pos.add(this.vel);
		this.vel.add(this.acc);
		this.eye.update(this.pos, angle);

		this.seeWalls(walls);
		if(this.collideWalls(walls)) this.alive = false;
		// if(this.pos.y<0 || this.pos.y>=p5.height) this.alive=false;
	}

	seeWalls(walls:Wall[]) {
		return this.eye.castRays(walls);
	}

	collideWalls(walls:Wall[]) {
		return walls.some(w => this.collideWall(w));
	}

	collideWall(wall:Wall) {
		return collisionLineCircle(wall.p1.x,wall.p1.y, wall.p2.x,wall.p2.y, this.pos.x,this.pos.y, this.size);
	}

}


