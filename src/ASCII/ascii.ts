// Little Test script to learn how WaveFunctionCollapse Works!

import { ChildProcess } from "child_process";
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
  return coord === undefined ? false : arr.some(item => item.x === coord.x && item.y === coord.y);
}


const pickedCell = [] as Coordinate[];
const propagatedCell = [] as Coordinate[];


export function generateInitGrid(size: number): Grid {
   const grid: Grid = Array.from(Array(size), () => new Array(size));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++){
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
  const x = Math.floor(Math.random() * size + 1);
  const y = Math.floor(Math.random() * size + 1);
  return { x, y };
}


function pickRandomUnpickedCell(grid: Grid) {
  const coordiante = shannonEntropy(grid)
  if (coordiante === undefined) {
    console.log("Done!")
    return;
  }
  console.log("Biggest: " + coordiante.x + ", " + coordiante.y);
  const selected = grid[coordiante.y][coordiante.x];
  
  const terrain = selected[Math.floor(Math.random() * selected.length)];
  grid[coordiante.y][coordiante.x] = Array.of(terrain);
  printGrid(grid)
  console.log("-----------------------------------")
  grid = propagateGrid(coordiante as Coordinate, grid,);
  printGrid(grid);
  console.log("-----------------------------------")
  pickRandomUnpickedCell(grid);
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

function setPropabilites(terrain: Terrain[]) {
  // cell -> L -> S oder L 
  // cell -> W -> S  oder W
  // cell -> S -> L oder W oder S
    // console.log(terrain)
    switch (terrain[0]) {
      case Terrain.Water: return [Terrain.Sand, Terrain.Water];
      case Terrain.Sand: return [Terrain.Sand, Terrain.Water, Terrain.Land];
      case Terrain.Land: return [Terrain.Sand, Terrain.Land];
  }
}

function propagateGrid(coordiante: Coordinate, grid: Grid) {
  // for (let i = 0; i < grid.length; i++) {
  //   for (let j = 0; j < grid[i].length; j++) {
        const currentCell = grid[coordiante.y][coordiante.x]
  const neighbors = getNeighbors(grid, coordiante);
        // todo: write function if the neighbor has been propagated or is in final state!
        for (const neighbor of neighbors) {
          grid[neighbor.y][neighbor.x] = setPropabilites(currentCell)
        }
        // propagatedCell.push({ x: j, y: i })
  //   }
  // }
  return grid;
}


type TerrainStates = {
  [k in  Terrain]: number;
}

function shannonEntropy(grid: Grid) {
  const entropy = [...Array(grid.length)].map(e => Array(grid[0].length).fill(0));
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const stateCounts: { [state: string]: number } = { W: 0, L: 0, S: 0 };
      
      // count the number of occurrences of each state in the cell
      for (let k = 0; k < grid[i][j].length; k++) {
        stateCounts[grid[i][j][k]]++;
      }

      // calculate the probability of each state
      const totalStates = Object.values(stateCounts).reduce((sum, count) => sum + count, 0);
      const stateProbabilities = Object.values(stateCounts).map(count => count / totalStates);

      // calculate the Shannon Entropy of the cell
      let cellEntropy = 0;
      for (const p of stateProbabilities) {
        if (p > 0) {
          cellEntropy -= p * Math.log2(p);
        }
      }
      entropy[i][j] = cellEntropy;
    }
  }
  let coordinate;
  coordinate = sortEntropyArray(entropy)[0]
  return coordinate;
}

// function shannonEntropy(grid: Grid): Coordinate {
//   const entropy = [...Array(grid.length)].map(e => Array(grid.length));
//   for (let i = 0; i < grid.length; i++) {
//     for (let j = 0; j < grid.length; j++) {
//       const stateCounts: TerrainStates = { W: 0, L: 0, S: 0 }
//       for (const cell of grid[i][j]) {
//         stateCounts[cell]++;
//       }
//       // const neighbors = getNeighbors(grid, { x: j, y: i });
//       // for (const neighbor of neighbors) {
//       //   for (const cell of grid[neighbor.y][neighbor.x]) {
//       //     stateCounts[cell]++;
//       //   }
//       // }
//       // Calc Shanon Entropy
//       const shannonEntropyF = (val: number[]) => 
//         val.map(v => -v * Math.log2(v)).reduce((x, y) => x + y, 0);
      
//       const entropyValue = shannonEntropyF(Object.values(stateCounts))
//       // console.log(stateCounts)
//       // console.log(`Cell: x:${j} y:${i} Entropy: ${entropyValue}`)
//       entropy[i][j] = entropyValue
//     }
//   }
//   let coordinate;
//   let i = -1;
//   coordinate = sortEntropyArray(entropy)[i]
//   pickedCell.push(coordinate)
//   return coordinate;
// }

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
  // data = data.filter((e) => e.value ===);
  data = (data.filter(e => e.value != 0));
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