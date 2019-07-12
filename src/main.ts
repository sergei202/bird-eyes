import P5			from 'p5';
import * as tf		from '@tensorflow/tfjs';
import { Wall }		from './wall';
import { Bird }		from './bird';
import { Population } from './population';
declare const p5:P5;


var globalAny:any = global;
var pop:Population;
var walls:Wall[] = [];

new P5((p5:P5) => {
	tf.setBackend('cpu');
	// const birds:Bird[] = [];
	
	

	p5.setup = () => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.background(0);
		globalAny.p5 = p5;					// Hacky way to make p5 global...

		// Define boundaries as walls 
		walls.push(new Wall(p5.createVector(0,0), p5.createVector(p5.width,0), true));					// top
		walls.push(new Wall(p5.createVector(0,p5.height), p5.createVector(p5.width,p5.height), true));	// bottom
		walls.push(new Wall(p5.createVector(0,0), p5.createVector(0, p5.height), true));				// left
		walls.push(new Wall(p5.createVector(p5.width,0), p5.createVector(p5.width, p5.height), true));	// right
	

		walls.push(new Wall(p5.createVector(0,p5.height/2-50), p5.createVector(300,p5.height/2-100)));
		walls.push(new Wall(p5.createVector(0,p5.height/2+50), p5.createVector(300,p5.height/2+100)));
		walls.push(new Wall(p5.createVector(300,p5.height/2-100), p5.createVector(500,p5.height/2+100)));
		walls.push(new Wall(p5.createVector(300,p5.height/2+100), p5.createVector(500,p5.height/2+300)));
		walls.push(new Wall(p5.createVector(500,p5.height/2+300), p5.createVector(750,p5.height/2+100)));
		walls.push(new Wall(p5.createVector(500,p5.height/2+100), p5.createVector(750,p5.height/2-100)));

		walls.push(new Wall(p5.createVector(750,p5.height/2-100), p5.createVector(1000,p5.height/2+100)));
		walls.push(new Wall(p5.createVector(750,p5.height/2+100), p5.createVector(1000,p5.height/2+300)));
		walls.push(new Wall(p5.createVector(1000,p5.height/2+300), p5.createVector(1200,p5.height/2+100)));
		walls.push(new Wall(p5.createVector(1000,p5.height/2+100), p5.createVector(1200,p5.height/2-100)));
		walls.push(new Wall(p5.createVector(1400,p5.height/2-200), p5.createVector(1400,p5.height/2+200)));

		walls.push(new Wall(p5.createVector(1000,p5.height/2-300), p5.createVector(1400,p5.height/2-300)));
		walls.push(new Wall(p5.createVector(1000,p5.height/2+400), p5.createVector(1400,p5.height/2+400)));



		// for(var i=0;i<10;i++) {
		// 	var p1 = p5.createVector(p5.random(p5.width),p5.random(p5.height));
		// 	var p2 = p1.copy().add(p5.random(-300,300),p5.random(-300,300));
		// 	walls.push(new Wall(p1,p2));
		// }

		// Create birds
		pop = new Population(25);



		// console.clear();
		// var w = pop.birds[0].brain.getWeights();
		// pop.birds[0].brain.setWeights(w);
		// p5.noLoop();

		// for(var i=0;i<1;i++) {
		// 	birds.push(new Bird(p5.createVector(250, 350+i*50)));	// p5.random(0,p5.height))));
		// }
	};

	var xOffset = 0;
	p5.draw = () => {
		p5.translate(-xOffset,0);
		p5.background(0);
		// birds[0].pos.set(p5.mouseX,p5.mouseY);
		walls.forEach(wall => wall.draw());
		pop.birds.forEach(bird => {
			bird.update(walls);
			bird.draw();
		});

		if(pop.birds.every(b => !b.alive || b.count>3000)) {
			restart();
		}

		// var avgBirdX = birds.filter(b => b.alive).map(b => b.pos.x).reduce((a,b) => a+b, 0);
		// if(avgBirdX>xOffset) xOffset += 5;
	};
});

function restart() {
	pop.calcFitness();
	// console.log('best dna: %o', pop.birds.sort((a,b) => b.pos.x-a.pos.x)[0].dna.values);
	// controls = getControls();
	// pop.size = controls.popSize;
	// pop.mutationRate = controls.mutRate;
	// pop.mutationSize = controls.mutSize;
	pop.nextGen();
	// pop.birds.concat(player).forEach(bird => {
	// 	bird.speed = controls.speed;
	// 	bird.gravity = controls.gravity;
	// 	bird.lift = controls.lift;
	// 	bird.reset();
	// });
	// if(player) player.reset();
	// p5.loop();
}
