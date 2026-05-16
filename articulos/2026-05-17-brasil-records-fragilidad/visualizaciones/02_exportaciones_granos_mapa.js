  (function() {
    const container = document.getElementById('viz-exportaciones');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const w = container.clientWidth;
    const h = isMobile ? 420 : 480;

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', 'Inter, sans-serif');

    svg.append('text').attr('x', w / 2).attr('y', 24).attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 14 : 18).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('A dónde van los granos');
    svg.append('text').attr('x', w / 2).attr('y', 42).attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 9 : 11).attr('fill', '#B69476')
      .text('165M ton exportadas en 2025. Grosor del arco = volumen.');

    const topoScript2 = document.createElement('script');
    topoScript2.src = '/topojson-client.min.js';
    if (typeof topojson !== 'undefined') { drawExportMap(); }
    else { topoScript2.onload = drawExportMap; document.head.appendChild(topoScript2); }

    function drawExportMap() {
    d3.json('/land-110m.json').then(function(topology) {
      const land = topojson.feature(topology, topology.objects.land);
      const mapTop = 52;
      const mapH = h - mapTop - 20;
      const projection = d3.geoNaturalEarth1()
        .fitExtent([[0, mapTop], [w, mapTop + mapH]], land);
      const path = d3.geoPath(projection);

      // Draw land
      svg.append('g').selectAll('path').data(land.features || [land])
        .join('path').attr('d', path)
        .attr('fill', '#e8ddd0').attr('stroke', '#d4c4b0').attr('stroke-width', 0.5);

      // Brasil origin
      const brasilCoord = projection([-50, -12]);
      const brasilR = isMobile ? 14 : 18;

      // Export destinations (from Brasil outward)
      const destinations = [
        { name: 'China', pct: 76, lon: 105, lat: 35, color: '#C41E3A', detail: 'Soja (76%)' },
        { name: 'Irán', pct: 21, lon: 53, lat: 32, color: '#C67132', detail: 'Maíz (21%)' },
        { name: 'Egipto', pct: 19, lon: 31, lat: 27, color: '#ECB033', detail: 'Maíz (19%)' },
        { name: 'Vietnam', pct: 10, lon: 106, lat: 16, color: '#8A6B50', detail: 'Maíz (10%)' },
        { name: 'España', pct: 6, lon: -3, lat: 40, color: '#7B5137', detail: 'Soja + maíz' },
      ];

      // Draw arcs (Brasil → destination)
      destinations.forEach((d, i) => {
        const to = projection([d.lon, d.lat]);
        if (!to) return;
        const from = brasilCoord;
        const strokeW = Math.max(1.5, (d.pct / 76) * (isMobile ? 8 : 12));

        const midX = (from[0] + to[0]) / 2;
        const midY = (from[1] + to[1]) / 2;
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const bulge = dist * 0.25 * (i % 2 === 0 ? -1 : 1);
        const cpx = midX + perpX * bulge;
        const cpy = midY + perpY * bulge - 15;

        const arcPath = svg.append('path')
          .attr('d', `M${from[0]},${from[1]} Q${cpx},${cpy} ${to[0]},${to[1]}`)
          .attr('fill', 'none').attr('stroke', d.color)
          .attr('stroke-width', strokeW).attr('stroke-linecap', 'round')
          .attr('opacity', 0.5);

        // Animated dots
        const pathLen = arcPath.node().getTotalLength();
        const dotCount = Math.max(1, Math.floor(d.pct / 15));
        for (let dd = 0; dd < dotCount; dd++) {
          const dot = svg.append('circle').attr('r', strokeW * 0.35)
            .attr('fill', 'white').attr('opacity', 0);
          function animDot() {
            dot.attr('opacity', 0)
              .transition().delay(dd * (1800 / dotCount) + i * 200).duration(0).attr('opacity', 0.8)
              .transition().duration(2200 + Math.random() * 800).ease(d3.easeLinear)
              .attrTween('cx', function() { return function(t) { return arcPath.node().getPointAtLength(t * pathLen).x; }; })
              .attrTween('cy', function() { return function(t) { return arcPath.node().getPointAtLength(t * pathLen).y; }; })
              .transition().duration(150).attr('opacity', 0).on('end', animDot);
          }
          animDot();
        }

        // Destination dot
        const r = Math.max(4, (d.pct / 76) * (isMobile ? 8 : 10));
        svg.append('circle').attr('cx', to[0]).attr('cy', to[1]).attr('r', r)
          .attr('fill', d.color).attr('opacity', 0.2);
        svg.append('circle').attr('cx', to[0]).attr('cy', to[1]).attr('r', r)
          .attr('fill', 'none').attr('stroke', d.color).attr('stroke-width', 1.5);

        // Label
        const labelBelow = d.lat < 35;
        const ly = labelBelow ? to[1] + r + 12 : to[1] - r - 4;
        svg.append('text').attr('x', to[0]).attr('y', ly)
          .attr('text-anchor', 'middle')
          .attr('font-size', isMobile ? 9 : 10).attr('font-weight', 700)
          .attr('fill', d.color).text(d.name + ' · ' + d.pct + '%');
        svg.append('text').attr('x', to[0]).attr('y', ly + 12)
          .attr('text-anchor', 'middle')
          .attr('font-size', isMobile ? 7 : 8).attr('fill', '#B69476').text(d.detail);
      });

      // Brasil origin circle
      svg.append('circle').attr('cx', brasilCoord[0]).attr('cy', brasilCoord[1])
        .attr('r', brasilR + 8).attr('fill', '#7B9A6D').attr('opacity', 0.12);
      svg.append('circle').attr('cx', brasilCoord[0]).attr('cy', brasilCoord[1])
        .attr('r', brasilR + 8).attr('fill', 'none').attr('stroke', '#7B9A6D').attr('stroke-width', 2);
      svg.append('text').attr('x', brasilCoord[0]).attr('y', brasilCoord[1] - 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', isMobile ? 9 : 11).attr('font-weight', 800).attr('fill', '#3B3231')
        .text('BRASIL');
      svg.append('text').attr('x', brasilCoord[0]).attr('y', brasilCoord[1] + 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', isMobile ? 7 : 9).attr('font-weight', 700).attr('fill', '#3B3231')
        .text('165M ton');

      svg.append('text').attr('x', w / 2).attr('y', h - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', isMobile ? 9 : 10).attr('fill', '#B69476')
        .text('Datos 2025. Fuentes: ANEC, USDA, SECEX.');
    });
    }
  })();
