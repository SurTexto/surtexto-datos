// VIZ 1 — Colombia: violencia LGBTIQ+ 2025
// Requiere D3.js v7: https://cdn.jsdelivr.net/npm/d3@7

(function() {
    const container = document.getElementById('viz-serie');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const data = [
      { year: 2021, value: 205 },
      { year: 2022, value: 145 },
      { year: 2023, value: 156 },
      { year: 2024, value: 165 },
      { year: 2025, value: 270 },
    ];

    const w = container.clientWidth;
    const h = isMobile ? 320 : 360;
    const m = { top: 70, right: 20, bottom: 50, left: 20 };

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', 'Inter, sans-serif');

    svg.append('text').attr('x', w / 2).attr('y', 24).attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 14 : 18).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('270 personas LGBTIQ+ asesinadas en 2025');
    svg.append('text').attr('x', w / 2).attr('y', 44).attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 10 : 12).attr('fill', '#B69476')
      .text('Homicidios de personas LGBTIQ+ en Colombia');

    const x = d3.scaleBand().domain(data.map(d => d.year)).range([m.left, w - m.right]).padding(0.3);
    const y = d3.scaleLinear().domain([0, 310]).range([h - m.bottom, m.top]);

    // Bars
    data.forEach(d => {
      const bx = x(d.year);
      const bw = x.bandwidth();
      const isLast = d.year === 2025;
      const barColor = isLast ? '#C41E3A' : '#DFBFA1';

      svg.append('rect').attr('x', bx).attr('y', y(d.value))
        .attr('width', bw).attr('height', y(0) - y(d.value))
        .attr('fill', barColor).attr('rx', 2);

      // Value on top
      svg.append('text').attr('x', bx + bw / 2).attr('y', y(d.value) - 6)
        .attr('text-anchor', 'middle')
        .attr('font-size', isLast ? 15 : (isMobile ? 8 : 10)).attr('font-weight', 700)
        .attr('fill', isLast ? '#C41E3A' : '#3B3231')
        .text(d.value);

      // Year
      svg.append('text').attr('x', bx + bw / 2).attr('y', h - m.bottom + 16)
        .attr('text-anchor', 'middle').attr('font-size', isMobile ? 8 : 10).attr('fill', '#B69476')
        .text(d.year);

      // +64% annotation
      if (isLast) {
        svg.append('text').attr('x', bx + bw / 2).attr('y', y(d.value) - 22)
          .attr('text-anchor', 'middle')
          .attr('font-size', 10).attr('font-weight', 700).attr('fill', '#C41E3A')
          .text('+63%');
      }
    });
  })();