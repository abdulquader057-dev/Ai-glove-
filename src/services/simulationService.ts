// Simulation Service for SIGNOVA
// Team Syntropy
// Provides keyboard shortcuts (Keys 1-8) and continuous 50Hz sample data replay.
// Injects data directly into the Web Serial line parser so the real pipeline processes it identically.

import { CONFIG } from '../config.js';
import { serialService } from './serialService';

// Typical ADC ranges: Straight ~250, Bent ~780
const STRAIGHT_ADC = 250;
const BENT_ADC = 780;

// 8 gesture profiles (index, middle, ring)
// Exactly matching user dictionary:
// 1. All 3 Straight: {0, 0, 0} -> HELLO
// 2. All 3 Bent: {1, 1, 1} -> YES
// 3. Index Straight, Middle & Ring Bent: {0, 1, 1} -> ONE
// 4. Index & Middle Straight, Ring Bent: {0, 0, 1} -> VICTORY
// 5. Middle & Ring Straight, Index Bent: {1, 0, 0} -> OK
// 6. Ring Straight, Index & Middle Bent: {1, 1, 0} -> THREE
// 7. Middle Straight, Index & Ring Bent: {1, 0, 1} -> NO
// 8. Index & Ring Straight, Middle Bent: {0, 1, 0} -> ROCK
export const GESTURE_SIMULATION_PRESETS: Record<string, { key: string; name: string; pattern: [number, number, number]; flex: [number, number, number] }> = {
  '1': { key: '1', name: 'HELLO', pattern: [0, 0, 0], flex: [STRAIGHT_ADC, STRAIGHT_ADC, STRAIGHT_ADC] },
  '2': { key: '2', name: 'YES', pattern: [1, 1, 1], flex: [BENT_ADC, BENT_ADC, BENT_ADC] },
  '3': { key: '3', name: 'ONE', pattern: [0, 1, 1], flex: [STRAIGHT_ADC, BENT_ADC, BENT_ADC] },
  '4': { key: '4', name: 'VICTORY', pattern: [0, 0, 1], flex: [STRAIGHT_ADC, STRAIGHT_ADC, BENT_ADC] },
  '5': { key: '5', name: 'OK', pattern: [1, 0, 0], flex: [BENT_ADC, STRAIGHT_ADC, STRAIGHT_ADC] },
  '6': { key: '6', name: 'THREE', pattern: [1, 1, 0], flex: [BENT_ADC, BENT_ADC, STRAIGHT_ADC] },
  '7': { key: '7', name: 'NO', pattern: [1, 0, 1], flex: [BENT_ADC, STRAIGHT_ADC, BENT_ADC] },
  '8': { key: '8', name: 'ROCK', pattern: [0, 1, 0], flex: [STRAIGHT_ADC, BENT_ADC, STRAIGHT_ADC] },
};

class SimulationService {
  private isSimulating: boolean = false;
  private isReplayingTrace: boolean = false;
  private replayTimer: ReturnType<typeof setInterval> | null = null;
  private activeTargetFlex: [number, number, number] = [STRAIGHT_ADC, STRAIGHT_ADC, STRAIGHT_ADC];
  private currentInterpolatedFlex: [number, number, number] = [STRAIGHT_ADC, STRAIGHT_ADC, STRAIGHT_ADC];
  private keyListenerActive: boolean = false;
  private stateListeners: Set<(isSimulating: boolean, isReplaying: boolean) => void> = new Set();

  // Recorded sample sequence for continuous replay (gesture -> hold ~3s -> transition)
  private replaySequence: Array<{ name: string; flex: [number, number, number]; durationMs: number }> = [
    { name: 'HELLO', flex: [STRAIGHT_ADC, STRAIGHT_ADC, STRAIGHT_ADC], durationMs: 2500 },
    { name: 'YES', flex: [BENT_ADC, BENT_ADC, BENT_ADC], durationMs: 2500 },
    { name: 'ONE', flex: [STRAIGHT_ADC, BENT_ADC, BENT_ADC], durationMs: 2500 },
    { name: 'VICTORY', flex: [STRAIGHT_ADC, STRAIGHT_ADC, BENT_ADC], durationMs: 2500 },
    { name: 'OK', flex: [BENT_ADC, STRAIGHT_ADC, STRAIGHT_ADC], durationMs: 2500 },
    { name: 'THREE', flex: [BENT_ADC, BENT_ADC, STRAIGHT_ADC], durationMs: 2500 },
    { name: 'NO', flex: [BENT_ADC, STRAIGHT_ADC, BENT_ADC], durationMs: 2500 },
    { name: 'ROCK', flex: [STRAIGHT_ADC, BENT_ADC, STRAIGHT_ADC], durationMs: 2500 },
  ];
  private replaySequenceIndex: number = 0;
  private replayStepCount: number = 0;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  public initKeyboardListeners(): void {
    if (typeof window === 'undefined' || this.keyListenerActive) return;
    window.addEventListener('keydown', this.handleKeyDown);
    this.keyListenerActive = true;
  }

