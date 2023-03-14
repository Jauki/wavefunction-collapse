// Little Test script to learn how WaveFunctionCollapse Works!

import { getRandomEnumValue } from "../misc";

export enum Terrain {
  Water = "W",
  Sand = "S",
  Land = "L"
}


type Cell = Terrain[];

type Grid = Cell[][];

// maybe add Type saftey that it cannot by bigger than size?? 
type Coordinate = {
  x: number;
  y: number;
}

const pickedCell = [] as Coordinate[];
const propagatedCell = [] as Coordinate[];
const entropiedCell = [] as Coordinate[];


export function generateInitGrid(size: number): Grid {
  const grid: Grid = [...Array(size+1)].map(e => Array(size+1));
  for (let i = 0; i <= size; i++) {
    for (let j = 0; j <= size; j++){
      grid[i][j] = [Terrain.Land, Terrain.Sand, Terrain.Water];
    }
  }
  return grid;
}

function printGrid(grid: Grid): void {
  for (const row of grid) {
    console.log(row.map((c: Cell) => c.toString().padEnd(5, " ")).join(" "));
  }
}

function getGridSize(grid: Grid): number {
  return grid.length;
}

const getRandomCoordinate = (size: number): Coordinate => {
  const x = Math.floor(Math.random() * size );
  const y = Math.floor(Math.random() * size );
  return { x, y };
}


function pickRandomUnpickedCell(grid: Grid, cell?: Coordinate | undefined) {
  const size = getGridSize(grid);
  if (cell === undefined) {
    let coordiante: Coordinate;
    do {
      coordiante = getRandomCoordinate(size);
    } while (pickedCell.includes(coordiante))  
    grid[coordiante.y][coordiante.x] = Array.of(getRandomEnumValue(Terrain));
  } else {
    grid[cell.y][cell.x] = Array.of(getRandomEnumValue(Terrain));
  }
  console.log("")
  printGrid(grid)
  propagateGrid(grid);
  //xshannonEntropy(grid);
  console.log("")
  printGrid(grid)
}


function getNeighbors(grid: Grid, target: Coordinate): Coordinate[] {
  let neighbors: Coordinate[] = [];
  if (target.x > 0) {
    neighbors.push({x : target.x - 1, y:  target.y })
  }
  if (target.x < grid.length - 1) {
    neighbors.push({x : target.x + 1, y:  target.y })
  }
  if (target.y > 0) {
    neighbors.push({x : target.x, y:  target.y - 1 })
  }
  if (target.y < grid.length - 1) {
    neighbors.push({x : target.x, y:  target.y + 1 })
  }
  return neighbors;
}

function setPropabilites(terrain: Terrain) {
  // cell -> L -> S oder L 
  // cell -> W -> S  oder W
  // cell -> S -> L oder W oder S

  switch (terrain) {
    case Terrain.Water: return [Terrain.Sand, Terrain.Water];
    case Terrain.Sand: return [Terrain.Sand, Terrain.Water, Terrain.Land];
    case Terrain.Land: return [Terrain.Sand, Terrain.Land];
  }
}

function propagateGrid(grid: Grid) {
  for (let i = 0; i <= grid.length - 1; i++) {
    for (let j = 0; j <= grid.length - 1; j++){
      if (grid[i][j].length === 1
        && !propagatedCell.includes({ x: j, y: i })) {
        const currentCell = grid[i][j]
        const neighbors = getNeighbors(grid, { x: j, y: i });
        for (const neighbor of neighbors) {
          grid[neighbor.y][neighbor.x] = setPropabilites(currentCell[0])
        }
        propagatedCell.push({ x: j, y: i })
        const stateCounts: TerrainStates = { W: 0, L: 0, S: 0 }
        // für nachbarn von nachbarn
        for (const neighbor of neighbors) {
          for (const cell of grid[neighbor.y][neighbor.x]) {
            stateCounts[cell]++;
          }
        }
        console.log(stateCounts)
        // take cell and entropy
      }
    }
  }
}


type TerrainStates = {
  [k in  Terrain]: number;
}



function shannonEntropy(grid: Grid) {
  const entropy = [...Array(grid.length)].map(e => Array(grid.length));
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const stateCounts: TerrainStates = { W: 0, L: 0, S: 0 }
      
      const neighbors = getNeighbors(grid, { x: j, y: i });
      // fixme
      for (const neighbor of neighbors) {
        for (const cell of grid[neighbor.y][neighbor.x]) {
          stateCounts[cell]++;
        }
      }
      
      const entropyValue: number = -Object.values(stateCounts)
        .filter(f => f > 0) // exclude states with zero frequency
        .reduce((sum, f) => sum + f * Math.log2(f), 0);
      console.log(`Cell: x:${j} y:${i} Entropy: ${entropyValue}`)
      entropy[i][j] = entropyValue
    }
  }
  let biggestValue
  do {
    let [x, y] = findBiggestValuePosition(entropy)
    biggestValue = { x: x, y: y };
  } while (entropiedCell.includes(biggestValue))
  entropiedCell.push(biggestValue)
  pickRandomUnpickedCell(grid, biggestValue)
}

function findBiggestValuePosition(arr: number[][]): [number, number] {
  const flattened = arr.flat();
  const maxValue = Math.min(...flattened);
  const minIndex = flattened.indexOf(maxValue);
  const numRows = arr.length;
  const numCols = arr[0].length;
  const minRow = Math.floor(minIndex / numCols);
  const minCol = minIndex % numCols;
  return [minRow, minCol];
}


export function main(size: number, probabilities: Record<Terrain, number>) {
  const grid = generateInitGrid(size);
  console.log('Initial grid:');
  printGrid(grid)
  pickRandomUnpickedCell(grid);
  // 1. Propagate
  //   1. iterate list
  //   2. get Neighbors
  //   3. change Neighbors, Cell
  // 2. log
  console.log("Random picked cell")
}