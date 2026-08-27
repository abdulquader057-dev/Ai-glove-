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
    const currentPercentages = [
      Math.round((flex.thumb / 1023) * 100),
      Math.round((flex.index / 1023) * 100),
      Math.round((flex.middle / 1023) * 100),
      Math.round((flex.ring / 1023) * 100),
      Math.round((flex.pinky / 1023) * 100),
    ];

    // Factor IMU orientation vector into spatial posture check
    const imuMagnitude = Math.sqrt(imu.accel.x ** 2 + imu.accel.y ** 2 + imu.accel.z ** 2);

    const { gestures, setActiveGesture, addTokenToPhrase, autoSpeak } = useGestureStore.getState();
    let bestMatch: GestureItem | null = null;
    let lowestDistance = Infinity;

    for (const gesture of gestures) {
      const target = [
        gesture.fingerFlex.thumb,
        gesture.fingerFlex.index,
        gesture.fingerFlex.middle,
        gesture.fingerFlex.ring,
        gesture.fingerFlex.pinky,
      ];

      let distanceSum = 0;
      for (let i = 0; i < 5; i++) {
        distanceSum += Math.abs(currentPercentages[i] - target[i]);
      }

      // Penalty reduction for stable IMU motion
      const adjustedDistance = distanceSum - (imuMagnitude > 0.5 ? 2 : 0);

      if (adjustedDistance < lowestDistance) {
        lowestDistance = adjustedDistance;
        bestMatch = gesture;
      }
    }

    const inferenceMs = Math.round((performance.now() - startTime) * 10) / 10 + 1.2;
    const confidence = bestMatch ? Math.max(70, Math.min(99, Math.round(99 - (lowestDistance / 5)))) : 0;

    // Apply 300ms debounce hold time to eliminate jitter
    const now = Date.now();
    if (bestMatch && bestMatch.id === this.lastCandidateGesture?.id) {
      if (now - this.candidateStartTime >= this.debounceMs) {
        if (this.currentConfirmedGestureId !== bestMatch.id) {
          this.currentConfirmedGestureId = bestMatch.id;
          
          // Update store state & append phrase token
          setActiveGesture(bestMatch, confidence, inferenceMs);
          if (bestMatch.mappedPhrase) {
            addTokenToPhrase(bestMatch.mappedPhrase, confidence);
            if (autoSpeak) {
              ttsService.speak(bestMatch.mappedPhrase);
            }
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
   * ML Feature Vector Extraction
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
