export class Dna {
	values:number[] = [];

	constructor(public size:number) {
		for(var i=0;i<size;i++) {
			this.values[i] = random(-1,1);
		}
	}

	static crossover(a:Dna, b:Dna):Dna {
		var child = new Dna(a.size);
		var mid = randomInt(0,a.size);
		child.values = child.values.map((v,i) => {
			return i>=mid ? a.values[i] : b.values[i];
		});
		// console.log('crossover:  a=%o, b=%o, child=%o', a,b,child);
		return child;
	}

	mutate(rate=0.01, size=0.25) {
		this.values = this.values.map(value => {
			if(random()<rate) {
				value += random(-size,size);
			}
			return value;
		});
	}
}

function random(min=0,max=1) {
	return Math.random()*(max-min)+min;
}

function randomInt(min:number, max:number) {
	return Math.floor(random(min,max));
}
