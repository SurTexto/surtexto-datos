// VIZ 4: El rematch 2026
// Requiere D3 v7: https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js
// Montar en: <div id="viz-rematch"></div>

(function() {
    const container = document.getElementById('viz-rematch');
    if (!container) return;
    const isMobile = window.innerWidth < 640;
    const w = container.clientWidth || 600;
    const h = isMobile ? 260 : 300;

    const svg = d3.select(container).append('svg')
      .attr('width', w).attr('height', h);

    svg.append('rect').attr('width', w).attr('height', h).attr('fill', '#FAF7F2');

    // Título
    svg.append('text').attr('x', w / 2).attr('y', isMobile ? 18 : 22)
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 13 : 16)
      .attr('font-weight', 700).attr('fill', '#3B3231')
      .text('Segunda vuelta · 7 de junio de 2026');

    // Dos candidatos
    const candidatos = [
      {
        nombre: 'Keiko Fujimori',
        partido: 'Fuerza Popular',
        pct: '17,19%',
        votos: '2.877.678',
        color: '#C67132',
        lado: 'izquierda',
        datos: [
          'Derecha · continuidad económica',
          'Hija de Alberto Fujimori',
          '4ª candidatura presidencial',
          '3 segundas vueltas previas',
        ],
      },
      {
        nombre: 'Roberto Sánchez',
        partido: 'Juntos por el Perú',
        pct: '12,03%',
        votos: '2.015.114',
        color: '#C41E3A',
        lado: 'derecha',
        datos: [
          'Izquierda · redistribución',
          'Único ministro que sobrevivió a Castillo',
          'Propone liberar a Castillo',
          'Salario mínimo: S/1.130 → S/1.500',
        ],
      },
    ];

    const colW = w / 2;
    const headH = isMobile ? 72 : 86;
    const startY = isMobile ? 38 : 44;
    const fsItem = isMobile ? 8 : 9;

    candidatos.forEach(function(c, idx) {
      const cx = idx === 0 ? colW * 0.5 : colW + colW * 0.5;
      const xLeft = idx === 0 ? 8 : colW + 8;

      // Cabecera coloreada
      svg.append('rect')
        .attr('x', idx === 0 ? 4 : colW + 4).attr('y', startY)
        .attr('width', colW - 8).attr('height', headH)
        .attr('fill', c.color).attr('rx', 4);

      // Porcentaje grande
      svg.append('text').attr('x', cx).attr('y', startY + (isMobile ? 28 : 34))
        .attr('text-anchor', 'middle').attr('font-size', isMobile ? 26 : 32)
        .attr('font-weight', 900).attr('fill', 'white')
        .text(c.pct);

      // Nombre
      svg.append('text').attr('x', cx).attr('y', startY + (isMobile ? 44 : 54))
        .attr('text-anchor', 'middle').attr('font-size', isMobile ? 9 : 11)
        .attr('font-weight', 700).attr('fill', 'rgba(255,255,255,0.95)')
        .text(c.nombre);

      // Partido
      svg.append('text').attr('x', cx).attr('y', startY + (isMobile ? 57 : 68))
        .attr('text-anchor', 'middle').attr('font-size', isMobile ? 7 : 8)
        .attr('fill', 'rgba(255,255,255,0.75)')
        .text(c.partido);

      // Votos
      svg.append('text').attr('x', cx).attr('y', startY + headH + (isMobile ? 14 : 16))
        .attr('text-anchor', 'middle').attr('font-size', isMobile ? 8 : 9)
        .attr('fill', '#7B5137')
        .text(c.votos + ' votos (1ª vuelta)');

      // Items del perfil
      c.datos.forEach(function(item, i) {
        const iy = startY + headH + (isMobile ? 28 : 34) + i * (isMobile ? 18 : 22);
        svg.append('circle')
          .attr('cx', xLeft + (isMobile ? 6 : 8)).attr('cy', iy - 2)
          .attr('r', isMobile ? 2.5 : 3).attr('fill', c.color);
        svg.append('text').attr('x', xLeft + (isMobile ? 13 : 16)).attr('y', iy)
          .attr('font-size', fsItem).attr('fill', '#3B3231')
          .text(item);
      });
    });

    // Divisor central
    svg.append('line')
      .attr('x1', colW).attr('y1', startY)
      .attr('x2', colW).attr('y2', h - (isMobile ? 28 : 32))
      .attr('stroke', '#D4C4B0').attr('stroke-width', 1);

    // VS en el centro
    svg.append('text').attr('x', colW).attr('y', startY + headH / 2 + (isMobile ? 6 : 8))
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 11 : 14)
      .attr('font-weight', 900).attr('fill', '#FAF7F2')
      .text('VS');

    // Nota pie
    svg.append('text').attr('x', w / 2).attr('y', h - (isMobile ? 8 : 10))
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 8 : 9)
      .attr('fill', '#B69476').attr('font-style', 'italic')
      .text('Ambos representan presidentes que terminaron presos');
  })();
