// Little Test script to learn how WaveFunctionCollapse Works!

type Terrain = 'W' | 'S' | 'L';

type Grid = Terrain[][];

function generateRandomGrid(size: number, probabilities: Record<Terrain, number>): Grid {
  const terrains = Object.keys(probabilities) as Terrain[];
  const grid: Grid = [];

  for (let y = 0; y < size; y++) {
    const row: Terrain[] = [];

    for (let x = 0; x < size; x++) {
      let random = Math.random();
      let terrain: Terrain | undefined;

      for (const t of terrains) {
        if (random < probabilities[t]) {
          terrain = t;
          break;
        } else {
          random -= probabilities[t];
        }
      }

      row.push(terrain || 'L');
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

function createWaveFunction(size: number, terrains: Terrain[]): Record<string, number[]> {
  const wf: Record<string, number[]> = {};

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const state: string[] = [];

      for (const t of terrains) {
        state.push(`${y},${x},${t}`);
      }

      wf[`${y},${x}`] = state.map((s) => wf[s] ? [...wf[s]] : s) as [];
    }
  }

  return wf;
}

function chooseRandomState(states: number[]): number {
  return states[Math.floor(Math.random() * states.length)];
}

// todo: fix collapse Wave Function
function collapseWaveFunction(wf: Record<string, number[]>, grid: Grid): boolean {
  const uncollapsed = Object.keys(wf);
  if (uncollapsed.length === 0) return true;

  const [minCell, minStates] = uncollapsed.reduce<[string, number[]]>((min, cell) => {
    const [y, x] = cell.split(',').map(Number);
    const numStates = wf[cell].length;

    if (numStates === 1) {
      grid[y][x] = wf[cell][0].toString() as Terrain;
      console.log("foo!")
      return min;
    } else if (numStates < min[1].length) {
      return [cell, wf[cell]];
    } else {
      return min;
    }
  }, ['', []]);

  const nextState = chooseRandomState(minStates);
  console.log(minStates)
  // const [y, x, terrain] = minStates[nextState].split(',').map(Number);

  // grid[y][x] = terrain.toString() as Terrain;
  // delete wf[minCell];

  // for (const cell in wf) {
  //   if (cell === minCell) continue;
  //   const [y2, x2] = cell.split(',').map(Number);

  //   wf[cell] = wf[cell].filter((state) => {
  //     const [y3, x3] = state.toString().split(',').map(Number);
  //     const distance = Math.abs(y2 - y) + Math.abs(x2 - x);

  //     if (distance === 0) return true;

  //     const terrain1 = grid[y][x];
  //     const terrain2 = grid[y3][x3];

  //     return terrain1 === terrain2 || (terrain1 === 'S' && terrain2 === 'W') || (terrain1 === 'W' && terrain2 === 'S');
  //   });

  //   if (wf[cell].length === 0) return false;
  // }

  // return collapseWaveFunction(wf, grid);
  return true
}


export function main(size: number, probabilities: Record<Terrain, number>) {
  const grid = generateRandomGrid(size, probabilities);
  const wf =createWaveFunction(5, ['W', 'S','L']);;

  console.log('Initial grid:');
  printGrid(grid)

  const result = collapseWaveFunction(wf, grid);

  if (result) {
    console.log('Collapsed grid:');
    console.log(grid);
  } else {
    console.log('Failed to collapse grid');
  }
}