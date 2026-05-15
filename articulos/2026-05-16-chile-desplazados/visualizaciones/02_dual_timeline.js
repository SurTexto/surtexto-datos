    // ── VIZ NUEVA: Dual timeline — Desastres vs Migración ──
    (function() {
      const el = document.getElementById('viz-dual-timeline');
      const w = el.clientWidth;
      const h = 500;

      const svg = d3.select('#viz-dual-timeline').append('svg')
        .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
        .style('font-family', 'Inter, sans-serif');

      const centerY = h / 2;
      const trackGap = 70;
      const topY = centerY - trackGap;
      const botY = centerY + trackGap;
      const pad = 50;

      // Custom scale: compress 1960-2005, expand 2008-2026
      const usable = w - 2*pad;
      const narrow = w < 500;
      const positions = {
        1960: pad,
        1985: pad + usable * 0.12,
        2010: pad + usable * 0.28,
        2012: pad + usable * (narrow ? 0.40 : 0.38),
        2014: pad + usable * (narrow ? 0.48 : 0.46),
        2015: pad + usable * (narrow ? 0.56 : 0.54),
        2016: pad + usable * (narrow ? 0.48 : 0.50),
        2018: pad + usable * (narrow ? 0.60 : 0.60),
        2019: pad + usable * (narrow ? 0.68 : 0.68),
        2021: pad + usable * 0.78,
        2025: pad + usable * 0.90,
        2026: pad + usable * 0.96,
      };
      const px = (year) => positions[year] || pad;

      // ── Section titles ──
      svg.append('text').attr('x', pad).attr('y', 20)
        .attr('font-size', narrow ? 9 : 11).attr('font-weight', 700).attr('fill', '#16a34a')
        .attr('letter-spacing', '0.05em')
        .text(narrow ? '▲ DESASTRES — 66 AÑOS' : '▲ DESASTRES — 66 AÑOS CONSTRUYENDO CAPACIDAD');

      svg.append('text').attr('x', pad).attr('y', h - 8)
        .attr('font-size', narrow ? 9 : 11).attr('font-weight', 700).attr('fill', '#dc2626')
        .attr('letter-spacing', '0.05em')
        .text(narrow ? '▼ MIGRACIÓN — 16 AÑOS' : '▼ MIGRACIÓN — 16 AÑOS IMPROVISANDO');

      // ── Tracks ──
      svg.append('line')
        .attr('x1', px(1960)).attr('x2', px(2025))
        .attr('y1', topY).attr('y2', topY)
        .attr('stroke', '#16a34a').attr('stroke-width', 3)
        .attr('stroke-linecap', 'round').attr('opacity', 0.5);

      svg.append('line')
        .attr('x1', px(2010)).attr('x2', px(2026))
        .attr('y1', botY).attr('y2', botY)
        .attr('stroke', '#dc2626').attr('stroke-width', 3)
        .attr('stroke-linecap', 'round').attr('opacity', 0.5);

      // Gap indicator (dashed line 1960-1985)
      svg.append('line')
        .attr('x1', px(1960) + 14).attr('x2', px(1985) - 8)
        .attr('y1', topY).attr('y2', topY)
        .attr('stroke', '#16a34a').attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,4').attr('opacity', 0.3);

      // Center divider
      svg.append('line')
        .attr('x1', pad).attr('x2', w - pad)
        .attr('y1', centerY).attr('y2', centerY)
        .attr('stroke', ST[200]).attr('stroke-width', 1);

      // ── Top events (desastres) ──
      const topEvents = [
        { year: 1960, label: 'Valdivia 9.5', sub: '1.600+ muertos', r: 12, above: true },
        ...(narrow ? [] : [{ year: 1985, label: 'Algarrobo 7.8', sub: '177 muertos', r: 6, above: false }]),
        { year: 2010, label: 'Maule 8.8', sub: '525 muertos', r: 9, above: true },
        ...(narrow ? [] : [{ year: 2012, label: 'Reforma ONEMI', sub: '', r: 4, above: false }]),
        { year: 2014, label: 'Iquique 8.2', sub: '6 muertos', r: 5, above: true },
        { year: 2015, label: 'Coquimbo 8.3', sub: '15 muertos', r: 6, above: false },
        { year: 2019, label: 'SENAPRED', sub: 'Ley 21.364', r: 6, above: true },
        { year: 2025, label: '1,5M evacuados', sub: '0 muertos', r: 12, above: false },
      ];

      topEvents.forEach(ev => {
        const ex = px(ev.year);
        svg.append('circle').attr('cx', ex).attr('cy', topY).attr('r', ev.r)
          .attr('fill', '#16a34a').attr('opacity', 0.85);

        if (ev.above) {
          svg.append('line').attr('x1', ex).attr('x2', ex)
            .attr('y1', topY - ev.r).attr('y2', topY - ev.r - 25)
            .attr('stroke', '#16a34a').attr('stroke-width', 1).attr('opacity', 0.4);

          svg.append('text').attr('x', ex).attr('y', topY - ev.r - 30)
            .attr('text-anchor', 'middle').attr('font-size', 11).attr('font-weight', 700)
            .attr('fill', ST[900]).text(ev.year);
          svg.append('text').attr('x', ex).attr('y', topY - ev.r - 44)
            .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 600)
            .attr('fill', '#16a34a').text(ev.label);
          if (ev.sub) {
            svg.append('text').attr('x', ex).attr('y', topY - ev.r - 57)
              .attr('text-anchor', 'middle').attr('font-size', 9)
              .attr('fill', ST[600]).text(ev.sub);
          }
        } else {
          svg.append('text').attr('x', ex).attr('y', topY + ev.r + 14)
            .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 700)
            .attr('fill', ST[900]).text(ev.year);
          svg.append('text').attr('x', ex).attr('y', topY + ev.r + 27)
            .attr('text-anchor', 'middle').attr('font-size', 9).attr('font-weight', 600)
            .attr('fill', '#16a34a').text(ev.label);
        }
      });

      // ── Bottom events (migración) ──
      const botEvents = [
        { year: 2010, label: 'Diáspora haitiana', sub: 'Sin protocolo', r: 7, below: true },
        ...(narrow ? [] : [{ year: 2016, label: '136K neto/año', sub: 'Sin visa especial', r: 7, below: false }]),
        { year: 2018, label: '238K neto/año', sub: 'Sin infraestructura', r: 10, below: true },
        { year: 2021, label: 'Ley 21.325', sub: '11 años tarde', r: 7, below: false },
        { year: 2026, label: 'Zanja + 80 deportados', sub: 'Escuelas-checkpoint', r: 9, below: true },
      ];

      botEvents.forEach(ev => {
        const ex = px(ev.year);
        svg.append('circle').attr('cx', ex).attr('cy', botY).attr('r', ev.r)
          .attr('fill', '#dc2626').attr('opacity', 0.85);

        if (ev.below) {
          svg.append('line').attr('x1', ex).attr('x2', ex)
            .attr('y1', botY + ev.r).attr('y2', botY + ev.r + 25)
            .attr('stroke', '#dc2626').attr('stroke-width', 1).attr('opacity', 0.4);

          svg.append('text').attr('x', ex).attr('y', botY + ev.r + 38)
            .attr('text-anchor', 'middle').attr('font-size', 11).attr('font-weight', 700)
            .attr('fill', ST[900]).text(ev.year);
          svg.append('text').attr('x', ex).attr('y', botY + ev.r + 52)
            .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 600)
            .attr('fill', '#dc2626').text(ev.label);
          if (ev.sub) {
            svg.append('text').attr('x', ex).attr('y', botY + ev.r + 65)
              .attr('text-anchor', 'middle').attr('font-size', 9)
              .attr('fill', ST[600]).text(ev.sub);
          }
        } else {
          svg.append('text').attr('x', ex).attr('y', botY - ev.r - 8)
            .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 700)
            .attr('fill', ST[900]).text(ev.year);
          svg.append('text').attr('x', ex).attr('y', botY - ev.r - 21)
            .attr('text-anchor', 'middle').attr('font-size', 9).attr('font-weight', 600)
            .attr('fill', '#dc2626').text(ev.label);
          if (ev.sub) {
            svg.append('text').attr('x', ex).attr('y', botY - ev.r - 34)
              .attr('text-anchor', 'middle').attr('font-size', 9)
              .attr('fill', ST[600]).text(ev.sub);
          }
        }
      });

      // ── 2010 connection ──
      svg.append('line')
        .attr('x1', px(2010)).attr('x2', px(2010))
        .attr('y1', topY + 10).attr('y2', botY - 10)
        .attr('stroke', ST[400]).attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3');
      svg.append('text').attr('x', px(2010) + 5).attr('y', centerY + 4)
        .attr('font-size', 9).attr('fill', ST[400])
        .text('Ambas historias se cruzan');
    })();

