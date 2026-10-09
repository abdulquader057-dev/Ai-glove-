// Moving-Average Smoothing Filter (5 samples FIFO window)
// Team Syntropy - SIGNOVA

import { SENSOR_COUNT } from '../config.js';

export class MovingAverageFilter {
  private windowSize: number;
  private buffers: number[][];

  constructor(windowSize: number = 5, channelCount: number = SENSOR_COUNT) {
    this.windowSize = windowSize;
    this.buffers = Array.from({ length: channelCount }, () => []);
  }

  /**
   * Reset filter buffers
   */
  public reset(): void {
    for (let i = 0; i < this.buffers.length; i++) {
      this.buffers[i] = [];
    }
  }

  /**
   * Push raw values and return smoothed values
   * @param rawValues - Array of raw ADC numbers for each channel
   * @returns Array of smoothed values
   */
  public filter(rawValues: number[]): number[] {
    const smoothed: number[] = [];

    for (let i = 0; i < rawValues.length; i++) {
      if (!this.buffers[i]) {
        this.buffers[i] = [];
      }

      this.buffers[i].push(rawValues[i]);

      if (this.buffers[i].length > this.windowSize) {
        this.buffers[i].shift();
      }

      const sum = this.buffers[i].reduce((acc, val) => acc + val, 0);
      const avg = Math.round((sum / this.buffers[i].length) * 10) / 10;
      smoothed.push(avg);
    }

    return smoothed;
  }
}

export const filterService = new MovingAverageFilter(5, SENSOR_COUNT);
export default filterService;
