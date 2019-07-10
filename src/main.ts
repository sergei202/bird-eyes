import P5			from 'p5';
import { Wall }		from './wall';
import { Bird }		from './bird';


var globalAny:any = global;

new P5((p5:P5) => {
	const birds:Bird[] = [];
	const walls:Wall[] = [];

	p5.setup = () => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.background(0);
		globalAny.p5 = p5;					// Hacky way to make p5 global...

		// Define boundaries as walls 
		walls.push(new Wall(p5.createVector(0,0), p5.createVector(p5.width,0), true));					// top
		walls.push(new Wall(p5.createVector(0,p5.height), p5.createVector(p5.width,p5.height), true));	// bottom
		walls.push(new Wall(p5.createVector(0,0), p5.createVector(0, p5.height), true));				// left
		walls.push(new Wall(p5.createVector(p5.width,0), p5.createVector(p5.width, p5.height), true));	// right
	


		walls.push(new Wall(p5.createVector(350,100), p5.createVector(450,300)));
		walls.push(new Wall(p5.createVector(850,200), p5.createVector(850,500)))
		walls.push(new Wall(p5.createVector(700,500), p5.createVector(650,660)))
		

		// Create birds
		for(var i=0;i<1;i++) {
			birds.push(new Bird(p5.createVector(250, 350+i*50)));	// p5.random(0,p5.height))));
		}
	};

	var xOffset = 0;
	p5.draw = () => {
		p5.translate(-xOffset,0);
		p5.background(0);
		// birds[0].pos.set(p5.mouseX,p5.mouseY);
		walls.forEach(wall => wall.draw());
		birds.forEach(bird => {
			bird.update(walls);
			bird.draw();
		});
		
		// var avgBirdX = birds.filter(b => b.alive).map(b => b.pos.x).reduce((a,b) => a+b, 0);
		// if(avgBirdX>xOffset) xOffset += 5;
	};
});
