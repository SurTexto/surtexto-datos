  (function() {
    const container = document.getElementById('viz-tradeoff');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const w = container.clientWidth;
    const h = isMobile ? 520 : 330;
    const cx = w / 2;

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', 'Inter, sans-serif');

    // Title
    svg.append('text').attr('x', cx).attr('y', 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 16 : 20).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('El modelo fiscal');

    const pillars = [
      { label: 'VENDER', color: '#C41E3A', desc: 'Reduce gasto',
        stats: ['11 empresas', 'AySA: 14M pers.', 'Hidrovía: 80% exp.'] },
      { label: 'EXTRAER', color: '#C67132', desc: 'Genera divisas',
        stats: ['882K barriles/día', 'RIGI: USD 27.000M', 'Exenciones 30 años'] },
      { label: 'ENDEUDARSE', color: '#7B5137', desc: 'Financia transición',
        stats: ['Deuda: USD 320.305M', 'FMI: USD 20.000M', 'Pagos: USD 7.200M'] },
    ];

    if (isMobile) {
      // MOBILE: Vertical stack
      const boxW = w - 40;
      const boxH = 100;
      const startY = 55;
      const gap = 16;
      const arrowH = 20;

      pillars.forEach((p, i) => {
        const by = startY + i * (boxH + gap + arrowH);

        // Box
        svg.append('rect')
          .attr('x', 20).attr('y', by)
          .attr('width', boxW).attr('height', boxH)
          .attr('fill', p.color).attr('opacity', 0.06)
          .attr('rx', 8);
        svg.append('rect')
          .attr('x', 20).attr('y', by)
          .attr('width', 4).attr('height', boxH)
          .attr('fill', p.color).attr('rx', '4 0 0 4');

        // Label
        svg.append('text').attr('x', 36).attr('y', by + 24)
          .attr('font-size', 14).attr('font-weight', 800)
          .attr('fill', p.color).attr('letter-spacing', '0.08em')
          .text(p.label);

        // Description
        svg.append('text').attr('x', 36).attr('y', by + 42)
          .attr('font-size', 10).attr('fill', '#B69476')
          .text(p.desc);

        // Stats
        p.stats.forEach((s, si) => {
          svg.append('text').attr('x', 36).attr('y', by + 60 + si * 14)
            .attr('font-size', 10)
            .attr('fill', si === 0 ? '#3B3231' : '#7B5137')
            .attr('font-weight', si === 0 ? 700 : 400)
            .text(s);
        });

        // Arrow down (except last)
        if (i < pillars.length - 1) {
          const ay = by + boxH + arrowH / 2 + 2;
          svg.append('text').attr('x', cx).attr('y', ay)
            .attr('text-anchor', 'middle')
            .attr('font-size', 18).attr('fill', '#DFBFA1')
            .text('↓');
        }
      });

      // Result box at bottom
      const resultY = startY + pillars.length * (boxH + gap + arrowH) - arrowH + 10;
      svg.append('rect')
        .attr('x', 20).attr('y', resultY)
        .attr('width', boxW).attr('height', 44)
        .attr('fill', '#f0e6da').attr('rx', 8);
      svg.append('text').attr('x', cx).attr('y', resultY + 18)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10).attr('fill', '#B69476')
        .text('= Superávit fiscal = no emitir = inflación');
      svg.append('text').attr('x', cx).attr('y', resultY + 34)
        .attr('text-anchor', 'middle')
        .attr('font-size', 16).attr('font-weight', 900).attr('fill', '#16a34a')
        .text('211% → 32,4%');

    } else {
      // DESKTOP: Three columns, centered and narrower
      const maxW = 580;
      const totalW = Math.min(w, maxW);
      const offsetX = (w - totalW) / 2;
      const colGap = 14;
      const colW = (totalW - colGap * 2) / 3;
      const boxTop = 55;
      const boxH = 190;

      pillars.forEach((p, i) => {
        const bx = offsetX + i * (colW + colGap);

        // Box
        svg.append('rect')
          .attr('x', bx).attr('y', boxTop)
          .attr('width', colW).attr('height', boxH)
          .attr('fill', p.color).attr('opacity', 0.06)
          .attr('rx', 8);
        svg.append('rect')
          .attr('x', bx).attr('y', boxTop)
          .attr('width', colW).attr('height', 4)
          .attr('fill', p.color).attr('rx', '8 8 0 0');

        // Label centered
        svg.append('text').attr('x', bx + colW / 2).attr('y', boxTop + 34)
          .attr('text-anchor', 'middle')
          .attr('font-size', 14).attr('font-weight', 800)
          .attr('fill', p.color).attr('letter-spacing', '0.08em')
          .text(p.label);

        // Description
        svg.append('text').attr('x', bx + colW / 2).attr('y', boxTop + 52)
          .attr('text-anchor', 'middle')
          .attr('font-size', 10).attr('fill', '#B69476')
          .text(p.desc);

        // Divider
        svg.append('line')
          .attr('x1', bx + 16).attr('x2', bx + colW - 16)
          .attr('y1', boxTop + 64).attr('y2', boxTop + 64)
          .attr('stroke', '#DFBFA1').attr('stroke-width', 1);

        // Stats
        p.stats.forEach((s, si) => {
          svg.append('text').attr('x', bx + colW / 2).attr('y', boxTop + 84 + si * 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', 11)
            .attr('fill', si === 0 ? '#3B3231' : '#7B5137')
            .attr('font-weight', si === 0 ? 700 : 400)
            .text(s);
        });

        // Small arrows between columns
        if (i < pillars.length - 1) {
          const ax = bx + colW + colGap / 2;
          svg.append('text').attr('x', ax).attr('y', boxTop + boxH / 2 + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', 16).attr('fill', '#DFBFA1')
            .text('→');
        }
      });

      // Result centered below (no return arrow)
      const resultY = boxTop + boxH + 20;
      const resultW = 320;
      svg.append('rect')
        .attr('x', cx - resultW / 2).attr('y', resultY)
        .attr('width', resultW).attr('height', 44)
        .attr('fill', '#f0e6da').attr('rx', 8);
      svg.append('text').attr('x', cx).attr('y', resultY + 17)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10).attr('fill', '#B69476')
        .text('= Superávit fiscal = no emitir = inflación');
      svg.append('text').attr('x', cx).attr('y', resultY + 35)
        .attr('text-anchor', 'middle')
        .attr('font-size', 18).attr('font-weight', 900).attr('fill', '#16a34a')
        .text('211% → 32,4%');
    }
  })();
