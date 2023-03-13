// Little Test script to learn how WaveFunctionCollapse Works!

export enum Terrain {
  Water = "W",
  Sand = "S",
  Land = "L"
}

const terrainRules: Record<Terrain, Terrain[]> = {
  [Terrain.Water]: [Terrain.Sand],
  [Terrain.Sand]: [Terrain.Land, Terrain.Water],
  [Terrain.Land]: [Terrain.Sand]
};

type Grid = Terrain[][];

export function generateRandomGrid(size: number, probabilities: Record<Terrain, number>): Grid {
  const grid: Grid = [];
  for (let y = 0; y < size; y++) {
    const row: Terrain[] = [];
    for (let x = 0; x < size; x++) {
      let random = Math.random();
      let terrain: Terrain;

      for (const t of Object.values(Terrain)) {
        if (random < probabilities[t]) {
          terrain = t;
          break;
        } else {
          random -= probabilities[t];
        }
      }
      row.push(terrain! || Terrain.Land);
    }
    grid.push(row);
  }
  return grid;
}

function printGrid(grid: Grid): void {
  for (const row of grid) {
    console.log(row.join(' '));
  }
}

function chooseRandomState(states: Terrain[]): Terrain {
  return states[Math.floor(Math.random() * states.length)];
}

function collapseWaveFunction(grid: Grid, x: number, y: number, states: Terrain[], probabilities: Record<Terrain, number>): void {
  // fixme: 
  const validStates = states.filter(state => {
    const neighbors = getNeighbors(grid, x, y, false) as Terrain[];
    const validTerrains = terrainRules[state];
    return neighbors.every(neighbor => validTerrains.includes(neighbor));
  });

  const newState = chooseRandomState(validStates);
  grid[y][x] = newState;


  const neighbors = getNeighbors(grid, x, y, true) as number[][];
  for (let i = 0; i < neighbors.length; i++) {
    propagateWaveFunction(grid, neighbors[i][0], neighbors[i][1] , probabilities);
  }
}


function propagateWaveFunction(grid: Grid, x: number, y: number, probabilities: Record<Terrain, number>): void {
  // todo: rewrite the propagate function!!
  // const states = Object.values(Terrain);
  // if (grid[y][x] !== undefined) {
  //   states.splice(states.indexOf(grid[y][x]), 1);
  // }

  // if (states.length === 1) {
  //   return;
  // }

  // collapseWaveFunction(grid, x, y, states, probabilities);
}

function getNeighbors(grid: Grid, x: number, y: number, coordinate: boolean): Terrain[] | number[][] {
  // const size = grid.length;
  // const neighbors: Terrain[] = [];
  // let coordinates: number[][] = [[]];
  // for (let dy = -1; dy <= 1; dy++) {
  //   for (let dx = -1; dx <= 1; dx++) {
  //     if (dx === 0 && dy === 0) {
  //       continue;
  //     }
  //     const nx = x + dx;
  //     const ny = y + dy;

  //     // Check if the cell is within the grid
  //     if (nx < 0 || ny < 0 || nx >= size || ny >= size) {
  //       continue;
  //     }
  //     coordinates.push([ny, nx]);
  //     neighbors.push(grid[ny][nx]);
  //   }
  // }
  // coordinates.shift()
  // return coordinate ? coordinates! : neighbors;
  return  [[0,2]];
}

export function main(size: number, probabilities: Record<Terrain, number>) {
  const grid = generateRandomGrid(size, probabilities);
  // propagateWaveFunction(grid, 0, 0, probabilities);
  console.log('Initial grid:');
  printGrid(grid)
}