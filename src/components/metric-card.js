import { formatPercentage } from '../utils/format.js';

export function renderMetricCard({ label, value, status, icon }) {
  const displayValue = value !== null ? formatPercentage(value) : 'Awaiting evaluation';
  const valueClass = value !== null ? 'value-large' : 'value-muted';
  const badgeClass = value !== null ? 'badge-green' : 'badge-amber';
  const statusText = value !== null ? status : 'Pending';

  return `
    <div class="panel metric-card text-center">
      <div class="metric-icon" style="font-size:2rem; margin-bottom:10px;">${icon}</div>
      <div class="metric-label" style="font-weight:bold; margin-bottom:5px;">${label}</div>
      <div class="${valueClass}" style="font-size:1.5rem; margin-bottom:10px;">${displayValue}</div>
      <div class="badge ${badgeClass}">${statusText}</div>
    </div>
  `;
}

export function renderMetricsGrid(metrics) {
  const m = metrics || {};
  return `
    <div class="grid-2">
      ${renderMetricCard({ label: 'Accuracy', value: m.accuracy?.value ?? null, status: m.accuracy?.status || 'Pending', icon: '🎯' })}
      ${renderMetricCard({ label: 'Precision', value: m.precision?.value ?? null, status: m.precision?.status || 'Pending', icon: '✨' })}
      ${renderMetricCard({ label: 'Recall', value: m.recall?.value ?? null, status: m.recall?.status || 'Pending', icon: '🔍' })}
      ${renderMetricCard({ label: 'F1 Score', value: m.f1Score?.value ?? null, status: m.f1Score?.status || 'Pending', icon: '📊' })}
    </div>
  `;
}

export function renderConfusionMatrix(matrix, labels) {
  if (!matrix || !labels) {
    return `<div class="text-muted text-center p-4">Confusion matrix will be available after model evaluation</div>`;
  }
  
  let html = '<div class="table-container"><table class="history-table" style="text-align:center;"><thead><tr><th></th>';
  labels.forEach(l => html += `<th>${l}</th>`);
  html += '</tr></thead><tbody>';
  
  matrix.forEach((row, i) => {
    html += `<tr><th style="text-align:left;">${labels[i]}</th>`;
    row.forEach(val => {
      const opacity = val / Math.max(...row.map(v => Math.max(1, v)));
      html += `<td style="background: rgba(var(--primary-rgb, 59, 130, 246), ${opacity})">${val}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table></div>';
  return html;
}
