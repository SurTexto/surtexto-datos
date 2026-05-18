// VIZ 3 — Colombia: violencia LGBTIQ+ 2025
// Requiere D3.js v7: https://cdn.jsdelivr.net/npm/d3@7

(function() {
    const container = document.getElementById('viz-impunidad');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const w = Math.min(container.clientWidth || 600, 560);
    const tmH = isMobile ? 200 : 240;
    const h = tmH + 80;

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`)
      .attr('width', w)
      .style('display', 'block')
      .style('margin', '0 auto')
      .style('font-family', 'Inter, sans-serif');

    svg.append('text').attr('x', w / 2).attr('y', 24)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 14 : 18).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('270 homicidios. ¿Qué pasó con cada caso?');

    const leaves = [
      { name: 'Sin avance judicial',  sub: 'En indagación preliminar', value: 232, pct: '86%', color: '#C41E3A', light: false },
      { name: 'Sin información',       sub: '',                          value: 20,  pct: '7,5%', color: '#DFBFA1', light: true  },
      { name: 'Con avance procesal',   sub: 'Fases posteriores',         value: 18,  pct: '6,5%', color: '#C67132', light: false },
    ];

    const root = d3.hierarchy({ children: leaves })
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([w, tmH])
      .padding(3)
      .round(true)(root);

    const tmY = 38;

    const cell = svg.selectAll('g.cell')
      .data(root.leaves())
      .enter().append('g')
      .attr('class', 'cell')
      .attr('transform', d => `translate(${d.x0},${d.y0 + tmY})`);

    cell.append('rect')
      .attr('width', d => Math.max(0, d.x1 - d.x0))
      .attr('height', d => Math.max(0, d.y1 - d.y0))
      .attr('fill', d => d.data.color)
      .attr('rx', 3);

    cell.each(function(d) {
      const cw = d.x1 - d.x0;
      const ch = d.y1 - d.y0;
      const g = d3.select(this);
      const textFill = d.data.light ? '#7B5137' : 'white';
      const cx = cw / 2;
      const cy = ch / 2;

      if (cw < 20 || ch < 20) return;

      // Número grande
      const numSize = cw > 300 ? (isMobile ? 44 : 56) : (cw > 80 ? 22 : 14);
      g.append('text')
        .attr('x', cx).attr('y', ch > 80 ? cy - 18 : cy - 6)
        .attr('text-anchor', 'middle').attr('dy', '0.35em')
        .attr('font-size', numSize).attr('font-weight', 900)
        .attr('fill', textFill)
        .text(d.data.value);

      if (cw > 50 && ch > 50) {
        // Nombre
        g.append('text')
          .attr('x', cx).attr('y', ch > 80 ? cy + numSize * 0.6 : cy + 12)
          .attr('text-anchor', 'middle').attr('dy', '0.35em')
          .attr('font-size', isMobile ? 8 : 10)
          .attr('fill', textFill).attr('opacity', 0.9)
          .text(d.data.name);
      }

      if (cw > 100 && ch > 80) {
        // Porcentaje
        g.append('text')
          .attr('x', cx).attr('y', cy + numSize * 0.6 + (isMobile ? 16 : 20))
          .attr('text-anchor', 'middle').attr('dy', '0.35em')
          .attr('font-size', isMobile ? 11 : 14).attr('font-weight', 700)
          .attr('fill', textFill)
          .text(d.data.pct);
      }

      if (cw > 200 && ch > 100 && d.data.sub) {
        // Subtítulo
        g.append('text')
          .attr('x', cx).attr('y', cy + numSize * 0.6 + (isMobile ? 32 : 40))
          .attr('text-anchor', 'middle').attr('dy', '0.35em')
          .attr('font-size', isMobile ? 8 : 9).attr('opacity', 0.75)
          .attr('fill', textFill)
          .text(d.data.sub);
      }
    });

    // Nota LAC
    svg.append('text').attr('x', w / 2).attr('y', tmY + tmH + 22)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 9 : 11).attr('font-weight', 700).attr('fill', '#C41E3A')
      .text('América Latina 2024: 361 homicidios LGBTIQ+. Solo 9 condenas en toda la región.');
  })();