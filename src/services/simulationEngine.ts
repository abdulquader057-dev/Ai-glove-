import { useHardwareStore } from '@/store/hardwareStore';
import { classifierService } from '@/services/classifierService';
import { FlexSensors, IMUData } from '@/types';

class SimulationEngine {
  private timer: NodeJS.Timeout | null = null;
  private currentPatternIndex: number = 0;
  private stepCount: number = 0;

  // Realistic gesture sensor profiles for simulated playback
  private patterns: Array<{ name: string; flex: [number, number, number, number, number]; accel: [number, number, number] }> = [
    { name: 'OPEN PALM', flex: [120, 150, 130, 140, 110], accel: [0.02, 0.98, 0.15] },
    { name: 'CLOSED FIST', flex: [880, 910, 890, 860, 820], accel: [0.10, 0.90, -0.20] },
    { name: 'THUMBS UP', flex: [150, 890, 910, 880, 840], accel: [0.05, 0.85, 0.40] },
    { name: 'PEACE SIGN', flex: [850, 160, 140, 890, 860], accel: [-0.10, 0.95, 0.10] },
    { name: 'POINT UP', flex: [820, 150, 890, 870, 840], accel: [0.00, 0.99, 0.05] },
    { name: 'ROCK ON', flex: [840, 140, 890, 870, 130], accel: [0.12, 0.92, -0.10] },
    { name: 'OK SIGN', flex: [520, 510, 130, 140, 120], accel: [0.08, 0.94, 0.18] },
    { name: 'HIGH FIVE', flex: [90, 95, 100, 85, 90], accel: [0.01, 0.97, 0.20] },
  ];

  public start() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      const hardwareStore = useHardwareStore.getState();
      if (!hardwareStore.isSimulation) {
        this.stop();
        return;
      }

      this.stepCount++;
      // Switch gesture pattern every 70 ticks (~3.5 seconds)
      if (this.stepCount % 70 === 0) {
        this.currentPatternIndex = (this.currentPatternIndex + 1) % this.patterns.length;
      }

      const pattern = this.patterns[this.currentPatternIndex];

      // Add realistic continuous sensor jitter/noise (±15 range)
      const flex: FlexSensors = {
        thumb: Math.max(0, Math.min(1023, Math.round(pattern.flex[0] + (Math.random() * 24 - 12)))),
        index: Math.max(0, Math.min(1023, Math.round(pattern.flex[1] + (Math.random() * 24 - 12)))),
        middle: Math.max(0, Math.min(1023, Math.round(pattern.flex[2] + (Math.random() * 24 - 12)))),
        ring: Math.max(0, Math.min(1023, Math.round(pattern.flex[3] + (Math.random() * 24 - 12)))),
        pinky: Math.max(0, Math.min(1023, Math.round(pattern.flex[4] + (Math.random() * 24 - 12)))),
      };

      const imu: IMUData = {
        accel: {
          x: Math.round((pattern.accel[0] + (Math.random() * 0.04 - 0.02)) * 100) / 100,
          y: Math.round((pattern.accel[1] + (Math.random() * 0.04 - 0.02)) * 100) / 100,
          z: Math.round((pattern.accel[2] + (Math.random() * 0.04 - 0.02)) * 100) / 100,
        },
        gyro: {
          x: Math.round((Math.random() * 2 - 1) * 10) / 10,
          y: Math.round((Math.random() * 2 - 1) * 10) / 10,
          z: Math.round((Math.random() * 2 - 1) * 10) / 10,
        },
      };

      hardwareStore.updateSensors(flex, imu);

      // Generate realistic BLE Hex packet for terminal stream
      const hexArr = [
        '0x02',
        '0x' + flex.thumb.toString(16).padStart(4, '0').toUpperCase(),
        '0x' + flex.index.toString(16).padStart(4, '0').toUpperCase(),
        '0x' + flex.middle.toString(16).padStart(4, '0').toUpperCase(),
        '0x' + flex.ring.toString(16).padStart(4, '0').toUpperCase(),
        '0x' + flex.pinky.toString(16).padStart(4, '0').toUpperCase(),
      ];
      hardwareStore.addLog(`[SIM TELEMETRY] ${hexArr.join(' ')}`, 'data');

      // Classify gesture live
      classifierService.classify(flex, imu);
    }, 50); // 20Hz update rate
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const simulationEngine = new SimulationEngine();