  public removeKeyboardListeners(): void {
    if (typeof window === 'undefined' || !this.keyListenerActive) return;
    window.removeEventListener('keydown', this.handleKeyDown);
    this.keyListenerActive = false;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Ignore input if user is typing in a form or input element
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
      return;
    }

    if (GESTURE_SIMULATION_PRESETS[e.key]) {
      this.triggerPreset(e.key);
    }
  }

  /**
   * Set target gesture directly via preset key ('1' to '8')
   */
  public triggerPreset(presetKey: string): void {
    const preset = GESTURE_SIMULATION_PRESETS[presetKey];
    if (!preset) return;

    if (!this.isSimulating) {
      this.startSimulation();
    }

    this.activeTargetFlex = [...preset.flex];
  }

  /**
   * Set target gesture by 0-based index (0 to 7)
   */
  public triggerGestureByIndex(index: number): void {
    const key = String(index + 1);
    this.triggerPreset(key);
  }

  public startSimulation(): void {
    if (this.isSimulating) return;
    this.isSimulating = true;
    this.initKeyboardListeners();
    this.startStreamLoop();
    this.notifyState();
  }

  public stopSimulation(): void {
    this.isSimulating = false;
    this.stopReplayTrace();
    this.notifyState();
  }

  public toggleReplayTrace(): boolean {
    if (!this.isSimulating) {
      this.startSimulation();
    }

    if (this.isReplayingTrace) {
      this.stopReplayTrace();
    } else {
      this.startReplayTrace();
    }
    this.notifyState();
    return this.isReplayingTrace;
  }

  private startReplayTrace(): void {
    this.isReplayingTrace = true;
    this.replaySequenceIndex = 0;
    this.replayStepCount = 0;
  }

  private stopReplayTrace(): void {
    this.isReplayingTrace = false;
  }

  /**
   * 50Hz continuous simulation ticker (20ms interval)
   */
  private startStreamLoop(): void {
    if (this.replayTimer) clearInterval(this.replayTimer);

    this.replayTimer = setInterval(() => {
      if (!this.isSimulating) {
        if (this.replayTimer) {
          clearInterval(this.replayTimer);
          this.replayTimer = null;
        }
        return;
      }

      // If recorded trace replay is active, cycle through sequence
      if (this.isReplayingTrace) {
        this.replayStepCount++;
        // 50 ticks = 1 second. Each pattern is ~2.5s (125 ticks)
        if (this.replayStepCount % 125 === 0) {
          this.replaySequenceIndex = (this.replaySequenceIndex + 1) % this.replaySequence.length;
          this.activeTargetFlex = [...this.replaySequence[this.replaySequenceIndex].flex];
        }
      }

      // Smooth interpolation towards target + realistic hardware ADC jitter (±6 units)
      for (let i = 0; i < 3; i++) {
        const diff = this.activeTargetFlex[i] - this.currentInterpolatedFlex[i];
        // 20% interpolation per frame gives realistic biomechanical finger flexion speed (~150ms transition)
        this.currentInterpolatedFlex[i] += diff * 0.22;
      }

      const f1 = Math.round(this.currentInterpolatedFlex[0] + (Math.random() * 8 - 4));
      const f2 = Math.round(this.currentInterpolatedFlex[1] + (Math.random() * 8 - 4));
      const f3 = Math.round(this.currentInterpolatedFlex[2] + (Math.random() * 8 - 4));

      // Construct "f1,f2,f3\n" line and feed through serialService
      const simulatedLine = `${f1},${f2},${f3}`;
      const receiveTime = performance.now();
      serialService.parseLine(simulatedLine, receiveTime);
    }, 1000 / CONFIG.STREAM_RATE_HZ);
  }

  public onStateChange(fn: (isSimulating: boolean, isReplaying: boolean) => void): () => void {
    this.stateListeners.add(fn);
    return () => this.stateListeners.delete(fn);
  }

  private notifyState(): void {
    this.stateListeners.forEach(fn => fn(this.isSimulating, this.isReplayingTrace));
  }

  public getStatus() {
    return {
      isSimulating: this.isSimulating,
      isReplaying: this.isReplayingTrace,
    };
  }
}

export const simulationService = new SimulationService();
export default simulationService;
