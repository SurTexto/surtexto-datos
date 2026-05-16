  (function() {
    const container = document.getElementById('viz-privatizaciones');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const data = [
      { name: 'AYSA', sector: 'AGUA/SANEA.', estado: 'LICITACIÓN', alert: true, detail: '14M PERS · 30 AÑOS · USD 500M' },
      { name: 'HIDROVÍA P-P', sector: 'COM. EXTER.', estado: 'PREPARACIÓN', alert: true, detail: '80% EXPORT AGROINDUSTRIALES' },
      { name: 'CORRED. VIALES', sector: 'RUTAS', estado: 'EN PROCESO', alert: false, detail: 'CONCESIÓN RUTAS NAC.' },
      { name: 'BELGRANO CARG.', sector: 'FERROCARRIL', estado: 'PRIORIDAD', alert: false, detail: 'CARGA GRANELERA' },
      { name: 'TRENES ARG.', sector: 'TRANSPORTE', estado: 'EN PROCESO', alert: false, detail: 'LEY BASES' },
      { name: 'ENARSA', sector: 'ENERGÍA', estado: 'EN PROCESO', alert: false, detail: 'COMERCIALIZADORA' },
      { name: 'NUCLEOELÉCT.', sector: 'NUCLEAR', estado: 'EN PROCESO', alert: false, detail: 'ATUCHA + EMBALSE' },
      { name: 'INTERCARGO', sector: 'AVIACIÓN', estado: 'EN PROCESO', alert: false, detail: 'HANDLING AEROP.' },
      { name: 'TRANSENER', sector: 'ELECTRIC.', estado: 'EN ESTUDIO', alert: false, detail: 'RED ALTA TENSIÓN' },
      { name: '4 REPRESAS', sector: 'HIDROELÉC.', estado: 'EN ESTUDIO', alert: false, detail: 'CONCESIONES' },
      { name: 'RÍO TURBIO', sector: 'MINERÍA', estado: 'EN PROCESO', alert: false, detail: 'CARBÓN · STA. CRUZ' },
    ];

    const w = container.clientWidth;
    const rowH = isMobile ? 34 : 36;
    const headerH = 70;
    const colHeaderH = 28;
    const h = headerH + colHeaderH + data.length * rowH + 36;
    const pad = 20;
    const inset = isMobile ? 0 : Math.floor(w * 0.06);

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', "'Courier New', Consolas, monospace");

    // SurTexto palette for terminal
    const T = {
      bg: '#3B3231', bgAlt: '#342D2C', bgHeader: '#2E2827', bgAlert: '#3F2A28',
      accent: '#C67132', red: '#C41E3A', gold: '#ECB033', green: '#7B9A6D',
      dim: '#B69476', muted: '#8A7568', bright: '#DFBFA1', white: '#f0e6da',
    };

    // Background
    svg.append('rect').attr('x', inset).attr('width', w - inset * 2).attr('height', h).attr('fill', T.bg).attr('rx', 6);

    // Top bar
    svg.append('rect').attr('x', inset).attr('width', w - inset * 2).attr('height', 4).attr('fill', T.accent).attr('rx', '6 6 0 0');

    const L = inset + pad;
    const R = w - inset - pad;

    // Header
    svg.append('text').attr('x', L).attr('y', 30)
      .attr('font-size', isMobile ? 15 : 18).attr('font-weight', 700).attr('fill', T.accent)
      .text('PRIVATIZACIONES ARG');
    svg.append('text').attr('x', R).attr('y', 30)
      .attr('text-anchor', 'end')
      .attr('font-size', isMobile ? 10 : 12).attr('fill', T.dim)
      .text('LEY BASES 2024 · MAY 2026');

    // Blinking cursor
    svg.append('rect').attr('x', L).attr('y', 42).attr('width', 8).attr('height', 2).attr('fill', T.accent).attr('opacity', 0.6);

    svg.append('text').attr('x', L).attr('y', 58)
      .attr('font-size', isMobile ? 10 : 12).attr('fill', T.green)
      .text(isMobile ? '11 ACTIVOS EN PROCESO' : '11 EMPRESAS/ACTIVOS EN PROCESO DE PRIVATIZACIÓN');

    // Column headers
    const tableY = headerH;
    const iw = w - inset * 2; // inner width
    const cols = isMobile
      ? { name: L, sector: inset + iw * 0.40, estado: inset + iw * 0.65, detail: null }
      : { name: L, sector: inset + iw * 0.30, estado: inset + iw * 0.48, detail: inset + iw * 0.65 };

    svg.append('rect').attr('x', inset).attr('y', tableY).attr('width', iw).attr('height', colHeaderH).attr('fill', T.bgHeader);

    svg.append('text').attr('x', cols.name).attr('y', tableY + 18)
      .attr('font-size', isMobile ? 10 : 11).attr('fill', T.bright).text('EMPRESA');
    svg.append('text').attr('x', cols.sector).attr('y', tableY + 18)
      .attr('font-size', isMobile ? 10 : 11).attr('fill', T.bright).text('SECTOR');
    svg.append('text').attr('x', cols.estado).attr('y', tableY + 18)
      .attr('font-size', isMobile ? 10 : 11).attr('fill', T.bright).text('ESTADO');
    if (cols.detail) {
      svg.append('text').attr('x', cols.detail).attr('y', tableY + 18)
        .attr('font-size', isMobile ? 10 : 11).attr('fill', T.bright).text('DETALLE');
    }

    // Rows
    data.forEach((d, i) => {
      const ry = tableY + colHeaderH + i * rowH;
      const isEven = i % 2 === 0;

      // Row background
      svg.append('rect')
        .attr('x', inset).attr('y', ry)
        .attr('width', iw).attr('height', rowH)
        .attr('fill', d.alert ? T.bgAlert : (isEven ? T.bgAlt : T.bg));

      // Alert indicator
      if (d.alert) {
        svg.append('rect')
          .attr('x', inset).attr('y', ry)
          .attr('width', 3).attr('height', rowH)
          .attr('fill', T.red);
      }

      // Name
      svg.append('text').attr('x', cols.name).attr('y', ry + rowH / 2)
        .attr('dy', '0.35em')
        .attr('font-size', isMobile ? 12 : 13)
        .attr('font-weight', d.alert ? 700 : 400)
        .attr('fill', d.alert ? T.accent : T.white)
        .text(d.name);

      // Sector
      svg.append('text').attr('x', cols.sector).attr('y', ry + rowH / 2)
        .attr('dy', '0.35em')
        .attr('font-size', isMobile ? 11 : 12)
        .attr('fill', T.bright)
        .text(d.sector);

      // Estado with color coding
      const estadoColors = {
        'LICITACIÓN': T.red,
        'PREPARACIÓN': T.accent,
        'PRIORIDAD': T.gold,
        'EN PROCESO': T.green,
        'EN ESTUDIO': T.muted,
      };
      const eColor = estadoColors[d.estado] || '#555577';

      // Status dot (blinking)
      const dot = svg.append('circle')
        .attr('cx', cols.estado).attr('cy', ry + rowH / 2)
        .attr('r', 3).attr('fill', eColor);

      const statusText = svg.append('text').attr('x', cols.estado + 10).attr('y', ry + rowH / 2)
        .attr('dy', '0.35em')
        .attr('font-size', isMobile ? 11 : 12)
        .attr('font-weight', 600)
        .attr('fill', eColor)
        .text(d.estado);

      // Blink animation for active statuses
      if (d.estado !== 'EN ESTUDIO') {
        const blinkSpeed = d.alert ? 800 : 1500 + i * 200;
        function blink() {
          dot.transition().duration(blinkSpeed * 0.4).attr('opacity', 0.2)
            .transition().duration(blinkSpeed * 0.6).attr('opacity', 1)
            .on('end', blink);
          statusText.transition().duration(blinkSpeed * 0.4).attr('opacity', 0.4)
            .transition().duration(blinkSpeed * 0.6).attr('opacity', 1);
        }
        setTimeout(blink, i * 150);
      }

      // Detail (desktop only)
      if (cols.detail) {
        svg.append('text').attr('x', cols.detail).attr('y', ry + rowH / 2)
          .attr('dy', '0.35em')
          .attr('font-size', isMobile ? 10 : 11)
          .attr('fill', d.alert ? T.accent : T.dim)
          .text(d.detail);
      }
    });

    // Bottom status bar
    const bottomY = h - 28;
    svg.append('rect').attr('x', inset).attr('y', bottomY).attr('width', iw).attr('height', 28)
      .attr('fill', T.bgHeader).attr('rx', '0 0 6 6');
    svg.append('text').attr('x', L).attr('y', bottomY + 18)
      .attr('font-size', isMobile ? 10 : 11).attr('fill', T.green)
      .text(isMobile ? 'AYSA: USD 36/PERSONA · USD 1,2/PERS/AÑO' : 'AYSA: USD 500M ÷ 14M PERSONAS = USD 36/PERSONA · USD 1,2/PERSONA/AÑO');
    const liveText = svg.append('text').attr('x', R).attr('y', bottomY + 18)
      .attr('text-anchor', 'end')
      .attr('font-size', isMobile ? 10 : 11).attr('fill', T.red)
      .text('▮ LIVE');

    // LIVE blinks
    function blinkLive() {
      liveText.transition().duration(500).attr('opacity', 0.2)
        .transition().duration(500).attr('opacity', 1)
        .on('end', blinkLive);
    }
    blinkLive();
  })();
