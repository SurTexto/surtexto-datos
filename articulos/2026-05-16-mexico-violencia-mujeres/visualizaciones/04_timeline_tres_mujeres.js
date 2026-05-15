  (function() {
    const container = document.getElementById('viz-timeline');
    if (!container) return;

    const cables = [
      { date: '13 may', name: 'Lucía Guadalupe Mora', detail: '53 años, maestra, dirigente de Morena. Baleada en Chihuahua.', status: 'Asesinada' },
      { date: '13 may', name: 'María Elena Ríos', detail: 'Saxofonista atacada con ácido en 2019. 7 años sin sentencia.', status: 'Corte descarta su caso' },
      { date: '14 may', name: 'Fátima Quintana', detail: 'Asesinada a los 12 años en 2015. Fallo histórico incumplido.', status: 'Cero cumplimiento' }
    ];

    const isMobile = window.innerWidth < 640;
    const width = container.clientWidth;
    const cardH = isMobile ? 90 : 80;
    const gap = 16;
    const maxW = Math.min(width - (isMobile ? 16 : 40), 600);
    const height = cables.length * (cardH + gap) + 80;
    const startX = isMobile ? 8 : (width - maxW) / 2;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Title centered
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Montserrat, sans-serif')
      .attr('font-size', isMobile ? '13px' : '15px')
      .attr('font-weight', '700')
      .attr('fill', '#3B3231')
      .text('Tres mujeres, una semana: 13-14 de mayo 2026');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 34)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11px')
      .attr('fill', '#B69476')
      .text('Cables de Agencia EFE curados por SurTexto');

    // Timeline line centered
    const lineX = startX + 50;
    svg.append('line')
      .attr('x1', lineX).attr('y1', 50)
      .attr('x2', lineX).attr('y2', 50 + cables.length * (cardH + gap))
      .attr('stroke', '#C41E3A')
      .attr('stroke-width', 2)
      .attr('opacity', 0.3);

    cables.forEach((c, i) => {
      const yPos = 55 + i * (cardH + gap);

      // Dot
      svg.append('circle')
        .attr('cx', lineX)
        .attr('cy', yPos + cardH / 2)
        .attr('r', 6)
        .attr('fill', '#C41E3A');

      // Date
      svg.append('text')
        .attr('x', lineX - 14)
        .attr('y', yPos + cardH / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('font-family', 'Montserrat, sans-serif')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .attr('fill', '#C41E3A')
        .text(c.date);

      // Card background
      const cardX = lineX + 16;
      const cardW = isMobile ? maxW - 80 : maxW - 70;
      svg.append('rect')
        .attr('x', cardX)
        .attr('y', yPos)
        .attr('width', cardW)
        .attr('height', cardH)
        .attr('rx', 6)
        .attr('fill', '#C41E3A')
        .attr('opacity', 0.05);

      svg.append('rect')
        .attr('x', cardX)
        .attr('y', yPos)
        .attr('width', 3)
        .attr('height', cardH)
        .attr('fill', '#C41E3A')
        .attr('rx', 1);

      // Name
      svg.append('text')
        .attr('x', cardX + 14)
        .attr('y', yPos + 22)
        .attr('font-family', 'Montserrat, sans-serif')
        .attr('font-size', isMobile ? '13px' : '15px')
        .attr('font-weight', '700')
        .attr('fill', '#C41E3A')
        .text(c.name);

      // Detail
      svg.append('text')
        .attr('x', cardX + 14)
        .attr('y', yPos + 40)
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-size', isMobile ? '10px' : '12px')
        .attr('fill', '#3B3231')
        .text(c.detail);

      // Status
      svg.append('text')
        .attr('x', cardX + 14)
        .attr('y', yPos + 58)
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-size', isMobile ? '9px' : '10px')
        .attr('font-weight', '600')
        .attr('fill', '#7B5137')
        .text(c.status);
    });
  })();
