// Gesture Telemetry History Log
// Team Syntropy - SIGNOVA
// Displays chronologically recorded gestures with exact timestamps,
// binary patterns, confidences, latencies, and CSV/JSON disk export.

'use client';

import React from 'react';
import { Download, Trash2, Database } from 'lucide-react';
import { TelemetryPacket } from '../../config/signova.config';

interface HistoryTableProps {
  history: TelemetryPacket[];
  onClear: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  history,
  onClear,
  onExportCSV,
  onExportJSON,
}) => {
  return (
    <div className="w-full bg-[#0A0D10] border border-[#1F242A] p-4 rounded-sm flex flex-col gap-3 font-mono">
      {/* Header with Export Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1F242A] text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-[#2EE6A6]" />
          <span className="text-[#9CA3AF] font-bold">
            GESTURE TELEMETRY LOG ({history.length} ENTRIES)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-[#14181D] hover:bg-[#1D232A] disabled:opacity-40 border border-[#1F242A] text-white rounded-xs transition-colors"
            title="Download CSV to laptop disk"
          >
            <Download className="w-3 h-3 text-[#2EE6A6]" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={onExportJSON}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-[#14181D] hover:bg-[#1D232A] disabled:opacity-40 border border-[#1F242A] text-white rounded-xs transition-colors"
            title="Download raw JSON session data"
          >
            <Download className="w-3 h-3 text-[#2EE6A6]" />
            <span>EXPORT JSON</span>
          </button>

          <button
            onClick={onClear}
            disabled={history.length === 0}
            className="p-1 text-[#6B7280] hover:text-red-400 disabled:opacity-40 transition-colors"
            title="Clear history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Storage Location Explanatory Badge */}
      <div className="text-[10px] text-[#6B7280] bg-[#0E1216] px-3 py-1.5 rounded-xs border border-[#181E24]">
        STORAGE: Real-time packets buffered locally in Browser Storage (localStorage). Click Export to save timestamped logs to your laptop disk.
      </div>

      {/* Scrollable Table */}
      <div className="w-full max-h-56 overflow-y-auto border border-[#161B22] rounded-xs">
        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#4B5563]">
            No confirmed gestures recorded yet. Hold a pose for 400ms to log.
          </div>
        ) : (
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#0E1216] border-b border-[#1F242A] text-[#6B7280]">
                <th className="py-2 px-3">TIMESTAMP</th>
                <th className="py-2 px-3">GESTURE</th>
                <th className="py-2 px-3">PATTERN</th>
                <th className="py-2 px-3">CONFIDENCE</th>
                <th className="py-2 px-3">LATENCY</th>
                <th className="py-2 px-3">SOURCE</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`border-b border-[#14181D] hover:bg-[#12161C] transition-colors ${
                    idx === 0 ? 'bg-[#0E1B15]/40 text-white' : 'text-[#D1D5DB]'
                  }`}
                >
                  <td className="py-2 px-3 text-[#9CA3AF]">{item.timeString}</td>
                  <td className="py-2 px-3 font-bold text-[#2EE6A6]">{item.label}</td>
                  <td className="py-2 px-3 font-mono text-[#9CA3AF]">{`{${item.binaryBits.join(', ')}}`}</td>
                  <td className="py-2 px-3">{item.confidence}%</td>
                  <td className="py-2 px-3 text-[#38BDF8]">{item.latencyMs} ms</td>
                  <td className="py-2 px-3 text-[10px] text-[#6B7280]">
                    {item.source === 'random_forest' ? 'RF_M2C' : 'THRESHOLD'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryTable;
