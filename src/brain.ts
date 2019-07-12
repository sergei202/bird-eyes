import * as tf from '@tensorflow/tfjs';
import P5						from 'p5';
declare const p5:P5;

export class Brain {
	inputSize:number;
	hiddenSize:number;
	outputSize:number;
	model:tf.Sequential;

	constructor(inputSize:number, hiddenSize:number,outputSize:number) {
		this.inputSize = inputSize;
		this.hiddenSize = hiddenSize;
		this.outputSize = outputSize;

		this.model = tf.sequential();
		const hiddenLayer = tf.layers.dense({inputShape:[inputSize], units:hiddenSize, activation:'sigmoid'});
		const outputLayer = tf.layers.dense({units:outputSize, activation:'softmax'});
		this.model.add(hiddenLayer);
		this.model.add(outputLayer);
	}

	getWeights():number[] {
		var weightTensors = this.model.getWeights();
		var weights:any[] = [];
		weightTensors.forEach(tensor => {
			// tensor.print();
			tensor.dataSync().forEach((w:any) => weights.push(Number(w)));
		});
		// console.log('getWeights: weights=%o', weights);
		return weights;
	}
	
	setWeights(weights:number[]) {
		// console.log('setWeights: weights=%o', weights);
		var wi0 = this.inputSize*this.hiddenSize;
		var wi1 = wi0 + this.hiddenSize;
		var wi2 = wi1 + this.hiddenSize*this.outputSize;
		var wi3 = wi2 + this.outputSize;
		var w0 = weights.slice(0,wi0);
		var w1 = weights.slice(wi0,wi1);
		var w2 = weights.slice(wi1,wi2);
		var w3 = weights.slice(wi2,wi3);
		// console.log('wi0:%o, wi1:%o, wi2:%o, wi3:%o', wi0,wi1,wi2,wi3);
		// console.log('\tw0: %o', w0);
		// console.log('\tw1: %o', w1);
		// console.log('\tw2: %o', w2);
		// console.log('\tw3: %o', w3);
		return tf.tidy(() => {
			this.model.setWeights([
				tf.tensor2d(w0, [this.inputSize,this.hiddenSize]),
				tf.tensor(w1),
				tf.tensor2d(w2, [this.hiddenSize,this.outputSize]),
				tf.tensor(w3)
			]);
		});
	}

	predict(inputs:number[]):number[] {
		return tf.tidy(() => {
			var t = this.model.predict(tf.tensor2d([inputs], [1,this.inputSize])) as tf.Tensor;
			return Array.from(t.dataSync());
		});
	}
}