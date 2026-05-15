  (function() {
    const container = document.getElementById('viz-estados');
    if (!container) return;

    const data = [
      { state: 'Sinaloa', value: 69, prev: 26, rank_prev: 12 },
      { state: 'Edo. de México', value: 56, prev: 72, rank_prev: 1 },
      { state: 'Chihuahua', value: 49, prev: 38, rank_prev: 5 },
      { state: 'CDMX', value: 44, prev: 41, rank_prev: 4 },
      { state: 'Veracruz', value: 43, prev: 45, rank_prev: 3 },
      { state: 'Nuevo León', value: 42, prev: 50, rank_prev: 2 },
      { state: 'Jalisco', value: 37, prev: 35, rank_prev: 7 },
      { state: 'Oaxaca', value: 33, prev: 30, rank_prev: 9 },
      { state: 'Sonora', value: 30, prev: 28, rank_prev: 10 },
      { state: 'Puebla', value: 28, prev: 36, rank_prev: 6 }
    ];

    const isMobile = window.innerWidth < 640;
    const width = container.clientWidth;
    const barH = isMobile ? 28 : 32;
    const gap = 6;
    const height = data.length * (barH + gap) + 80;
    const margin = { top: 50, right: isMobile ? 60 : 80, bottom: 20, left: isMobile ? 90 : 110 };

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const x = d3.scaleLinear()
      .domain([0, 75])
      .range([margin.left, width - margin.right]);

    // Title
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', 18)
      .attr('font-family', 'Montserrat, sans-serif')
      .attr('font-size', isMobile ? '13px' : '15px')
      .attr('font-weight', '700')
      .attr('fill', '#3B3231')
      .text('Feminicidios por estado, 2025');

    svg.append('text')
      .attr('x', margin.left)
      .attr('y', 34)
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11px')
      .attr('fill', '#B69476')
      .text('Top 10 entidades (SESNSP)');

    data.forEach((d, i) => {
      const y = margin.top + i * (barH + gap);
      const isSinaloa = d.state === 'Sinaloa';
      const barColor = isSinaloa ? '#C41E3A' : '#C67132';

      // State label
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y + barH / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-size', isMobile ? '10px' : '12px')
        .attr('font-weight', isSinaloa ? '700' : '400')
        .attr('fill', isSinaloa ? '#C41E3A' : '#3B3231')
        .text(d.state);

      // Bar
      svg.append('rect')
        .attr('x', margin.left)
        .attr('y', y)
        .attr('width', x(d.value) - margin.left)
        .attr('height', barH)
        .attr('rx', 3)
        .attr('fill', barColor)
        .attr('opacity', isSinaloa ? 0.9 : 0.6);

      // Value
      svg.append('text')
        .attr('x', x(d.value) + 6)
        .attr('y', y + barH / 2 + 4)
        .attr('font-family', 'Montserrat, sans-serif')
        .attr('font-size', isMobile ? '11px' : '13px')
        .attr('font-weight', '700')
        .attr('fill', barColor)
        .text(d.value);

      // Sinaloa annotation
      if (isSinaloa && !isMobile) {
        svg.append('text')
          .attr('x', x(d.value) + 30)
          .attr('y', y + barH / 2 + 4)
          .attr('font-family', 'Inter, sans-serif')
          .attr('font-size', '10px')
          .attr('fill', '#C41E3A')
          .text('(era #12 en 2024 con 26)');
      }
      if (isSinaloa && isMobile) {
        svg.append('text')
          .attr('x', margin.left)
          .attr('y', y + barH + 12)
          .attr('font-family', 'Inter, sans-serif')
          .attr('font-size', '9px')
          .attr('fill', '#C41E3A')
          .text('Era #12 en 2024 (26 casos)');
      }
    });
  })();
