class CompatibilityService {
    private data: Set<Compatibility>;

    constructor(data: Set<Compatibility>) {
        this.data = data;
    }

    check(tile1: Tile, tile2: Tile, direction: Direction) : boolean {
        return this.data.has([tile1, tile2, direction] as Compatibility);
    }
}
