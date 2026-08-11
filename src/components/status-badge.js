export function renderStatusBadge(status, label = '') {
  let badgeClass = 'badge-violet';
  let defaultLabel = 'TBD';
  
  const st = status.toLowerCase();
  
  if (st === 'connected' || st === 'active') {
    badgeClass = 'badge-green';
    defaultLabel = st === 'connected' ? 'Connected' : 'Active';
  } else if (st === 'disconnected' || st === 'inactive' || st === 'error') {
    badgeClass = 'badge-red';
    defaultLabel = st.charAt(0).toUpperCase() + st.slice(1);
  } else if (st === 'pending' || st === 'configuring') {
    badgeClass = 'badge-amber';
    defaultLabel = st.charAt(0).toUpperCase() + st.slice(1);
  } else if (st === 'simulation' || st === 'ready') {
    badgeClass = 'badge-cyan';
    defaultLabel = st.charAt(0).toUpperCase() + st.slice(1);
  } else if (st === 'not_configured') {
    badgeClass = 'badge-violet';
    defaultLabel = 'Not Configured';
  }
  
  const displayLabel = label || defaultLabel;
  
  return `
    <div class="badge ${badgeClass}">
      ${renderStatusDot(st)}
      <span>${displayLabel}</span>
    </div>
  `;
}

export function renderStatusDot(status) {
  const st = status.toLowerCase();
  let pulseClass = '';
  
  if (st === 'connected' || st === 'active') {
    pulseClass = 'animate-pulse-glow';
  }
  
  return `<span class="status-dot ${pulseClass}"></span>`;
}
