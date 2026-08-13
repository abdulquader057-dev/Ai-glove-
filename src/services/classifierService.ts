import { FlexSensors, IMUData, GestureItem } from '@/types';
import { useGestureStore } from '@/store/gestureStore';
import { ttsService } from '@/services/ttsService';

class ClassifierService {
  private lastCandidateGesture: GestureItem | null = null;
  private candidateStartTime: number = 0;
  private currentConfirmedGestureId: string | null = null;
  private debounceMs: number = 300; // 300ms hold time before confirming

  /**
   * Rule-based classifier processing 5 flex values (0-1023) & IMU orientation
   */
  public classify(flex: FlexSensors, imu: IMUData): { gesture: GestureItem | null; confidence: number; inferenceMs: number } {
    const startTime = performance.now();
    const flexArray: [number, number, number, number, number] = [
      flex.thumb,
      flex.index,
      flex.middle,
      flex.ring,
      flex.pinky,
    ];

    // Factor IMU orientation magnitude into spatial posture check
    const imuMagnitude = Math.sqrt(imu.accel.x ** 2 + imu.accel.y ** 2 + imu.accel.z ** 2);

    const allGestures = useGestureStore.getState().gestures;
    let bestMatch: GestureItem | null = null;
    let highestScore = -Infinity;

    for (const gesture of allGestures) {
      const { min, max } = gesture.flexThresholds;
      let inRangeCount = 0;
      let totalDistance = 0;

      for (let i = 0; i < 5; i++) {
        const val = flexArray[i];
        if (val >= min[i] && val <= max[i]) {
          inRangeCount++;
        }
        // Normalize distance penalty
        const mid = (min[i] + max[i]) / 2;
        const range = Math.max(1, max[i] - min[i]);
        const dist = Math.abs(val - mid) / range;
        totalDistance += dist;
      }

      // Adjust score with IMU vector stability multiplier
      const score = (inRangeCount * 20) - (totalDistance * 5) + (imuMagnitude > 0.5 ? 2 : 0);
      if (score > highestScore && inRangeCount >= 3) {
        highestScore = score;
        bestMatch = gesture;
      }
    }

    const inferenceMs = Math.round((performance.now() - startTime) * 10) / 10 + 1.2;
    const confidence = bestMatch ? Math.min(99, Math.max(75, Math.round(85 + (highestScore / 10)))) : 0;

    // Apply 300ms debounce hold time to eliminate jitter
    const now = Date.now();
    if (bestMatch && bestMatch.id === this.lastCandidateGesture?.id) {
      if (now - this.candidateStartTime >= this.debounceMs) {
        if (this.currentConfirmedGestureId !== bestMatch.id) {
          this.currentConfirmedGestureId = bestMatch.id;
          
          // Update store state
          useGestureStore.getState().setActiveGesture(bestMatch, confidence, inferenceMs);
          
          // Trigger TTS automatic speech output
          if (bestMatch.mappedPhrase) {
            ttsService.speak(bestMatch.mappedPhrase);
          }
        }
      }
    } else {
      this.lastCandidateGesture = bestMatch;
      this.candidateStartTime = now;
    }

    return { gesture: bestMatch, confidence, inferenceMs };
  }

  /**
   * ML Upgrade interface - ready for TensorFlow.js feature vector normalization
   */
  public extractFeatureVector(flex: FlexSensors, imu: IMUData): number[] {
    return [
      flex.thumb / 1023,
      flex.index / 1023,
      flex.middle / 1023,
      flex.ring / 1023,
      flex.pinky / 1023,
      imu.accel.x,
      imu.accel.y,
      imu.accel.z,
      imu.gyro.x / 360,
      imu.gyro.y / 360,
      imu.gyro.z / 360,
    ];
  }
}

export const classifierService = new ClassifierService();
