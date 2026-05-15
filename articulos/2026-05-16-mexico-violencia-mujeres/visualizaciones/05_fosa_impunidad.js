  (function() {
    const container = document.getElementById('viz-embudo');
    if (!container) return;

    const isMobile = window.innerWidth < 640;
    const width = container.clientWidth;
    const height = isMobile ? 420 : 460;
    const maxW = Math.min(width - 20, 650);
    const ox = (width - maxW) / 2;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Title
    svg.append('text')
      .attr('x', width / 2).attr('y', 18)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Montserrat, sans-serif')
      .attr('font-size', isMobile ? '13px' : '15px')
      .attr('font-weight', '700')
      .attr('fill', '#3B3231')
      .text('La fosa de la impunidad');

    svg.append('text')
      .attr('x', width / 2).attr('y', 34)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11px')
      .attr('fill', '#B69476')
      .text('CIMACnoticias / SESNSP / La Jornada, 2025-2026');

    // ── STRATA — bottom = 5.020 (fosa), rising to surface = sentencia ──
    const strata = [
      { num: '5.020', label: 'mujeres asesinadas en 2025', pct: 1.0, color: '#1a1a1a', textColor: '#fff', pattern: 'dark' },
      { num: '1.255', label: 'se investigan con perspectiva de género', pct: 0.25, color: '#5C3D2E', textColor: '#fff', pattern: 'medium' },
      { num: '597', label: 'se tipifican como feminicidio', pct: 0.119, color: '#C67132', textColor: '#fff', pattern: 'light' },
      { num: '?', label: 'terminan en sentencia', pct: 0.015, color: '#C41E3A', textColor: '#fff', pattern: 'red' }
    ];

    const totalDepth = isMobile ? 300 : 340;
    const bottomY = height - 30;
    const surfaceY = bottomY - totalDepth;

    // Compute layer heights — use sqrt scale so thin layers are visible
    const rawHeights = strata.map(s => Math.sqrt(s.pct));
    const sumRaw = rawHeights.reduce((a, b) => a + b, 0);
    const layerHeights = rawHeights.map(h => Math.max((h / sumRaw) * totalDepth, isMobile ? 20 : 24));

    // Build from bottom (5.020) to top (sentencia)
    // strata array is already ordered: [?, 597, 1255, 5020] — bottom up
    // We draw from bottom of SVG upward
    let currentBottom = bottomY;

    // Draw layers bottom-up
    strata.forEach((s, i) => {
      const layerH = layerHeights[i];
      const y1 = currentBottom - layerH;
      const y2 = currentBottom;

      // Main layer
      svg.append('rect')
        .attr('x', ox).attr('y', y1)
        .attr('width', maxW).attr('height', layerH)
        .attr('fill', s.color);

      // Textures
      if (s.pattern === 'dark') {
        // Earth texture
        for (let p = 0; p < (isMobile ? 40 : 80); p++) {
          const px = ox + 6 + Math.random() * (maxW - 12);
          const py = y1 + 3 + Math.random() * (layerH - 6);
          svg.append('circle')
            .attr('cx', px).attr('cy', py).attr('r', 1 + Math.random() * 2)
            .attr('fill', '#2a2a2a').attr('opacity', 0.35);
        }
        for (let c = 0; c < 6; c++) {
          const cy2 = y1 + Math.random() * layerH;
          const cx1 = ox + Math.random() * maxW * 0.4;
          svg.append('line')
            .attr('x1', cx1).attr('y1', cy2)
            .attr('x2', cx1 + 30 + Math.random() * 60).attr('y2', cy2 + (Math.random()-0.5)*3)
            .attr('stroke', '#111').attr('stroke-width', 0.5).attr('opacity', 0.3);
        }
        // Body silhouettes — lying figures in the fosa
        // Simplified lying body: head circle + torso ellipse + legs
        const numBodies = isMobile ? 40 : 80;
        for (let b = 0; b < numBodies; b++) {
          const bx = ox + 20 + Math.random() * (maxW - 40);
          const by = y1 + 30 + Math.random() * (layerH - 60);
          const bScale = 0.6 + Math.random() * 0.5;
          const bAngle = -20 + Math.random() * 40;
          const bOpacity = 0.08 + Math.random() * 0.12;
          const bg = svg.append('g')
            .attr('transform', `translate(${bx},${by}) rotate(${bAngle}) scale(${bScale})`);
          // Head
          bg.append('circle')
            .attr('cx', -18).attr('cy', 0).attr('r', 5)
            .attr('fill', '#fff').attr('opacity', bOpacity);
          // Torso
          bg.append('ellipse')
            .attr('cx', 0).attr('cy', 0).attr('rx', 14).attr('ry', 4)
            .attr('fill', '#fff').attr('opacity', bOpacity);
          // Legs
          bg.append('line')
            .attr('x1', 12).attr('y1', -2).attr('x2', 26).attr('y2', -4)
            .attr('stroke', '#fff').attr('stroke-width', 2.5).attr('opacity', bOpacity)
            .attr('stroke-linecap', 'round');
          bg.append('line')
            .attr('x1', 12).attr('y1', 2).attr('x2', 25).attr('y2', 5)
            .attr('stroke', '#fff').attr('stroke-width', 2.5).attr('opacity', bOpacity)
            .attr('stroke-linecap', 'round');
          // Arm
          bg.append('line')
            .attr('x1', -6).attr('y1', -3).attr('x2', -10).attr('y2', -10)
            .attr('stroke', '#fff').attr('stroke-width', 2).attr('opacity', bOpacity)
            .attr('stroke-linecap', 'round');
        }
      } else if (s.pattern === 'medium') {
        for (let l = 0; l < 4; l++) {
          const ly = y1 + (l+0.5) * layerH / 4;
          svg.append('line')
            .attr('x1', ox+4).attr('y1', ly)
            .attr('x2', ox+maxW-4).attr('y2', ly)
            .attr('stroke', '#4a2f20').attr('stroke-width', 0.5).attr('opacity', 0.25);
        }
        for (let p = 0; p < (isMobile ? 15 : 30); p++) {
          const px = ox + 6 + Math.random() * (maxW - 12);
          const py = y1 + 3 + Math.random() * (layerH - 6);
          svg.append('circle')
            .attr('cx', px).attr('cy', py).attr('r', 0.8 + Math.random() * 1.2)
            .attr('fill', '#4a2f20').attr('opacity', 0.2);
        }
      } else if (s.pattern === 'light') {
        for (let p = 0; p < (isMobile ? 20 : 40); p++) {
          const px = ox + 6 + Math.random() * (maxW - 12);
          const py = y1 + 2 + Math.random() * (layerH - 4);
          svg.append('circle')
            .attr('cx', px).attr('cy', py).attr('r', 0.6 + Math.random() * 1)
            .attr('fill', '#a05a28').attr('opacity', 0.25);
        }
      }

      // Number and label
      const cy = y1 + layerH / 2;
      const isLargest = s.pct === 1.0;
      const fontSize = isLargest ? (isMobile ? '26px' : '34px') : (layerH > 50 ? (isMobile ? '18px' : '22px') : (isMobile ? '13px' : '15px'));

      svg.append('text')
        .attr('x', width / 2).attr('y', cy + (isLargest ? -4 : 2))
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Montserrat, sans-serif')
        .attr('font-size', fontSize)
        .attr('font-weight', '900')
        .attr('fill', '#fff')
        .text(s.num);

      // Label: inside if fits, next to number if thin
      if (layerH > 45) {
        svg.append('text')
          .attr('x', width / 2).attr('y', cy + (isLargest ? 20 : 16))
          .attr('text-anchor', 'middle')
          .attr('font-family', 'Inter, sans-serif')
          .attr('font-size', isMobile ? '8px' : '10px')
          .attr('fill', '#fff').attr('opacity', 0.65)
          .text(s.label);
      } else {
        // Put label right next to the number, inside the bar
        svg.append('text')
          .attr('x', width / 2 + (isMobile ? 16 : 22)).attr('y', cy + 5)
          .attr('text-anchor', 'start')
          .attr('font-family', 'Inter, sans-serif')
          .attr('font-size', isMobile ? '9px' : '11px')
          .attr('fill', '#fff').attr('opacity', 0.8)
          .text(s.label);
      }

      // Depth marker left
      svg.append('line')
        .attr('x1', ox - 3).attr('y1', y1)
        .attr('x2', ox - 3).attr('y2', y2)
        .attr('stroke', s.color).attr('stroke-width', 3).attr('stroke-linecap', 'round');

      currentBottom = y1;
    });

    // Surface / grass on top (above the last layer drawn = sentencia)
    const grassY = currentBottom;
    svg.append('rect')
      .attr('x', ox).attr('y', grassY - 6)
      .attr('width', maxW).attr('height', 6)
      .attr('fill', '#8B9E6B').attr('rx', 1);

    for (let g = 0; g < (isMobile ? 18 : 30); g++) {
      const gx = ox + 8 + Math.random() * (maxW - 16);
      const gh = 4 + Math.random() * 10;
      svg.append('line')
        .attr('x1', gx).attr('y1', grassY - 6)
        .attr('x2', gx + (Math.random()-0.5)*4).attr('y2', grassY - 6 - gh)
        .attr('stroke', '#6B8E4E').attr('stroke-width', 1.2).attr('stroke-linecap', 'round');
    }

    svg.append('text')
      .attr('x', ox + 6).attr('y', grassY - 18)
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '9px').attr('fill', '#6B8E4E')
      .text('superficie');
  })();
