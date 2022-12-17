class Wavefunction {
    private weights: Weights;
    private coefficientMatrix: CoefficientMatrix;


    constructor(weights: Weights, coefficient_matrix: CoefficientMatrix) {
        this.weights = weights;
        this.coefficientMatrix = coefficient_matrix;
    }

    get(coordinates: Coordinates): Coefficients {
        const [y, x] = coordinates;
        return this.coefficientMatrix[y][x];
    }

    doShannonEntropy(coordinates: Coordinates): number {
        const [y, x] = coordinates;
        let sumWeights = 0;
        let sumWeightsLog = 0;
        for (const optimal in this.coefficientMatrix[y][x]) {
            const weight = this.weights[optimal];
            sumWeights += weight;
            sumWeightsLog += weight * Math.log(weight)
        }
        return Math.log(sumWeights) - (sumWeightsLog / sumWeights)
    }

    isFullyCollapsed() {
        // for (const row in this.coefficientMatrix) {
        //     for(const sequence in row) {
        //         // fixme
        //         return sequence.length <= 1;
        //     }
        // }
    }

    collapsed(coordinates: Coordinates) {
        const [y, x] = coordinates;
        const optimal = this.coefficientMatrix[y][x]
        // todo
        for(const x in this.weights) {
            console.log()
        }
    }

}
