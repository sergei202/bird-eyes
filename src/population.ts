import P5			from 'p5';
import { Bird }		from './bird';
import { Dna }		from './dna';
declare const p5:P5;

export class Population {
	birds:Bird[];
	generation = 1;
	bestDist = 0;
	mutationRate = 0.01;
	mutationSize = 0.1;

	constructor(public size:number, public start:P5.Vector) {
		this.createBirds();
	}

	createBirds() {
		this.birds = Array.from({length:this.size}).map((u,i) => {
			return new Bird(this.start);
		});
	}


	nextGen() {
		this.generation++;
		this.calcNormFitness();
		var newDnas = this.birds.map(bird => {
			var a = this.randomWeighted();
			var b = this.randomWeighted();
			// console.log('nextGen: a=%o, b=%o', a,b);
			var dna = Dna.crossover(a.dna,b.dna);
			dna.mutate(this.mutationRate, this.mutationSize);
			return dna;
		});
		this.createBirds();
		this.birds.forEach((bird,i) => {
			if(newDnas[i]) {		// This won't exist for some if population was resized
				bird.dna = newDnas[i];
				bird.applyDna();
			}
		});
	}

	calcFitness() {
		this.birds.forEach(entity => {
			entity.calcFitness();
		});
		this.birds = this.birds.sort((a,b) => b.fitness-a.fitness);
	}
	calcNormFitness() {
		var total = this.birds.map(r => r.fitness).reduce((a,b) => a+b, 0);
		this.birds.forEach(r => r.normFitness=r.fitness/total);
	}

	randomWeighted() {
		var r = p5.random(0,1);
		for(var i=0;i<this.birds.length;i++) {
			if(r<this.birds[i].normFitness) return this.birds[i];
			r -= this.birds[i].normFitness;
		}
	}
}
