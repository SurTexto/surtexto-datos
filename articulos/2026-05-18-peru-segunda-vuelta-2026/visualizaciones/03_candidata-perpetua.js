// VIZ 3: Keiko — tres veces cerca del 50%
// Requiere D3 v7: https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js
// Montar en: <div id="viz-fraude"></div>

(function() {
    const container = document.getElementById('viz-fraude');
    if (!container) return;
    const isMobile = window.innerWidth < 640;
    const w = container.clientWidth || 600;
    const h = isMobile ? 300 : 340;

    const svg = d3.select(container).append('svg')
      .attr('width', w).attr('height', h);

    svg.append('rect').attr('width', w).attr('height', h).attr('fill', '#FAF7F2');

    svg.append('text').attr('x', w / 2).attr('y', isMobile ? 18 : 22)
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 13 : 16)
      .attr('font-weight', 700).attr('fill', '#3B3231')
      .text('Keiko Fujimori: tres finales, nunca 50%');

    svg.append('text').attr('x', w / 2).attr('y', isMobile ? 32 : 38)
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 9 : 10)
      .attr('fill', '#7B5137')
      .text('Resultados en segunda vuelta — 2011, 2016, 2021');

    // Datos
    const datos = [
      {
        año: '2011', rival: 'Humala',
        keiko: 48.55, rival_pct: 51.45,
        margen: '461.746 votos',
        fraude: false, nota: null,
      },
      {
        año: '2016', rival: 'Kuczynski',
        keiko: 49.88, rival_pct: 50.12,
        margen: '42.595 votos',
        fraude: false, nota: null,
      },
      {
        año: '2021', rival: 'Castillo',
        keiko: 49.87, rival_pct: 50.13,
        margen: '44.263 votos',
        fraude: true,
        nota: 'Impugna 1.300 actas · 43 días bloqueando · UE: sin fraude',
      },
    ];

    const padL  = isMobile ? 44 : 58;
    const padR  = isMobile ? 12 : 16;
    const rowH  = isMobile ? 68 : 78;
    const startY = isMobile ? 52 : 62;
    const barH  = isMobile ? 24 : 28;
    const chartW = w - padL - padR;

    // Dominio: 46% → 52%, con clipPath para no salirse
    const domMin = 46, domMax = 52;
    function xS(pct) {
      return padL + Math.min((pct - domMin) / (domMax - domMin), 1) * chartW;
    }

    // ClipPath para que las barras no se salgan
    const clipId = 'keiko-clip';
    svg.append('defs').append('clipPath').attr('id', clipId)
      .append('rect').attr('x', padL).attr('y', 0).attr('width', chartW).attr('height', h);

    const chartG = svg.append('g').attr('clip-path', 'url(#' + clipId + ')');

    // Línea 50%
    const x50 = xS(50);
    svg.append('line')
      .attr('x1', x50).attr('y1', startY - 10)
      .attr('x2', x50).attr('y2', startY + datos.length * rowH + 4)
      .attr('stroke', '#2C6E49').attr('stroke-width', 1.2).attr('stroke-dasharray', '5,3');
    svg.append('text').attr('x', x50).attr('y', startY - 14)
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 8 : 9)
      .attr('font-weight', 700).attr('fill', '#2C6E49').text('50%');

    // Eje X
    [47, 48, 49, 50, 51].forEach(function(v) {
      const x = xS(v);
      if (x <= padL + chartW) {
        svg.append('text').attr('x', x).attr('y', startY + datos.length * rowH + (isMobile ? 16 : 18))
          .attr('text-anchor', 'middle').attr('font-size', isMobile ? 7 : 8)
          .attr('fill', '#B69476').text(v + '%');
      }
    });

    datos.forEach(function(d, i) {
      const y = startY + i * rowH;
      const x0     = xS(domMin);
      const xKeiko = xS(d.keiko);
      const xRival = xS(d.rival_pct);
      const kColor = d.fraude ? '#C41E3A' : '#C67132';

      // Año label
      svg.append('text').attr('x', padL - 6).attr('y', y + barH / 2 + 5)
        .attr('text-anchor', 'end').attr('font-size', isMobile ? 11 : 13)
        .attr('font-weight', 700).attr('fill', d.fraude ? '#C41E3A' : '#3B3231')
        .text(d.año);

      // Barra rival (gris, dentro del clip)
      chartG.append('rect')
        .attr('x', xKeiko).attr('y', y)
        .attr('width', Math.max(0, xRival - xKeiko)).attr('height', barH)
        .attr('fill', '#D4C4B0').attr('rx', 2);

      // Barra Keiko (dentro del clip)
      chartG.append('rect')
        .attr('x', x0).attr('y', y)
        .attr('width', xKeiko - x0).attr('height', barH)
        .attr('fill', kColor).attr('rx', 2);

      // "Keiko" label dentro de la barra (izquierda)
      svg.append('text').attr('x', x0 + 6).attr('y', y + barH / 2 + 4)
        .attr('font-size', isMobile ? 8 : 9).attr('font-weight', 700)
        .attr('fill', 'rgba(255,255,255,0.85)').text('Keiko');

      // % Keiko (cerca del fin de su barra)
      svg.append('text').attr('x', Math.min(xKeiko - 4, padL + chartW - 4)).attr('y', y + barH / 2 + 5)
        .attr('text-anchor', 'end').attr('font-size', isMobile ? 11 : 13)
        .attr('font-weight', 900).attr('fill', 'white').text(d.keiko + '%');

      // Rival info: debajo de la barra
      const sub1Y = y + barH + (isMobile ? 12 : 14);
      svg.append('text').attr('x', x0).attr('y', sub1Y)
        .attr('font-size', isMobile ? 8 : 9).attr('fill', '#7B5137')
        .text('vs. ' + d.rival + ' ' + d.rival_pct + '% · Diferencia: ' + d.margen);

      if (d.nota) {
        svg.append('text').attr('x', x0).attr('y', sub1Y + (isMobile ? 12 : 14))
          .attr('font-size', isMobile ? 8 : 9).attr('font-weight', 600)
          .attr('fill', '#C41E3A').text('↳ ' + d.nota);
      }
    });

    // Nota pie
    svg.append('text').attr('x', w / 2).attr('y', h - (isMobile ? 8 : 10))
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 8 : 9)
      .attr('fill', '#B69476').attr('font-style', 'italic')
      .text('En 2026 llega a segunda vuelta con solo 17,19% de primera vuelta · 7 jun');
  })();
