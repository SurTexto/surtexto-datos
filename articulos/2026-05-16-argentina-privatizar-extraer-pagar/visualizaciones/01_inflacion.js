  (function() {
    const container = document.getElementById('viz-inflacion');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    // Inflación acumulada anual (dic a dic). 2026: interanual abril.
    const data = [
      { year: 2019, value: 53.8 },
      { year: 2020, value: 36.1 },
      { year: 2021, value: 50.9 },
      { year: 2022, value: 94.8 },
      { year: 2023, value: 211.4 },
      { year: 2024, value: 117.8 },
      { year: 2026, value: 32.4, label: 'abr.' },
    ];

    const w = container.clientWidth;
    const h = isMobile ? 320 : 400;
    const m = { top: 60, right: isMobile ? 30 : 50, bottom: 50, left: isMobile ? 50 : 60 };

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', 'Inter, sans-serif');

    // Title
    svg.append('text').attr('x', m.left).attr('y', 22)
      .attr('font-size', isMobile ? 14 : 18).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('Inflación interanual en Argentina');
    svg.append('text').attr('x', m.left).attr('y', 40)
      .attr('font-size', isMobile ? 10 : 12).attr('fill', '#B69476')
      .text('Inflación acumulada anual (%), INDEC. *2026: interanual abril.');

    const x = d3.scaleLinear().domain([2018.5, 2026.5]).range([m.left, w - m.right]);
    const y = d3.scaleLinear().domain([0, 240]).range([h - m.bottom, m.top]);

    // Gridlines
    [50, 100, 150, 200].forEach(v => {
      svg.append('line')
        .attr('x1', m.left).attr('x2', w - m.right)
        .attr('y1', y(v)).attr('y2', y(v))
        .attr('stroke', '#DFBFA1').attr('stroke-width', 1).attr('stroke-dasharray', '2,3');
      svg.append('text')
        .attr('x', m.left - 6).attr('y', y(v) + 4)
        .attr('text-anchor', 'end').attr('font-size', 10).attr('fill', '#B69476')
        .text(v + '%');
    });

    // X axis
    svg.append('g').attr('transform', `translate(0,${h - m.bottom})`)
      .call(d3.axisBottom(x).tickValues([2019, 2020, 2021, 2022, 2023, 2024, 2026]).tickFormat(d3.format('d')))
      .call(g => g.select('.domain').attr('stroke', '#DFBFA1'))
      .call(g => g.selectAll('.tick text').attr('fill', '#B69476').attr('font-size', 11));

    // Area under curve
    const area = d3.area()
      .x(d => x(d.year)).y0(h - m.bottom).y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'infGrad')
      .attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#C41E3A').attr('stop-opacity', 0.3);
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#C41E3A').attr('stop-opacity', 0.02);

    svg.append('path').datum(data).attr('d', area).attr('fill', 'url(#infGrad)');

    // Line
    const line = d3.line().x(d => x(d.year)).y(d => y(d.value)).curve(d3.curveMonotoneX);
    svg.append('path').datum(data).attr('d', line)
      .attr('fill', 'none').attr('stroke', '#C41E3A').attr('stroke-width', 3);

    // Dots and labels
    data.forEach(d => {
      const highlight = d.year === 2023 || d.year === 2026;
      svg.append('circle').attr('cx', x(d.year)).attr('cy', y(d.value))
        .attr('r', highlight ? 7 : 5)
        .attr('fill', highlight ? '#C41E3A' : '#C67132');

      const labelY = highlight ? y(d.value) - 16 : y(d.value) - 12;
      svg.append('text').attr('x', x(d.year)).attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('font-size', highlight ? 14 : 11)
        .attr('font-weight', 700)
        .attr('fill', highlight ? '#C41E3A' : '#3B3231')
        .text(d.value + '%');

      // Special label for April 2026
      if (d.label) {
        svg.append('text').attr('x', x(d.year)).attr('y', labelY - 14)
          .attr('text-anchor', 'middle')
          .attr('font-size', 9).attr('fill', '#B69476')
          .text(d.label + ' 2026');
      }
    });

    // Milei annotation
    svg.append('line')
      .attr('x1', x(2023)).attr('x2', x(2023))
      .attr('y1', y(211.4) - 28).attr('y2', m.top - 5)
      .attr('stroke', '#C41E3A').attr('stroke-width', 1).attr('stroke-dasharray', '3,2');
    svg.append('text').attr('x', x(2023)).attr('y', m.top - 10)
      .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 600)
      .attr('fill', '#C41E3A').text('Milei asume');

    // Arrow annotation for the drop
    if (!isMobile) {
      svg.append('text').attr('x', x(2024.5)).attr('y', y(170))
        .attr('text-anchor', 'middle').attr('font-size', 24).attr('fill', '#16a34a').attr('opacity', 0.5)
        .text('↓');
      svg.append('text').attr('x', x(2024.5)).attr('y', y(155))
        .attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', '#16a34a')
        .text('179 puntos');
    }
  })();
