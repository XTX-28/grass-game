export class SpatialGrid {
  private cellSize: number;
  private cols: number;
  private rows: number;
  private cells: Int32Array[];
  private cellCounts: Int32Array;
  private maxPerCell: number;

  constructor(width: number, height: number, cellSize: number, maxItems: number) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.maxPerCell = Math.ceil((maxItems * 2) / (this.cols * this.rows));

    const totalCells = this.cols * this.rows;
    this.cells = new Array(totalCells);
    this.cellCounts = new Int32Array(totalCells);

    for (let i = 0; i < totalCells; i++) {
      this.cells[i] = new Int32Array(this.maxPerCell);
    }
  }

  clear(): void {
    this.cellCounts.fill(0);
  }

  insert(index: number, x: number, z: number): void {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(z / this.cellSize);
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
    const cellIdx = row * this.cols + col;
    const count = this.cellCounts[cellIdx];
    if (count < this.maxPerCell) {
      this.cells[cellIdx][count] = index;
      this.cellCounts[cellIdx] = count + 1;
    }
  }

  query(x: number, z: number, radius: number, result: number[]): void {
    result.length = 0;
    const minCol = Math.max(0, Math.floor((x - radius) / this.cellSize));
    const maxCol = Math.min(this.cols - 1, Math.floor((x + radius) / this.cellSize));
    const minRow = Math.max(0, Math.floor((z - radius) / this.cellSize));
    const maxRow = Math.min(this.rows - 1, Math.floor((z + radius) / this.cellSize));

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const cellIdx = row * this.cols + col;
        const count = this.cellCounts[cellIdx];
        const cell = this.cells[cellIdx];
        for (let i = 0; i < count; i++) {
          result.push(cell[i]);
        }
      }
    }
  }
}
