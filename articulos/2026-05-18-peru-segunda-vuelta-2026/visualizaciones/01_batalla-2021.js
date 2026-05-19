// VIZ 1: La batalla de 2021
// Requiere D3 v7: https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js
// Montar en: <div id="viz-margen"></div>

(function() {
    const container = document.getElementById('viz-margen');
    if (!container) return;
    const isMobile = window.innerWidth < 640;
    const w = container.clientWidth || 600;
    const h = isMobile ? 200 : 240;
    const pad = isMobile ? { t: 44, r: 16, b: 50, l: 16 } : { t: 52, r: 24, b: 60, l: 24 };

    const svg = d3.select(container).append('svg')
      .attr('width', w).attr('height', h);

    const castillo = 50.126;
    const keiko = 49.874;
    const barH = isMobile ? 52 : 64;
    const barY = h / 2 - barH / 2;
    const midX = w * castillo / 100;

    // Fondo
    svg.append('rect').attr('width', w).attr('height', h).attr('fill', '#FAF7F2');

    // Barra Castillo (izquierda, rojo)
    svg.append('rect')
      .attr('x', 0).attr('y', barY).attr('width', midX).attr('height', barH)
      .attr('fill', '#C41E3A');

    // Barra Keiko (derecha, ocre)
    svg.append('rect')
      .attr('x', midX).attr('y', barY).attr('width', w - midX).attr('height', barH)
      .attr('fill', '#C67132');

    // Línea divisoria
    svg.append('line')
      .attr('x1', midX).attr('y1', barY - 8).attr('x2', midX).attr('y2', barY + barH + 8)
      .attr('stroke', '#FAF7F2').attr('stroke-width', 2);

    // Porcentajes dentro de barra
    const fsMain = isMobile ? 22 : 28;
    const fsSub = isMobile ? 10 : 12;

    svg.append('text').attr('x', midX / 2).attr('y', barY + barH / 2 - 4)
      .attr('text-anchor', 'middle').attr('font-size', fsMain).attr('font-weight', 900)
      .attr('fill', 'white').text('50,13%');
    svg.append('text').attr('x', midX / 2).attr('y', barY + barH / 2 + (isMobile ? 14 : 18))
      .attr('text-anchor', 'middle').attr('font-size', fsSub).attr('fill', 'rgba(255,255,255,0.85)')
      .text('Pedro Castillo');

    svg.append('text').attr('x', midX + (w - midX) / 2).attr('y', barY + barH / 2 - 4)
      .attr('text-anchor', 'middle').attr('font-size', fsMain).attr('font-weight', 900)
      .attr('fill', 'white').text('49,87%');
    svg.append('text').attr('x', midX + (w - midX) / 2).attr('y', barY + barH / 2 + (isMobile ? 14 : 18))
      .attr('text-anchor', 'middle').attr('font-size', fsSub).attr('fill', 'rgba(255,255,255,0.85)')
      .text('Keiko Fujimori');

    // Título arriba
    svg.append('text').attr('x', w / 2).attr('y', isMobile ? 18 : 22)
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 13 : 16)
      .attr('font-weight', 700).attr('fill', '#3B3231')
      .text('Segunda vuelta 2021: el margen más estrecho');

    svg.append('text').attr('x', w / 2).attr('y', isMobile ? 32 : 38)
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 9 : 10)
      .attr('fill', '#7B5137')
      .text('44.263 votos de diferencia sobre 17,6 millones válidos — 0,25%');

    // Etiqueta del margen abajo
    const arrowY = barY + barH + (isMobile ? 18 : 22);
    svg.append('line')
      .attr('x1', midX - (isMobile ? 36 : 50)).attr('y1', arrowY)
      .attr('x2', midX + (isMobile ? 36 : 50)).attr('y2', arrowY)
      .attr('stroke', '#3B3231').attr('stroke-width', 1);
    svg.append('text').attr('x', midX).attr('y', arrowY + (isMobile ? 12 : 14))
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 8 : 9)
      .attr('fill', '#7B5137').attr('font-style', 'italic')
      .text('← 44.263 votos →');

    // 43 días nota
    svg.append('text').attr('x', w - pad.r).attr('y', h - (isMobile ? 8 : 10))
      .attr('text-anchor', 'end').attr('font-size', isMobile ? 8 : 9)
      .attr('fill', '#B69476').attr('font-style', 'italic')
      .text('Proclamación oficial: 43 días después de la votación');
  })();
