  (function() {
    const container = document.getElementById('viz-desaparecidos');
    if (!container) return;

    const data = [
      { year: 2006, cumulative: 3200 },
      { year: 2007, cumulative: 7000 },
      { year: 2008, cumulative: 12200 },
      { year: 2009, cumulative: 18000 },
      { year: 2010, cumulative: 24500 },
      { year: 2011, cumulative: 31700 },
      { year: 2012, cumulative: 37800 },
      { year: 2013, cumulative: 43200 },
      { year: 2014, cumulative: 48300 },
      { year: 2015, cumulative: 53600 },
      { year: 2016, cumulative: 59200 },
      { year: 2017, cumulative: 65400 },
      { year: 2018, cumulative: 72500 },
      { year: 2019, cumulative: 80000 },
      { year: 2020, cumulative: 87970 },
      { year: 2021, cumulative: 96077 },
      { year: 2022, cumulative: 104263 },
      { year: 2023, cumulative: 114646 },
      { year: 2024, cumulative: 127699 },
      { year: 2025, cumulative: 132534 }
    ];

    const isMobile = window.innerWidth < 640;
    const width = container.clientWidth;
    const height = isMobile ? 320 : 400;
    const margin = { top: 50, right: 30, bottom: 50, left: isMobile ? 50 : 60 };
    const chartBottom = height - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const defs = svg.append('defs');

    const x = d3.scaleLinear()
      .domain([2006, 2025])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 140000])
      .range([chartBottom, margin.top]);

    // ── WOMAN SILHOUETTE PATH (simple, iconic) ──
    // Head + shoulders + body, normalized to ~0-1 range, scaled per instance
    const silhouettePath = 'M0.5,0 C0.65,0 0.75,0.08 0.75,0.2 C0.75,0.32 0.65,0.4 0.5,0.4 C0.35,0.4 0.25,0.32 0.25,0.2 C0.25,0.08 0.35,0 0.5,0 Z M0.5,0.42 C0.6,0.42 0.7,0.44 0.78,0.5 C0.88,0.58 0.92,0.68 0.95,0.82 L0.95,1 L0.05,1 L0.05,0.82 C0.08,0.68 0.12,0.58 0.22,0.5 C0.3,0.44 0.4,0.42 0.5,0.42 Z';

    // Place silhouettes ONLY inside the area shape
    const silhouetteGroup = svg.append('g').attr('class', 'silhouettes');
    const numSilhouettes = isMobile ? 25 : 50;
    const silH = isMobile ? 22 : 28;
    const silW = silH * 0.5;

    // Interpolate cumulative value at any year using the data
    const cumInterp = d3.scaleLinear()
      .domain(data.map(d => d.year))
      .range(data.map(d => d.cumulative))
      .clamp(true);

    // Generate positions inside the area
    const silhouettes = [];
    let attempts = 0;
    while (silhouettes.length < numSilhouettes && attempts < 500) {
      attempts++;
      const sx = margin.left + 15 + Math.random() * (width - margin.left - margin.right - 30);
      // Convert x pixel back to year
      const yearAtX = x.invert(sx);
      // Get cumulative value at this year
      const cumAtX = cumInterp(yearAtX);
      const topY = y(cumAtX);
      // Silhouette must fit between topY and chartBottom
      if (chartBottom - topY < silH + 6) continue;
      const sy = topY + 6 + Math.random() * (chartBottom - topY - silH - 6);
      silhouettes.push({ x: sx, y: sy });
    }

    silhouettes.forEach(s => {
      silhouetteGroup.append('path')
        .attr('d', silhouettePath)
        .attr('transform', `translate(${s.x - silW/2}, ${s.y}) scale(${silW}, ${silH})`)
        .attr('fill', '#C67132')
        .attr('opacity', 0.2);
    });

    // ── AXES (drawn before area so area covers them partially) ──
    svg.append('g')
      .attr('transform', `translate(0,${chartBottom})`)
      .call(d3.axisBottom(x).ticks(isMobile ? 5 : 10).tickFormat(d3.format('d')))
      .call(g => g.select('.domain').attr('stroke', '#DFBFA1'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#DFBFA1'))
      .call(g => g.selectAll('.tick text').attr('font-family', 'Inter, sans-serif').attr('font-size', '10px').attr('fill', '#7B5137'));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d === 0 ? '0' : (d / 1000) + 'K'))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('x2', width - margin.left - margin.right).attr('stroke', '#DFBFA1').attr('stroke-opacity', 0.5))
      .call(g => g.selectAll('.tick text').attr('font-family', 'Inter, sans-serif').attr('font-size', '10px').attr('fill', '#B69476'));

    // ── AREA (the veil that covers silhouettes) ──
    const areaGen = d3.area()
      .x(d => x(d.year))
      .y0(chartBottom)
      .y1(d => y(d.cumulative))
      .curve(d3.curveMonotoneX);

    // Clip rect that sweeps left to right
    const clipRect = defs.append('clipPath')
      .attr('id', 'area-reveal-clip')
      .append('rect')
      .attr('x', margin.left)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', height);

    const areaPath = svg.append('path')
      .datum(data)
      .attr('d', areaGen)
      .attr('fill', '#7B5137')
      .attr('opacity', 0.25)
      .attr('clip-path', 'url(#area-reveal-clip)');

    // Line
    const lineGen = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.cumulative))
      .curve(d3.curveMonotoneX);

    const linePath = svg.append('path')
      .datum(data)
      .attr('d', lineGen)
      .attr('fill', 'none')
      .attr('stroke', '#7B5137')
      .attr('stroke-width', 2.5)
      .attr('clip-path', 'url(#area-reveal-clip)');

    // ── OVERLAYS (drawn after area, always visible) ──

    // Azteca reference line
    const aztecaCap = 87523;
    svg.append('line')
      .attr('x1', margin.left).attr('y1', y(aztecaCap))
      .attr('x2', width - margin.right).attr('y2', y(aztecaCap))
      .attr('stroke', '#C67132')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4');

    svg.append('text')
      .attr('x', width - margin.right - 4)
      .attr('y', y(aztecaCap) - 6)
      .attr('text-anchor', 'end')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', isMobile ? '9px' : '11px')
      .attr('font-weight', '600')
      .attr('fill', '#C67132')
      .text('= 1 Estadio Azteca (87.523)');

    // End label
    const lastD = data[data.length - 1];
    svg.append('text')
      .attr('x', x(lastD.year))
      .attr('y', y(lastD.cumulative) - 12)
      .attr('text-anchor', 'end')
      .attr('font-family', 'Montserrat, sans-serif')
      .attr('font-size', isMobile ? '16px' : '20px')
      .attr('font-weight', '900')
      .attr('fill', '#7B5137')
      .attr('opacity', 0)
      .attr('class', 'end-label')
      .text('132.534');

    // Year labels with new cases — left side, red font
    const yearLabels = [
      { year: 2006, cases: '3.200' },
      { year: 2010, cases: '6.500' },
      { year: 2014, cases: '5.100' },
      { year: 2018, cases: '7.100' },
      { year: 2020, cases: '7.970' },
      { year: 2023, cases: '10.383' },
      { year: 2024, cases: '13.053' },
      { year: 2025, cases: '14.079' }
    ];

    const labelsGroup = svg.append('g').attr('class', 'year-labels');
    yearLabels.forEach(yl => {
      const d = data.find(dd => dd.year === yl.year);
      if (!d) return;
      const lx = x(yl.year);
      const ly = y(d.cumulative);
      // Only show if there's space (inside the area, near the curve)
      const labelY = Math.min(ly + 16, chartBottom - 8);

      const nearRight = lx > width * 0.7;
      labelsGroup.append('text')
        .attr('x', nearRight ? lx - 4 : lx + 4)
        .attr('y', labelY)
        .attr('text-anchor', nearRight ? 'end' : 'start')
        .attr('font-family', 'Montserrat, sans-serif')
        .attr('font-size', isMobile ? '8px' : '10px')
        .attr('font-weight', '700')
        .attr('fill', '#C41E3A')
        .attr('opacity', 0)
        .attr('class', 'accel-label')
        .text('+' + yl.cases);
    });

    // Title
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', 18)
      .attr('font-family', 'Montserrat, sans-serif')
      .attr('font-size', isMobile ? '13px' : '15px')
      .attr('font-weight', '700')
      .attr('fill', '#3B3231')
      .text(isMobile ? 'Desaparecidas en México' : 'Personas desaparecidas en México (acumulado)');

    svg.append('text')
      .attr('x', margin.left)
      .attr('y', 34)
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11px')
      .attr('fill', '#B69476')
      .text('RNPD, 2006-2025');

    // ── ANIMATION: sweep area left to right ──
    const totalAnimW = width - margin.left - margin.right;
    const animDuration = 4000;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Sweep the clip rect from left to right
          clipRect.transition()
            .duration(animDuration)
            .ease(d3.easeLinear)
            .attr('width', totalAnimW + margin.right);

          // Fade silhouettes partially — they remain visible behind the veil
          silhouetteGroup.transition()
            .delay(animDuration * 0.3)
            .duration(animDuration * 0.7)
            .style('opacity', 0.35);

          // Show end label after animation
          svg.select('.end-label')
            .transition()
            .delay(animDuration)
            .duration(600)
            .attr('opacity', 1);

          // Show acceleration labels
          svg.selectAll('.accel-label')
            .transition()
            .delay(animDuration + 300)
            .duration(600)
            .attr('opacity', 1);

          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(container);
  })();
