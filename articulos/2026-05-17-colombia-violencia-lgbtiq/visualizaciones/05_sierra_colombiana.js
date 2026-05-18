// VIZ 5 — Colombia: violencia LGBTIQ+ 2025
// Requiere D3.js v7: https://cdn.jsdelivr.net/npm/d3@7

(function() {
    const container = document.getElementById('viz-paradoja');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const w = Math.min(container.clientWidth || 600, 680);
    const h = isMobile ? 420 : 440;
    const cx = w / 2;
    const gY = h - 50;
    const peakY = isMobile ? 130 : 125;
    const textTop = 54;

    // Zonas de texto — margen interno de cada ladera
    const lPadX   = isMobile ? 14 : 18;   // margen izq
    const lEndX   = cx * 0.58;            // columna izq termina aquí
    const lCenter = cx * 0.36;
    const rStartX = cx + cx * 0.22;       // columna der empieza aquí
    const rCenter = cx + (w - cx) * 0.50;

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`)
      .attr('width', w)
      .style('display', 'block')
      .style('margin', '0 auto')
      .style('font-family', 'Inter, sans-serif');

    const defs = svg.append('defs');

    // ClipPaths para fondos de ladera
    defs.append('clipPath').attr('id', 'sierraLeft')
      .append('rect').attr('x', 0).attr('y', 0).attr('width', cx).attr('height', h);
    defs.append('clipPath').attr('id', 'sierraRight')
      .append('rect').attr('x', cx).attr('y', 0).attr('width', cx).attr('height', h);

    // ── Fondos de ladera ──
    svg.append('rect').attr('x', 0).attr('y', 0).attr('width', w).attr('height', h)
      .attr('fill', '#EBF4EE').attr('clip-path', 'url(#sierraLeft)');
    svg.append('rect').attr('x', 0).attr('y', 0).attr('width', w).attr('height', h)
      .attr('fill', '#FDE8E8').attr('clip-path', 'url(#sierraRight)');

    // ── Perfil de la sierra (tres cordilleras colombianas) ──
    const s = w / 600;  // factor de escala
    const peak2L = peakY + (gY - peakY) * 0.38;   // cima Cord. Occidental
    const peak2R = peakY + (gY - peakY) * 0.35;   // cima Cord. Oriental
    const valL   = peakY + (gY - peakY) * 0.52;   // valle interandino izq
    const valR   = peakY + (gY - peakY) * 0.50;   // valle interandino der

    const mountain = [
      `M 0 ${h}`,
      `L 0 ${gY}`,
      `C ${w*0.06} ${gY} ${w*0.10} ${gY-20*s} ${w*0.17} ${gY-45*s}`,
      `L ${w*0.24} ${peak2L}`,                // CORD. OCCIDENTAL
      `C ${w*0.27} ${peak2L+10} ${w*0.29} ${valL} ${w*0.33} ${valL}`,
      `C ${w*0.37} ${valL} ${w*0.40} ${peakY+30} ${w*0.44} ${peakY+10}`,
      `L ${cx} ${peakY}`,                     // CIMA — CORD. CENTRAL
      `L ${w*0.56} ${peakY+10}`,
      `C ${w*0.60} ${peakY+30} ${w*0.63} ${valR} ${w*0.67} ${valR}`,
      `C ${w*0.71} ${valR} ${w*0.73} ${peak2R+10} ${w*0.76} ${peak2R}`,
      `L ${w*0.76} ${peak2R}`,                // CORD. ORIENTAL
      `C ${w*0.80} ${peak2R+10} ${w*0.84} ${gY-40*s} ${w*0.90} ${gY-20*s}`,
      `L ${w*0.95} ${gY}`,
      `L ${w} ${gY}`,
      `L ${w} ${h}`,
      `Z`
    ].join(' ');

    svg.append('path').attr('d', mountain).attr('fill', '#3B3231');

    // Nieve en la cima
    const snow = `M ${cx} ${peakY} L ${cx-14} ${peakY+22} L ${cx+14} ${peakY+22} Z`;
    svg.append('path').attr('d', snow).attr('fill', 'white').attr('opacity', 0.85);

    // Línea de tierra
    svg.append('line')
      .attr('x1', 0).attr('y1', gY).attr('x2', w).attr('y2', gY)
      .attr('stroke', '#B69476').attr('stroke-width', 0.8).attr('opacity', 0.5);

    // ── Título ──
    svg.append('text').attr('x', cx).attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 13 : 16).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('La misma sierra, dos realidades');
    svg.append('text').attr('x', cx).attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 9 : 10).attr('fill', '#B69476')
      .text('Colombia LGBTIQ+ — en el papel y en la práctica');

    // ── LADERA IZQUIERDA: EN EL PAPEL ──
    const lPad = isMobile ? 12 : 16;
    const lfsItem = isMobile ? 10 : 12;
    const lRow = isMobile ? 26 : 30;

    svg.append('text').attr('x', lCenter).attr('y', textTop + 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 8 : 9).attr('font-weight', 700)
      .attr('fill', '#2C6E49').attr('letter-spacing', '0.07em')
      .text('EN EL PAPEL');

    [
      ['✓', 'Matrimonio igualitario', '2016'],
      ['✓', 'Adopción homoparental', '2015'],
      ['✓', 'Ley antidiscriminación', '2011'],
      ['✓', 'Identidad de género', '2015'],
    ].forEach(function(d, i) {
      const ty = textTop + 22 + i * lRow;
      svg.append('text').attr('x', lPad).attr('y', ty)
        .attr('font-size', isMobile ? 11 : 13).attr('font-weight', 700).attr('fill', '#2C6E49')
        .text(d[0]);
      svg.append('text').attr('x', lPad + 16).attr('y', ty)
        .attr('font-size', lfsItem).attr('font-weight', 600).attr('fill', '#2C6E49')
        .text(d[1]);
      // Año alineado al borde de la zona izquierda
      svg.append('text').attr('x', lEndX - 4).attr('y', ty)
        .attr('text-anchor', 'end')
        .attr('font-size', isMobile ? 8 : 9).attr('fill', '#2C6E49').attr('opacity', 0.55)
        .text(d[2]);
    });

    // ── LADERA DERECHA: EN LA PRÁCTICA — cuadrícula 2×2 ──
    const rfsNum = isMobile ? 22 : 26;
    const rColL  = cx + (w - cx) * 0.35;  // columna izq del 2×2
    const rColR  = cx + (w - cx) * 0.65;  // columna der del 2×2
    const rRowH  = isMobile ? 46 : 52;    // altura de cada fila

    svg.append('text').attr('x', rCenter).attr('y', textTop + 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 8 : 9).attr('font-weight', 700)
      .attr('fill', '#C41E3A').attr('letter-spacing', '0.07em')
      .text('EN LA PRÁCTICA');

    [
      ['270',  'homicidios'],
      ['+63%', 'vs. 2024'],
      ['86%',  'sin condena'],
      ['#1',   'en LAC'],
    ].forEach(function(d, i) {
      const col = i % 2 === 0 ? rColL : rColR;
      const row = Math.floor(i / 2);
      const ty  = textTop + 22 + row * rRowH;
      svg.append('text').attr('x', col).attr('y', ty + (isMobile ? 20 : 24))
        .attr('text-anchor', 'middle')
        .attr('font-size', rfsNum).attr('font-weight', 900)
        .attr('fill', '#C41E3A')
        .text(d[0]);
      svg.append('text').attr('x', col).attr('y', ty + (isMobile ? 33 : 38))
        .attr('text-anchor', 'middle')
        .attr('font-size', isMobile ? 8 : 9).attr('fill', '#7B5137')
        .text(d[1]);
    });

    // Etiquetas de cordilleras al pie
    [
      [w*0.24, 'Cord. Occidental'],
      [cx,     'Cord. Central'],
      [w*0.76, 'Cord. Oriental'],
    ].forEach(function(d) {
      svg.append('text').attr('x', d[0]).attr('y', gY + 16)
        .attr('text-anchor', 'middle')
        .attr('font-size', isMobile ? 6 : 7).attr('fill', '#B69476').attr('font-style', 'italic')
        .text(d[1]);
    });
  })();