import P5			from 'p5';
import * as tf		from '@tensorflow/tfjs';
import { Wall }		from './wall';
import { Bird }		from './bird';
import { Population } from './population';
import { Maze, Cell } from './maze';
declare const p5:P5;


var globalAny:any = global;
var pop:Population;
var walls:Wall[] = [];
var maze:Maze;
var startCell:Cell;
var player:Bird;

new P5((p5:P5) => {
	tf.setBackend('cpu');
	// const birds:Bird[] = [];


	p5.setup = () => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.background(0);
		globalAny.p5 = p5;					// Hacky way to make p5 global...

		createMaze();

		// Define boundaries as walls
		// walls.push(new Wall(p5.createVector(0,0), p5.createVector(p5.width,0), true));					// top
		// walls.push(new Wall(p5.createVector(0,p5.height), p5.createVector(p5.width,p5.height), true));	// bottom
		// walls.push(new Wall(p5.createVector(0,0), p5.createVector(0, p5.height), true));				// left
		// walls.push(new Wall(p5.createVector(p5.width,0), p5.createVector(p5.width, p5.height), true));	// right

		// walls.push(new Wall(p5.createVector(0,p5.height/2-50), p5.createVector(300,p5.height/2-100)));
		// walls.push(new Wall(p5.createVector(0,p5.height/2+50), p5.createVector(300,p5.height/2+100)));

		// walls.push(new Wall(p5.createVector(300,p5.height/2-100), p5.createVector(500,p5.height/2+100)));
		// walls.push(new Wall(p5.createVector(300,p5.height/2+100), p5.createVector(500,p5.height/2+300)));
		// walls.push(new Wall(p5.createVector(500,p5.height/2+300), p5.createVector(750,p5.height/2+100)));
		// walls.push(new Wall(p5.createVector(500,p5.height/2+100), p5.createVector(750,p5.height/2-100)));

		// walls.push(new Wall(p5.createVector(750,p5.height/2-100), p5.createVector(1000,p5.height/2+100)));
		// walls.push(new Wall(p5.createVector(750,p5.height/2+100), p5.createVector(1000,p5.height/2+300)));
		// walls.push(new Wall(p5.createVector(1000,p5.height/2+300), p5.createVector(1200,p5.height/2+100)));
		// walls.push(new Wall(p5.createVector(1000,p5.height/2+100), p5.createVector(1200,p5.height/2-100)));
		// walls.push(new Wall(p5.createVector(1400,p5.height/2-200), p5.createVector(1400,p5.height/2+200)));

		// walls.push(new Wall(p5.createVector(1000,p5.height/2-300), p5.createVector(1400,p5.height/2-300)));
		// walls.push(new Wall(p5.createVector(1000,p5.height/2+400), p5.createVector(1400,p5.height/2+400)));



		// Create birds
		var start = p5.createVector(25, p5.height/2);
		if(maze) {
			start = p5.createVector(startCell.px+maze.size/2, startCell.py+maze.size/2);
		}
		pop = new Population(50, start);

		// player = new Bird(start);
		// player.player = true;
	};

	var xOffset = 0;
	p5.draw = () => {
		p5.translate(-xOffset,0);
		p5.background(0);

		walls.forEach(wall => wall.draw());
		pop.birds.forEach(bird => {
			bird.draw();
			bird.update(walls);
		});

		if(player) {
			player.draw();
			player.eye.drawSight();
			player.update(walls);
		}

		if(pop.birds.every(b => !b.alive || b.count>1000) && (!player || !player.alive)) {
			p5.noLoop();
			setTimeout(() => restart(), 500);
		}

		// var avgBirdX = birds.filter(b => b.alive).map(b => b.pos.x).reduce((a,b) => a+b, 0);
		// if(avgBirdX>xOffset) xOffset += 5;
	};
});


function createMaze() {
	maze = new Maze(120);
	globalAny.maze = maze;
	startCell = maze.cells[0];
	if(pop) pop.start = p5.createVector(startCell.px+maze.size/2, startCell.py+maze.size/2);
	walls = [];
	maze.cells.forEach(cell => {
		if(cell.walls[0]) walls.push(cell.topWall());
		if(cell.walls[1]) walls.push(cell.rightWall());
		if(cell.walls[2]) walls.push(cell.bottomWall());
		if(cell.walls[3]) walls.push(cell.leftWall());
	});
}

function restart() {
	if(player) {
		player.alive = true;
		player.pos = pop.start;
	}
	pop.calcFitness();
	// console.log('best dna: %o', pop.birds.sort((a,b) => b.pos.x-a.pos.x)[0].dna.values);
	// controls = getControls();
	// pop.size = controls.popSize;
	// pop.mutationRate = controls.mutRate;
	// pop.mutationSize = controls.mutSize;
	createMaze();
	pop.nextGen();


	// pop.birds.concat(player).forEach(bird => {
	// 	bird.speed = controls.speed;
	// 	bird.gravity = controls.gravity;
	// 	bird.lift = controls.lift;
	// 	bird.reset();
	// });
	// if(player) player.reset();
	p5.loop();
}
