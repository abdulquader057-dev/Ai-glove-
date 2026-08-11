export function renderSpecTable(specs) {
  if (!specs || specs.length === 0) return '';
  
  let rowsHtml = '';
  specs.forEach(spec => {
    let badgeHtml = '';
    if (spec.status === 'confirmed') {
      badgeHtml = '<span class="badge badge-green">Confirmed</span>';
    } else if (spec.status === 'tbd') {
      badgeHtml = '<span class="badge badge-amber">TBD</span>';
    } else if (spec.status) {
      badgeHtml = '<span class="badge badge-cyan">' + spec.status + '</span>';
    }
    
    rowsHtml += `
      <div class="spec-row" style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div style="font-weight:bold; flex:1;">${spec.label || spec.name || ''}</div>
        <div style="flex:2; text-align:right;">${spec.value} ${badgeHtml}</div>
      </div>
    `;
  });

  return `
    <div class="panel spec-table" style="padding:20px;">
      ${rowsHtml}
    </div>
  `;
}
