  (function() {
    const container = document.getElementById('viz-cosecha');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const data = [
      { year: '15/16', value: 186 },
      { year: '16/17', value: 238 },
      { year: '17/18', value: 228 },
      { year: '18/19', value: 242 },
      { year: '19/20', value: 257 },
      { year: '20/21', value: 263 },
      { year: '21/22', value: 271 },
      { year: '22/23', value: 322 },
      { year: '23/24', value: 300 },
      { year: '24/25', value: 333 },
      { year: '25/26', value: 358, highlight: true },
    ];

    const w = container.clientWidth;
    const h = isMobile ? 320 : 380;
    const m = { top: 60, right: 20, bottom: 50, left: isMobile ? 40 : 55 };

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', 'Inter, sans-serif');

    svg.append('text').attr('x', w / 2).attr('y', 22).attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 14 : 18).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('Cosecha récord');
    svg.append('text').attr('x', w / 2).attr('y', 42).attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 10 : 12).attr('fill', '#B69476')
      .text('Producción de granos, Brasil (millones de toneladas)');

    const x = d3.scaleBand().domain(data.map(d => d.year)).range([m.left, w - m.right]).padding(0.2);
    const y = d3.scaleLinear().domain([0, 400]).range([h - m.bottom, m.top]);

    // Gridlines
    [100, 200, 300].forEach(v => {
      svg.append('line').attr('x1', m.left).attr('x2', w - m.right)
        .attr('y1', y(v)).attr('y2', y(v))
        .attr('stroke', '#DFBFA1').attr('stroke-width', 1).attr('stroke-dasharray', '2,3');
    });

    // Bars
    data.forEach(d => {
      const bx = x(d.year);
      const bw = x.bandwidth();
      const green = d.highlight ? '#2d6a2e' : '#7B9A6D';

      svg.append('rect').attr('x', bx).attr('y', y(d.value))
        .attr('width', bw).attr('height', y(0) - y(d.value))
        .attr('fill', green).attr('rx', 2);

      svg.append('text').attr('x', bx + bw / 2).attr('y', y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', d.highlight ? 12 : (isMobile ? 8 : 9))
        .attr('font-weight', d.highlight ? 800 : 500)
        .attr('fill', d.highlight ? '#2d6a2e' : '#7B5137')
        .text(d.value);

      svg.append('text').attr('x', bx + bw / 2).attr('y', h - m.bottom + 14)
        .attr('text-anchor', 'middle').attr('font-size', isMobile ? 8 : 9)
        .attr('fill', '#B69476').text(d.year);
    });

    // Annotation
    const lastX = x('25/26') + x.bandwidth() / 2;
    svg.append('text').attr('x', lastX).attr('y', y(358) - 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('font-weight', 700).attr('fill', '#C41E3A')
      .text('RÉCORD');
  })();
