    // ── VIZ 2: Migración neta Chile 2006-2025 (area chart) ──
    (function() {
      const data = [
        {y:2006,v:17285},{y:2007,v:20170},{y:2008,v:22488},{y:2009,v:24324},
        {y:2010,v:26048},{y:2011,v:28086},{y:2012,v:30870},{y:2013,v:36529},
        {y:2014,v:52702},{y:2015,v:55689},{y:2016,v:135864},{y:2017,v:220621},
        {y:2018,v:237807},{y:2019,v:181339},{y:2020,v:26042},{y:2021,v:65480},
        {y:2022,v:59374},{y:2023,v:62679},{y:2024,v:58316},{y:2025,v:51712},
      ];

      const el = document.getElementById('viz-migracion');
      const w = el.clientWidth;
      const h = 320;
      const m = { top: 50, right: 30, bottom: 40, left: 60 };

      const svg = d3.select('#viz-migracion').append('svg')
        .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
        .style('font-family', 'Inter, sans-serif');

      svg.append('text').attr('x', m.left).attr('y', 20)
        .attr('font-size', 16).attr('font-weight', 700).attr('fill', ST[900])
        .text('Migración neta anual de Chile');

      svg.append('text').attr('x', m.left).attr('y', 36)
        .attr('font-size', 11).attr('fill', ST[600])
        .text('Personas que entran − personas que salen · World Bank');

      const x = d3.scaleLinear().domain([2006, 2025]).range([m.left, w - m.right]);
      const y = d3.scaleLinear().domain([0, 260000]).range([h - m.bottom, m.top]);

      // Area
      const area = d3.area()
        .x(d => x(d.y)).y0(h - m.bottom).y1(d => y(d.v))
        .curve(d3.curveMonotoneX);

      const line = d3.line()
        .x(d => x(d.y)).y(d => y(d.v))
        .curve(d3.curveMonotoneX);

      // Gradient
      const defs = svg.append('defs');
      const grad = defs.append('linearGradient').attr('id', 'migGrad')
        .attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
      grad.append('stop').attr('offset', '0%').attr('stop-color', ST.accent).attr('stop-opacity', 0.4);
      grad.append('stop').attr('offset', '100%').attr('stop-color', ST.accent).attr('stop-opacity', 0.02);

      svg.append('path').datum(data).attr('d', area)
        .attr('fill', 'url(#migGrad)');

      svg.append('path').datum(data).attr('d', line)
        .attr('fill', 'none').attr('stroke', ST.accent).attr('stroke-width', 2.5);

      // Axes
      svg.append('g').attr('transform', `translate(0,${h - m.bottom})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format('d')))
        .call(g => g.select('.domain').attr('stroke', ST[200]))
        .call(g => g.selectAll('.tick text').attr('fill', ST[600]).attr('font-size', 10));

      svg.append('g').attr('transform', `translate(${m.left},0)`)
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d/1000}K`))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').attr('x2', w - m.left - m.right).attr('stroke', ST[200]).attr('stroke-dasharray', '2,2'))
        .call(g => g.selectAll('.tick text').attr('fill', ST[600]).attr('font-size', 10));

      // Peak annotation
      svg.append('circle').attr('cx', x(2018)).attr('cy', y(237807)).attr('r', 5).attr('fill', ST.accent);
      svg.append('text').attr('x', x(2018)).attr('y', y(237807) - 12)
        .attr('text-anchor', 'middle').attr('font-size', 11).attr('font-weight', 700).attr('fill', ST[900])
        .text('237.807');
      svg.append('text').attr('x', x(2018)).attr('y', y(237807) - 24)
        .attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', ST[600])
        .text('Crisis Venezuela');

      // Pandemic annotation
      svg.append('circle').attr('cx', x(2020)).attr('cy', y(26042)).attr('r', 4).attr('fill', '#dc2626');
      svg.append('text').attr('x', x(2020) + 5).attr('y', y(26042) + 4)
        .attr('font-size', 9).attr('fill', '#dc2626').text('Pandemia');

      // Kast annotation
      svg.append('line')
        .attr('x1', x(2026) - 5).attr('x2', x(2026) - 5)
        .attr('y1', m.top).attr('y2', h - m.bottom)
        .attr('stroke', ST[900]).attr('stroke-dasharray', '3,3').attr('stroke-width', 1);
    })();

