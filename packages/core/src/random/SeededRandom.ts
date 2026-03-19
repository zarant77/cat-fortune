export class SeededRandom {
  private state: number;

  public constructor(seed: number) {
    this.state = seed >>> 0;
  }

  public nextUint32(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const result = (t ^ (t >>> 14)) >>> 0;
    this.state = result;
    return result;
  }

  public nextInt(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error(`Invalid maxExclusive: ${maxExclusive}`);
    }

    return this.nextUint32() % maxExclusive;
  }

  public getState(): number {
    return this.state >>> 0;
  }
}
