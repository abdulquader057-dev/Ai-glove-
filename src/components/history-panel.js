import { $, on, clearChildren, createElement, toggleClass } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import { formatTimestamp, formatPercentage } from '../utils/format.js';
import { historyService } from '../services/history.service.js';

export function renderHistoryPanel({ collapsible = true } = {}) {
  return `
    <div class="panel history-panel">
      <div class="card-header flex items-center gap-2" ${collapsible ? 'id="history-header" style="cursor:pointer;"' : ''}>
        <i data-lucide="history" class="text-primary"></i> GESTURE HISTORY
        <span id="history-count-badge" class="badge badge-cyan ml-auto">0</span>
      </div>
      <div id="history-content" class="card-body">
        <div class="table-container">
          <table class="history-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Gesture</th>
                <th>Confidence</th>
                <th>Duration</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody id="history-tbody">
              <tr class="empty-row"><td colspan="5">No gestures recorded yet</td></tr>
            </tbody>
          </table>
        </div>
        <div class="history-actions">
          <button id="btn-history-clear" class="btn btn-danger btn-sm">CLEAR HISTORY</button>
          <button id="btn-history-export-csv" class="btn btn-secondary btn-sm">EXPORT CSV</button>
          <button id="btn-history-export-json" class="btn btn-secondary btn-sm">EXPORT JSON</button>
        </div>
      </div>
    </div>
  `;
}

export function initHistoryPanel() {
  const tbody = $('#history-tbody');
  const countBadge = $('#history-count-badge');
  const clearBtn = $('#btn-history-clear');
  const exportCsvBtn = $('#btn-history-export-csv');
  const exportJsonBtn = $('#btn-history-export-json');
  const header = $('#history-header');
  const content = $('#history-content');

  const renderRows = () => {
    const history = historyService.getHistory();
    countBadge.textContent = history.length;
    clearChildren(tbody);
    
    if (history.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No gestures recorded yet</td></tr>';
      return;
    }
    
    history.forEach(entry => {
      const tr = createElement('tr');
      tr.innerHTML = `
        <td>${formatTimestamp(entry.timestamp)}</td>
        <td>${entry.gesture}</td>
        <td>${formatPercentage(entry.confidence)}</td>
        <td>${entry.duration}ms</td>
        <td>${entry.source}</td>
      `;
      tbody.appendChild(tr);
    });
  };

  eventBus.on('history-update', renderRows);
  
  if (header && content) {
    on(header, 'click', () => {
      toggleClass(content, 'hidden');
    });
  }

  on(clearBtn, 'click', () => {
    if (window.confirm('Are you sure you want to clear the history?')) {
      historyService.clearHistory();
    }
  });

  on(exportCsvBtn, 'click', () => historyService.exportCSV());
  on(exportJsonBtn, 'click', () => historyService.exportJSON());

  renderRows();
}

export function addHistoryRow(entry) {
  const tbody = $('#history-tbody');
  const countBadge = $('#history-count-badge');
  
  if (tbody) {
    const emptyRow = tbody.querySelector('.empty-row');
    if (emptyRow) emptyRow.remove();
    
    const tr = createElement('tr');
    tr.innerHTML = `
      <td>${formatTimestamp(entry.timestamp)}</td>
      <td>${entry.gesture}</td>
      <td>${formatPercentage(entry.confidence)}</td>
      <td>${entry.duration}ms</td>
      <td>${entry.source}</td>
    `;
    tbody.insertBefore(tr, tbody.firstChild);
    
    if (countBadge) {
      const current = parseInt(countBadge.textContent, 10) || 0;
      countBadge.textContent = current + 1;
    }
  }
}
