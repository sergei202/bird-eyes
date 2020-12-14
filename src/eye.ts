import P5						from 'p5';
import { Wall }					from './wall';
import { Ray }					from './ray';
declare const p5:P5;

export class Eye {
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
			return new Ray(pos, rayDir, angle);
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
		// this.drawSight();
	}

	drawSight() {
		var width = 400/this.rays.length;
		p5.push();
		p5.translate(p5.width - width*this.rays.length-5, 5);
			
		// p5.noStroke();
		p5.stroke(255);
		this.rays.forEach((ray,i) => {
			p5.fill(ray.close * 255);
			if(false) {
				p5.rect(i*width,0, width, 100);
			} else {
				var height = ray.close*200;
				p5.rect(i*width, 100-height/2, width,height);
			}
		});
		// console.log('rays: %o', this.rays);
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
