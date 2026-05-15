    // ── VIZ 1: Ranking global de desplazados (barras verticales) ──
    (function() {
      const data = [
        { country: 'Filipinas', value: 10700, highlight: false },
        { country: 'China', value: 3500, highlight: false },
        { country: 'Pakistán', value: 3000, highlight: false },
        { country: 'Chile', value: 1502, highlight: true },
        { country: 'Indonesia', value: 1400, highlight: false },
        { country: 'Brasil', value: 399, highlight: false },
        { country: 'Perú', value: 179, highlight: false },
      ];

      const el = document.getElementById('viz-desplazados');
      const w = el.clientWidth;
      const m = { top: 50, right: 10, bottom: 60, left: 40 };
      const h = 420;

      const svg = d3.select('#viz-desplazados').append('svg')
        .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
        .style('font-family', 'Inter, sans-serif');

      // Title
      svg.append('text').attr('x', m.left).attr('y', 22)
        .attr('font-size', 16).attr('font-weight', 700).attr('fill', ST[900])
        .text('Desplazados por desastres en el mundo, 2025');
      svg.append('text').attr('x', m.left).attr('y', 40)
        .attr('font-size', 11).attr('fill', ST[600])
        .text(w < 500 ? 'Miles de personas · Global: 29,9M · América: 4,3M' : 'Miles de personas · Total global: 29,9 millones · América: 4,3 millones');

      const x = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([m.left, w - m.right])
        .padding(0.25);

      const y = d3.scaleLinear()
        .domain([0, 12000])
        .range([h - m.bottom, m.top]);

      // Gridlines
      [2000, 4000, 6000, 8000, 10000].forEach(v => {
        svg.append('line')
          .attr('x1', m.left).attr('x2', w - m.right)
          .attr('y1', y(v)).attr('y2', y(v))
          .attr('stroke', ST[200]).attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,2');
        svg.append('text')
          .attr('x', m.left - 4).attr('y', y(v) + 3)
          .attr('text-anchor', 'end').attr('font-size', 9).attr('fill', ST[400])
          .text(`${(v/1000).toFixed(0)}M`);
      });

      // Bars
      data.forEach(d => {
        const barX = x(d.country);
        const barW = x.bandwidth();
        const barY = y(d.value);
        const barH = y(0) - barY;

        // Bar
        svg.append('rect')
          .attr('x', barX).attr('y', barY)
          .attr('width', barW).attr('height', barH)
          .attr('fill', d.highlight ? ST.accent : ST[200])
          .attr('rx', 3);

        // Highlight glow for Chile
        if (d.highlight) {
          svg.append('rect')
            .attr('x', barX - 3).attr('y', barY - 3)
            .attr('width', barW + 6).attr('height', barH + 3)
            .attr('fill', 'none')
            .attr('stroke', ST.accent).attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,2')
            .attr('rx', 5);

          // Rank badge
          svg.append('rect')
            .attr('x', barX + barW/2 - 14).attr('y', barY - 28)
            .attr('width', 28).attr('height', 20)
            .attr('fill', ST.accent).attr('rx', 10);
          svg.append('text')
            .attr('x', barX + barW/2).attr('y', barY - 14)
            .attr('text-anchor', 'middle')
            .attr('font-size', 11).attr('font-weight', 700).attr('fill', 'white')
            .text('#4');
        }

        // Value on top
        svg.append('text')
          .attr('x', barX + barW/2).attr('y', barY - (d.highlight ? 34 : 8))
          .attr('text-anchor', 'middle')
          .attr('font-size', d.highlight ? 15 : 12)
          .attr('font-weight', 700)
          .attr('fill', d.highlight ? ST.accent : ST[900])
          .text(`${(d.value/1000).toFixed(1)}M`);

        // Country name below
        svg.append('text')
          .attr('x', barX + barW/2).attr('y', h - m.bottom + 16)
          .attr('text-anchor', 'middle')
          .attr('font-size', d.highlight ? 12 : 10)
          .attr('font-weight', d.highlight ? 700 : 400)
          .attr('fill', d.highlight ? ST.accent : ST[900])
          .text(d.country);

        // Region label
        const isLatam = ['Chile', 'Brasil', 'Perú'].includes(d.country);
        svg.append('text')
          .attr('x', barX + barW/2).attr('y', h - m.bottom + 30)
          .attr('text-anchor', 'middle')
          .attr('font-size', 9)
          .attr('fill', isLatam ? ST.accent : ST[400])
          .text(isLatam ? 'América' : 'Asia');
      });

      // Baseline
      svg.append('line')
        .attr('x1', m.left).attr('x2', w - m.right)
        .attr('y1', y(0)).attr('y2', y(0))
        .attr('stroke', ST[900]).attr('stroke-width', 1);
    })();

