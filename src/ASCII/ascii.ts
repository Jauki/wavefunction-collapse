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


async function pickRandomUnpickedCell(grid: Grid) {
  const coordiante = shannonEntropy(grid)
  if (coordiante === undefined) {
    printGrid(grid)
    console.log("Done!")
    return;
  }
  const selected = grid[coordiante.y][coordiante.x];
  
  const terrain = selected[Math.floor(Math.random() * selected.length)];
  grid[coordiante.y][coordiante.x] = Array.of(terrain);
  grid = propagateGrid(coordiante as Coordinate, grid,);
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

function isFinalState(cell: Terrain[]): boolean {
  return cell.length === 1;
}

function setProbabilities(currentCell: Terrain[], neighbor: Terrain[]): Terrain[] {
  if (isFinalState(neighbor)) {
    return Array.of(neighbor[0]);
  }

  const isWater = currentCell.includes(Terrain.Water);
  const isSand = currentCell.includes(Terrain.Sand);
  const isLand = currentCell.includes(Terrain.Land);

  if (isWater) {
    return neighbor.includes(Terrain.Water) || neighbor.includes(Terrain.Sand)
      ? [Terrain.Water, Terrain.Sand]
      : [Terrain.Sand];
  } else if (isSand) {
    return [Terrain.Water, Terrain.Land, Terrain.Sand];
  } else if (isLand) {
    return neighbor.includes(Terrain.Land) || neighbor.includes(Terrain.Sand)
      ? [Terrain.Land, Terrain.Sand]
      : [Terrain.Sand];
  } else {
    return [];
  }
}
function propagateGrid(coordiante: Coordinate, grid: Grid) {
      const currentCell = grid[coordiante.y][coordiante.x]
      const neighbors = getNeighbors(grid, coordiante);
        for (const neighbor of neighbors) {
          grid[neighbor.y][neighbor.x] = setProbabilities(currentCell, grid[neighbor.y][neighbor.x])
        }
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

function sortEntropyArray(array: number[][]): Coordinate[] {
  let data: { value: number, coordinate: Coordinate }[] = [];
  for (let y = 0; y < array.length; y++) {
    for (let x = 0; x < array[y].length; x++) {
      data.push({ value: array[y][x], coordinate: { x, y } });
    }
  }

  data.sort((a, b) => a.value - b.value);
  data = (data.filter(e => e.value != 0));
  // Create a new array of sorted coordinates
  const sortedCoords: Coordinate[] = [];
  for (let i = 0; i < data.length; i++) {
    sortedCoords.push(data[i].coordinate);
  }
  return sortedCoords;
}

// Todo: add probabilites to the function
export function main(size: number) {
  const grid = generateInitGrid(size);
  console.log('Initial grid:');
  printGrid(grid)
  pickRandomUnpickedCell(grid);
}