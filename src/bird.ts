import P5						from 'p5';
import { Wall }					from './wall';
import { Eye }					from './eye';
import { collisionLineCircle }	from './collision';
import { Brain }				from './brain';
import { Dna }					from './dna';
declare const p5:P5;

export class Bird {
	pos:P5.Vector;
	vel:P5.Vector;
	acc:P5.Vector;
	size = 30;
	alive = true;
	eye:Eye;

	speed = 2;
	angle = 0;
	maxSpeed = 5;
	turnSpeed = 0.01;

	brain:Brain;
	dna:Dna;
	count = 0;
	fitness:number;
	normFitness:number;

	constructor(pos:P5.Vector) {
		this.pos = pos;
		this.vel = p5.createVector(this.speed,0);
		this.acc = p5.createVector(0,0);

		this.eye = new Eye(8, Math.PI/2, p5.createVector(pos.x,pos.y), p5.createVector(1,0));

		this.brain = new Brain(this.eye.rays.length, 8, 2);
		this.dna = new Dna(this.brain.getWeights().length);
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

		this.angle = 0;
		if(p5.keyIsDown(37)) this.turnLeft();
		if(p5.keyIsDown(38) && this.speed+0.1<this.maxSpeed) this.speed += 0.1;
		if(p5.keyIsDown(40) && this.speed>0.1) this.speed -= 0.1;
		if(p5.keyIsDown(39)) this.turnRight();

		var actions = this.brain.predict(this.eye.rays.map(r => r.close));
		if(actions[0]>0.5) this.turnLeft();
		if(actions[1]>0.5) this.turnRight();


		this.vel.rotate(this.angle);
		this.vel.setMag(this.speed);

		this.pos.add(this.vel);
		this.vel.add(this.acc);
		this.eye.update(this.pos, this.angle);

		this.seeWalls(walls);
		if(this.collideWalls(walls)) this.alive = false;
		this.count++;
	}

	turnLeft() {
		this.angle -= (this.turnSpeed + this.speed/100);
	}
	turnRight() {
		this.angle += (this.turnSpeed + this.speed/100);
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

	applyDna() {
		this.brain.setWeights(this.dna.values);
	}

	calcFitness() {
		var dist = this.pos.x/p5.width;
		var count = this.count/1000;
		this.fitness = Math.pow(dist,3) + Math.pow(count,2);

		return this.fitness;
	}
}


