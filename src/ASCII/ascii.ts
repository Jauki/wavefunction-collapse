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

function hasDuplicateCoordinate(arr: Coordinate[], coord: Coordinate): boolean {
  return arr.some(item => item.x === coord.x && item.y === coord.y);
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

const getRandomCoordinate = (size: number): Coordinate => {
  const x = Math.floor(Math.random() * size );
  const y = Math.floor(Math.random() * size );
  return { x, y };
}

let count = 0;


function pickRandomUnpickedCell(grid: Grid, cell?: Coordinate | undefined) {
  const coordiante = shannonEntropy(grid);
  console.log("Biggest: " + coordiante.x + ", " + coordiante.y);
  const selected = grid[coordiante.y][coordiante.x];
  
  const terrain = selected[Math.floor(Math.random() * selected.length)];
  grid[coordiante.y][coordiante.x] = Array.of(terrain);
  
  console.log("-----------------------------------")
  grid = propagateGrid(grid);
  printGrid(grid);
  console.log("-----------------------------------")
  if (count <= 4 ) {
    count++;
    pickRandomUnpickedCell(grid);
  }
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
  /// TODO: it overwrites the cell if it was already selected 
  switch (terrain) {
    case Terrain.Water: return [Terrain.Sand, Terrain.Water];
    case Terrain.Sand: return [Terrain.Sand, Terrain.Water, Terrain.Land];
    case Terrain.Land: return [Terrain.Sand, Terrain.Land];
  }
}

function propagateGrid(grid: Grid) {
  for (let i = 0; i <= grid.length - 1; i++) {
    for (let j = 0; j <= grid.length - 1; j++) {
      if (grid[i][j].length === 1
        && hasDuplicateCoordinate(pickedCell, {x: j, y: i})) {
        const currentCell = grid[i][j]
        const neighbors = getNeighbors(grid, { x: j, y: i });
        for (const neighbor of neighbors) {
          grid[neighbor.y][neighbor.x] = setPropabilites(currentCell[0])
        }
        propagatedCell.push({ x: j, y: i })
      }
    }
  }
  return grid;
}


type TerrainStates = {
  [k in  Terrain]: number;
}



function shannonEntropy(grid: Grid): Coordinate {
  const entropy = [...Array(grid.length)].map(e => Array(grid.length));
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const stateCounts: TerrainStates = { W: 0, L: 0, S: 0 }
      
      const neighbors = getNeighbors(grid, { x: j, y: i });
      for (const neighbor of neighbors) {
        for (const cell of grid[neighbor.y][neighbor.x]) {
          stateCounts[cell]++;
        }
      }
      // Calc Shanon Entropy
      const shannonEntropyF = (val: number[]) => 
        val.map(v => -v * Math.log2(v)).reduce((x, y) => x + y, 0);
      
      const entropyValue = shannonEntropyF(Object.values(stateCounts))
      
      // console.log(`Cell: x:${j} y:${i} Entropy: ${entropyValue}`)
      entropy[i][j] = entropyValue
    }
  }
  
  // let [x, y] = findBiggestValuePosition(entropy);
  // console.log(x, y)
  let coordinate;
  let i = -1;
  do {
    i++;
    coordinate = sortEntropyArray(entropy)[i]
  } while (hasDuplicateCoordinate(pickedCell, coordinate));
  pickedCell.push(coordinate)
  return coordinate;
}

function sortEntropyArray(array: number[][]): Coordinate[] {
  // Create an array of { value, coordinate } objects
  let data: { value: number, coordinate: Coordinate }[] = [];
  for (let y = 0; y < array.length; y++) {
    for (let x = 0; x < array[y].length; x++) {
      data.push({ value: array[y][x], coordinate: { x, y } });
    }
  }

  // Sort the array by value
  data.sort((a, b) => a.value - b.value);
  data = data.filter((e) => !isNaN(e.value));
  // Create a new array of sorted coordinates
  const sortedCoords: Coordinate[] = [];
  for (let i = 0; i < data.length; i++) {
    sortedCoords.push(data[i].coordinate);
  }
  return sortedCoords;
}

function findBiggestValuePosition(arr: number[][]): [number, number] {
  const flattened = arr.flat();
  const maxValue = Math.max(...flattened);
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
}