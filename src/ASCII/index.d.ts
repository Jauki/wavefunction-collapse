type Tile = string;
type Coordinates = [number, number];

type UP = [1, 0];
type DOWN= [-1, 0];
type LEFT= [0, -1];
type RIGHT= [0, 1];

type Direction = UP | DOWN | LEFT | RIGHT;

type Compatibility = [Tile, Tile, Direction];
type Weights = {
    [Key in Tile]: number
};

type Coefficients = Set<Tile>;
type CoefficientMatrix = [[Coefficents]]
