    // ── VIZ ANIMADA: Dos curvas — víctimas vs migración ──
    (function() {
      const el = document.getElementById('viz-curvas');
      const w = el.clientWidth;
      const h = 400;
      const compact = w < 500;
      const m = { top: 50, right: compact ? 45 : 60, bottom: 50, left: compact ? 50 : 70 };

      const svg = d3.select('#viz-curvas').append('svg')
        .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
        .style('font-family', 'Inter, sans-serif');

      // Data: deaths by disaster events
      const deaths = [
        { year: 1960, value: 1655, label: 'Valdivia 9.5' },
        { year: 1985, value: 177, label: 'Algarrobo 7.8' },
        { year: 2010, value: 525, label: 'Maule 8.8' },
        { year: 2014, value: 6, label: 'Iquique 8.2' },
        { year: 2015, value: 15, label: 'Coquimbo 8.3' },
        { year: 2025, value: 0, label: 'Kamchatka (alerta)' },
      ];

      // Data: migration net (sampled years for clarity)
      const migration = [
        { year: 2006, value: 17285 },
        { year: 2008, value: 22488 },
        { year: 2010, value: 26048 },
        { year: 2012, value: 30870 },
        { year: 2014, value: 52702 },
        { year: 2016, value: 135864 },
        { year: 2017, value: 220621 },
        { year: 2018, value: 237807 },
        { year: 2019, value: 181339 },
        { year: 2020, value: 26042 },
        { year: 2022, value: 59374 },
        { year: 2025, value: 51712 },
      ];

      // Scales
      const x = d3.scaleLinear().domain([1958, 2027]).range([m.left, w - m.right]);
      const yLeft = d3.scaleLinear().domain([0, 1800]).range([h - m.bottom, m.top]);
      const yRight = d3.scaleLinear().domain([0, 260000]).range([h - m.bottom, m.top]);

      // Title
      svg.append('text').attr('x', m.left).attr('y', 20)
        .attr('font-size', compact ? 13 : 15).attr('font-weight', 700).attr('fill', ST[900])
        .text('Dos curvas, dos gestiones');
      svg.append('text').attr('x', m.left).attr('y', 38)
        .attr('font-size', compact ? 9 : 11).attr('fill', ST[600])
        .text(compact ? 'Víctimas (↓) vs migración (↑) · ▶ para animar' : 'Víctimas por desastres (↓) vs migración neta (↑) · Presiona ▶ para animar');

      // Axes
      svg.append('g').attr('transform', `translate(0,${h - m.bottom})`)
        .call(d3.axisBottom(x).tickValues(compact ? [1960, 2000, 2015, 2025] : [1960, 1985, 2000, 2010, 2015, 2020, 2025]).tickFormat(d3.format('d')))
        .call(g => g.select('.domain').attr('stroke', ST[200]))
        .call(g => g.selectAll('.tick text').attr('fill', ST[600]).attr('font-size', 10));

      // Left axis (deaths - green)
      svg.append('g').attr('transform', `translate(${m.left},0)`)
        .call(d3.axisLeft(yLeft).ticks(5).tickFormat(d => d === 0 ? '0' : `${(d/1000).toFixed(1)}K`))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').attr('x2', w - m.left - m.right).attr('stroke', ST[200]).attr('stroke-dasharray', '2,2'))
        .call(g => g.selectAll('.tick text').attr('fill', '#16a34a').attr('font-size', 10));
      svg.append('text').attr('x', m.left - 10).attr('y', m.top - 10)
        .attr('text-anchor', 'end').attr('font-size', 9).attr('font-weight', 600)
        .attr('fill', '#16a34a').text('Víctimas ↓');

      // Right axis (migration - red)
      svg.append('g').attr('transform', `translate(${w - m.right},0)`)
        .call(d3.axisRight(yRight).ticks(5).tickFormat(d => d === 0 ? '0' : `${(d/1000).toFixed(0)}K`))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick text').attr('fill', '#dc2626').attr('font-size', 10));
      svg.append('text').attr('x', w - m.right + 10).attr('y', m.top - 10)
        .attr('font-size', 9).attr('font-weight', 600)
        .attr('fill', '#dc2626').text('Migración ↑');

      // Lines
      const deathLine = d3.line().x(d => x(d.year)).y(d => yLeft(d.value)).curve(d3.curveMonotoneX);
      const migLine = d3.line().x(d => x(d.year)).y(d => yRight(d.value)).curve(d3.curveMonotoneX);

      // Death line path (green)
      const deathPath = svg.append('path').datum(deaths)
        .attr('d', deathLine)
        .attr('fill', 'none').attr('stroke', '#16a34a').attr('stroke-width', 3);

      // Death dots
      const deathDots = svg.selectAll('.death-dot').data(deaths).join('circle')
        .attr('class', 'death-dot')
        .attr('cx', d => x(d.year)).attr('cy', d => yLeft(d.value))
        .attr('r', 5).attr('fill', '#16a34a');

      // Death labels
      const deathLabels = svg.selectAll('.death-label').data(deaths).join('text')
        .attr('class', 'death-label')
        .attr('x', d => x(d.year)).attr('y', d => yLeft(d.value) - 12)
        .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 700)
        .attr('fill', '#16a34a')
        .text(d => d.value === 0 ? '0 ✓' : d.value.toLocaleString('es'));

      // Migration area (red, subtle fill)
      const migArea = d3.area()
        .x(d => x(d.year)).y0(h - m.bottom).y1(d => yRight(d.value))
        .curve(d3.curveMonotoneX);

      const migAreaPath = svg.append('path').datum(migration)
        .attr('d', migArea)
        .attr('fill', '#dc2626').attr('opacity', 0.08);

      // Migration line path (red)
      const migPath = svg.append('path').datum(migration)
        .attr('d', migLine)
        .attr('fill', 'none').attr('stroke', '#dc2626').attr('stroke-width', 3);

      // Migration peak label
      svg.append('text')
        .attr('x', x(2018)).attr('y', yRight(237807) - 12)
        .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 700)
        .attr('fill', '#dc2626').text('238K');

      // Initial state: clip both paths
      const totalDeathLen = deathPath.node().getTotalLength();
      const totalMigLen = migPath.node().getTotalLength();

      deathPath.attr('stroke-dasharray', totalDeathLen).attr('stroke-dashoffset', totalDeathLen);
      migPath.attr('stroke-dasharray', totalMigLen).attr('stroke-dashoffset', totalMigLen);
      migAreaPath.attr('opacity', 0);
      deathDots.attr('opacity', 0);
      deathLabels.attr('opacity', 0);

      // Play button
      const btnG = svg.append('g').style('cursor', 'pointer');
      btnG.append('rect')
        .attr('x', w/2 - 50).attr('y', h/2 - 18)
        .attr('width', 100).attr('height', 36).attr('rx', 18)
        .attr('fill', ST[900]);
      btnG.append('text')
        .attr('x', w/2).attr('y', h/2 + 5)
        .attr('text-anchor', 'middle').attr('font-size', 13).attr('font-weight', 700)
        .attr('fill', 'white').text('▶  Animar');

      let played = false;
      btnG.on('click', function() {
        if (played) return;
        played = true;
        btnG.transition().duration(300).attr('opacity', 0).remove();

        // Animate death line (green) — 2 seconds
        deathPath.transition().duration(2500).ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);

        // Animate death dots and labels with stagger
        deathDots.transition().delay((d, i) => 400 * i).duration(300)
          .attr('opacity', 1);
        deathLabels.transition().delay((d, i) => 400 * i).duration(300)
          .attr('opacity', 1);

        // Animate migration line (red) — starts at 1.5s, runs 2s
        migPath.transition().delay(1500).duration(2500).ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);
        migAreaPath.transition().delay(1500).duration(2500)
          .attr('opacity', 0.08);
      });

      // Legend
      svg.append('circle').attr('cx', m.left + 10).attr('cy', h - 12).attr('r', 4).attr('fill', '#16a34a');
      svg.append('text').attr('x', m.left + 20).attr('y', h - 8)
        .attr('font-size', 9).attr('fill', ST[600]).text('Víctimas por terremoto/tsunami (eje izq.)');
      svg.append('circle').attr('cx', w/2).attr('cy', h - 12).attr('r', 4).attr('fill', '#dc2626');
      svg.append('text').attr('x', w/2 + 10).attr('y', h - 8)
        .attr('font-size', 9).attr('fill', ST[600]).text('Migración neta anual (eje der.)');
    })();

