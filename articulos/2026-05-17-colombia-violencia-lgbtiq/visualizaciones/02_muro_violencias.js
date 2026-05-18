// VIZ 2 — Colombia: violencia LGBTIQ+ 2025
// Requiere D3.js v7: https://cdn.jsdelivr.net/npm/d3@7

(function() {
    const container = document.getElementById('viz-piramide');
    if (!container) return;

    function buildGame() {
    container.innerHTML = '';
    const isMobile = window.innerWidth < 640;

    // Ordered by severity (least to most)
    const walls = [
      { type: ['Discriminación'], value: 360, color: '#DFBFA1' },
      { type: ['Amenazas'], value: 1184, color: '#C67132' },
      { type: ['Violencia', 'intrafamiliar'], value: 1531, color: '#B69476' },
      { type: ['Violencia', 'policial'], value: 108, color: '#8A7568' },
      { type: ['Delitos', 'sexuales'], value: 628, color: '#7B5137' },
      { type: ['Desaparición', 'forzada'], value: 17, color: '#3B3231' },
      { type: ['Homicidio'], value: 270, color: '#C41E3A' },
    ];

    const w = container.clientWidth;
    const h = isMobile ? 380 : 340;
    const groundY = h - 50;
    const personH = isMobile ? 36 : 44;

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', 'Inter, sans-serif')
      .style('cursor', 'pointer');

    svg.append('text').attr('x', w / 2).attr('y', 20).attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 13 : 16).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('La estructura de la violencia');

    // Ground line
    svg.append('line').attr('x1', 0).attr('x2', w)
      .attr('y1', groundY).attr('y2', groundY)
      .attr('stroke', '#DFBFA1').attr('stroke-width', 1);

    // Calculate wall positions
    const startX = 30;
    const endX = w - 30;
    const totalSlots = walls.length + 1;
    const slotW = (endX - startX) / totalSlots;

    // Wall thickness scale — minimum 14px so all walls are visible
    const thickScale = d3.scaleLinear().domain([0, 1600]).range([isMobile ? 6 : 8, isMobile ? 56 : 80]);

    // Draw person (starts at left)
    const personG = svg.append('g').attr('transform', `translate(${startX},${groundY})`);
    const pScale = personH / 50;
    // Head
    personG.append('circle').attr('cx', 0).attr('cy', -personH + 8 * pScale).attr('r', 7 * pScale)
      .attr('fill', '#3B3231');
    // Body
    personG.append('rect').attr('x', -4 * pScale).attr('y', -personH + 16 * pScale)
      .attr('width', 8 * pScale).attr('height', 20 * pScale).attr('rx', 3)
      .attr('fill', '#3B3231');
    // Legs
    personG.append('rect').attr('x', -4 * pScale).attr('y', -personH + 37 * pScale)
      .attr('width', 3 * pScale).attr('height', 13 * pScale).attr('rx', 1)
      .attr('fill', '#3B3231');
    personG.append('rect').attr('x', 1 * pScale).attr('y', -personH + 37 * pScale)
      .attr('width', 3 * pScale).attr('height', 13 * pScale).attr('rx', 1)
      .attr('fill', '#3B3231');

    let currentWall = -1; // -1 = not started
    let started = false;

    // Draw walls
    const wallTop = 55;
    walls.forEach((wall, i) => {
      const wallX = startX + (i + 1) * slotW;
      const thickness = thickScale(wall.value);
      const wallH = groundY - wallTop;
      const isLast = i === walls.length - 1;

      const g = svg.append('g').style('cursor', 'pointer');

      // Solid wall
      const left = wallX - thickness / 2;

      // Main fill
      g.append('rect').attr('class', 'wall-rect')
        .attr('x', left).attr('y', wallTop)
        .attr('width', thickness).attr('height', wallH)
        .attr('fill', wall.color).attr('opacity', 0.85).attr('rx', 3);

      // Subtle gradient overlay for depth
      const gradId = 'wg' + i;
      const defs = svg.append('defs');
      const grad = defs.append('linearGradient').attr('id', gradId)
        .attr('x1', '0').attr('y1', '0').attr('x2', '1').attr('y2', '0');
      grad.append('stop').attr('offset', '0%').attr('stop-color', 'white').attr('stop-opacity', 0.12);
      grad.append('stop').attr('offset', '50%').attr('stop-color', 'white').attr('stop-opacity', 0);
      grad.append('stop').attr('offset', '100%').attr('stop-color', 'black').attr('stop-opacity', 0.1);

      g.append('rect').attr('class', 'wall-rect')
        .attr('x', left).attr('y', wallTop)
        .attr('width', thickness).attr('height', wallH)
        .attr('fill', `url(#${gradId})`).attr('rx', 3);

      // Label above wall (multi-line)
      wall.type.forEach((line, li) => {
        g.append('text').attr('class', 'wall-label')
          .attr('x', wallX).attr('y', wallTop - 6 - (wall.type.length - 1 - li) * 12)
          .attr('text-anchor', 'middle')
          .attr('font-size', isMobile ? 7 : 9).attr('fill', wall.color).attr('font-weight', 600)
          .text(line);
      });

      // Value inside wall — background pill para contraste
      const valStr = '' + wall.value;
      const pillW = valStr.length * (isMobile ? 7 : 8) + 10;
      const pillH = isMobile ? 15 : 18;
      g.append('rect').attr('class', 'wall-label')
        .attr('x', wallX - pillW / 2).attr('y', wallTop + wallH / 2 - pillH / 2)
        .attr('width', pillW).attr('height', pillH)
        .attr('rx', 3).attr('fill', 'rgba(30,20,20,0.62)');
      g.append('text').attr('class', 'wall-label').attr('x', wallX).attr('y', wallTop + wallH / 2)
        .attr('text-anchor', 'middle').attr('dy', '0.35em')
        .attr('font-size', isMobile ? 10 : 12).attr('font-weight', 700).attr('fill', 'white')
        .text(wall.value);

      // Click handler
      g.on('click', function() {
        if (!started || i !== currentWall) return;

        // Shrink wall to rubble (small remnant at ground)
        const rubbleH = 12;
        g.selectAll('.wall-rect').transition().duration(500)
          .attr('y', groundY - rubbleH).attr('height', rubbleH).attr('opacity', 0.4);

        // Scatter debris upward then fall
        for (let d = 0; d < 8; d++) {
          const dx = wallX + (Math.random() - 0.5) * thickness * 1.5;
          const dy = wallTop + Math.random() * wallH * 0.6;
          svg.append('rect')
            .attr('x', dx).attr('y', dy)
            .attr('width', 3 + Math.random() * 5).attr('height', 3 + Math.random() * 6)
            .attr('fill', wall.color).attr('opacity', 0.7).attr('rx', 1)
            .transition().duration(300).attr('y', dy - 15 - Math.random() * 20)
            .transition().duration(400 + Math.random() * 300)
            .attr('y', groundY - 2 - Math.random() * 8)
            .attr('opacity', 0.3);
        }

        // Move label to rubble position
        g.selectAll('.wall-label').transition().duration(500)
          .attr('y', groundY - rubbleH - 6).attr('font-size', isMobile ? 8 : 9);

        // Remnant value stays visible at rubble
        svg.append('text').attr('x', wallX).attr('y', groundY + 14)
          .attr('text-anchor', 'middle')
          .attr('font-size', isMobile ? 9 : 10).attr('font-weight', 700)
          .attr('fill', wall.color).attr('opacity', 0)
          .text(wall.value)
          .transition().delay(400).duration(300).attr('opacity', 0.7);

        // Move person forward
        const nextX = startX + (i + 2) * slotW;
        personG.transition().delay(300).duration(700).ease(d3.easeCubicInOut)
          .attr('transform', `translate(${nextX},${groundY})`);

        currentWall++;

        // Final message + replay
        if (currentWall >= walls.length) {
          svg.append('text').attr('x', w / 2).attr('y', 38)
            .attr('text-anchor', 'middle')
            .attr('font-size', isMobile ? 12 : 14).attr('font-weight', 700)
            .attr('fill', '#C41E3A').attr('opacity', 0)
            .text('270 no lograron cruzar el último muro.')
            .transition().delay(600).duration(500).attr('opacity', 1);

          const replayG = svg.append('g').style('cursor', 'pointer').attr('opacity', 0);
          replayG.append('rect').attr('x', w / 2 - 60).attr('y', h / 2 - 20)
            .attr('width', 120).attr('height', 40).attr('rx', 20)
            .attr('fill', '#3B3231');
          replayG.append('text').attr('x', w / 2).attr('y', h / 2 + 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', 13).attr('font-weight', 600).attr('fill', 'white')
            .text('↺  Repetir');

          replayG.transition().delay(1200).duration(400).attr('opacity', 1);

          replayG.on('click', function() {
            buildGame();
          });
        }
      });
    });

    // Play button overlay
    const playG = svg.append('g').style('cursor', 'pointer');
    playG.append('rect').attr('x', 0).attr('y', 0).attr('width', w).attr('height', h)
      .attr('fill', '#f7f2ec').attr('opacity', 0.85);
    playG.append('circle').attr('cx', w / 2).attr('cy', h / 2 - 10).attr('r', 30)
      .attr('fill', '#3B3231');
    playG.append('polygon')
      .attr('points', `${w/2 - 8},${h/2 - 22} ${w/2 - 8},${h/2 + 2} ${w/2 + 12},${h/2 - 10}`)
      .attr('fill', 'white');
    playG.append('text').attr('x', w / 2).attr('y', h / 2 + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 11 : 13).attr('font-weight', 600).attr('fill', '#3B3231')
      .text('Toca cada muro para que la persona avance');
    playG.append('text').attr('x', w / 2).attr('y', h / 2 + 48)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 9 : 10).attr('fill', '#B69476')
      .text('De la discriminación al homicidio: 7 barreras');

    playG.on('click', function() {
      playG.transition().duration(400).attr('opacity', 0).remove();
      started = true;
      currentWall = 0;
    });

    } // end buildGame
    buildGame();
  })();