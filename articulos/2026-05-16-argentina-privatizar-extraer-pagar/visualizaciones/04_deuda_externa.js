  (function() {
    const container = document.getElementById('viz-deuda');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const data = [
      { year: 2019, value: 278 },
      { year: 2020, value: 271 },
      { year: 2021, value: 266 },
      { year: 2022, value: 276 },
      { year: 2023, value: 286 },
      { year: 2024, value: 287 },
      { year: 2025, value: 320.3 },
    ];

    const w = container.clientWidth;
    const h = isMobile ? 340 : 400;
    const insetX = isMobile ? 0 : Math.floor(w * 0.08);
    const m = { top: 80, right: (isMobile ? 30 : 50) + insetX, bottom: 80, left: (isMobile ? 50 : 65) + insetX };

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', 'Inter, sans-serif');

    // Centered title
    svg.append('text').attr('x', w / 2).attr('y', 24)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 16 : 20).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('Lo que se debe');
    svg.append('text').attr('x', w / 2).attr('y', 46)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 10 : 12).attr('fill', '#B69476')
      .text('Deuda externa bruta (miles de millones USD)');

    const chartBottom = h - m.bottom;
    const x = d3.scaleLinear().domain([2018.5, 2025.5]).range([m.left, w - m.right]);
    const y = d3.scaleLinear().domain([250, 335]).range([chartBottom, m.top]);

    // Gridlines
    [260, 280, 300, 320].forEach((v, vi) => {
      svg.append('line')
        .attr('x1', m.left).attr('x2', w - m.right)
        .attr('y1', y(v)).attr('y2', y(v))
        .attr('stroke', '#DFBFA1').attr('stroke-width', 1).attr('stroke-dasharray', '2,3');
      svg.append('text')
        .attr('x', m.left - 6).attr('y', y(v) + 4)
        .attr('text-anchor', 'end').attr('font-size', 10).attr('fill', '#B69476')
        .text('$' + v + 'B');
    });

    // X axis
    svg.append('g').attr('transform', `translate(0,${chartBottom})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d3.format('d')))
      .call(g => g.select('.domain').attr('stroke', '#DFBFA1'))
      .call(g => g.selectAll('.tick text').attr('fill', '#B69476').attr('font-size', 11));

    // Milei zone
    svg.append('rect')
      .attr('x', x(2023)).attr('y', m.top)
      .attr('width', x(2025) - x(2023)).attr('height', chartBottom - m.top)
      .attr('fill', '#C41E3A').attr('opacity', 0.05);

    svg.append('text')
      .attr('x', x(2024)).attr('y', m.top + 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9).attr('font-weight', 600).attr('fill', '#C41E3A').attr('opacity', 0.6)
      .text('Gobierno Milei');

    // Area
    const area = d3.area()
      .x(d => x(d.year)).y0(chartBottom).y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'deudaGrad')
      .attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#C41E3A').attr('stop-opacity', 0.2);
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#C41E3A').attr('stop-opacity', 0.02);

    svg.append('path').datum(data).attr('d', area).attr('fill', 'url(#deudaGrad)');

    // Line
    const line = d3.line().x(d => x(d.year)).y(d => y(d.value)).curve(d3.curveMonotoneX);
    svg.append('path').datum(data).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#C41E3A').attr('stroke-width', 3);

    // Dots
    data.forEach(d => {
      svg.append('circle').attr('cx', x(d.year)).attr('cy', y(d.value))
        .attr('r', d.year === 2025 ? 7 : 4)
        .attr('fill', d.year >= 2023 ? '#C41E3A' : '#C67132');
    });

    // Record label — centered above dot
    svg.append('text')
      .attr('x', x(2025)).attr('y', y(320.3) - 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 14 : 18).attr('font-weight', 900).attr('fill', '#C41E3A')
      .text('USD 320.305M');
    svg.append('text')
      .attr('x', x(2025)).attr('y', y(320.3) - (isMobile ? 30 : 34))
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 9 : 10).attr('font-weight', 600).attr('fill', '#C41E3A')
      .text('RÉCORD HISTÓRICO');

    // Delta annotation — centered
    const deltaY = chartBottom + 25;
    const deltaW = Math.min(w - 40, 520);
    const deltaX = (w - deltaW) / 2;
    svg.append('rect')
      .attr('x', deltaX).attr('y', deltaY)
      .attr('width', deltaW).attr('height', isMobile ? 40 : 34)
      .attr('fill', '#FEF2F2').attr('rx', 6);

    svg.append('text').attr('x', w / 2).attr('y', deltaY + (isMobile ? 14 : 12))
      .attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('font-weight', 700).attr('fill', '#C41E3A')
      .text('Bajo Milei: +USD 34.354 millones');
    svg.append('text').attr('x', w / 2).attr('y', deltaY + (isMobile ? 28 : 26))
      .attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('fill', '#7B5137')
      .text(isMobile ? 'FMI: USD 20.000M · Pagos netos: USD 7.200M' : 'Nuevo programa FMI: USD 20.000 millones · Pagos netos hasta 2027: USD 7.200 millones');
  })();
