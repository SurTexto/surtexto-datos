  (function() {
    const container = document.getElementById('viz-fertilizantes');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const w = container.clientWidth;
    const h = isMobile ? 420 : 480;

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', 'Inter, sans-serif');

    svg.append('text').attr('x', w / 2).attr('y', 24).attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 14 : 18).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('De dónde vienen los fertilizantes');
    svg.append('text').attr('x', w / 2).attr('y', 42).attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 9 : 11).attr('fill', '#B69476')
      .text('85% importado. Grosor del arco = volumen.');

    // Load topojson library + world map (local files)
    const topoScript = document.createElement('script');
    topoScript.src = '/topojson-client.min.js';
    document.head.appendChild(topoScript);

    topoScript.onload = function() {
    const mapUrl = '/land-110m.json';

    d3.json(mapUrl).then(function(topology) {
      const land = topojson.feature(topology, topology.objects.land);

      const mapTop = 52;
      const mapH = h - mapTop - 20;

      // Projection — use full width
      const projection = d3.geoNaturalEarth1()
        .fitExtent([[0, mapTop], [w, mapTop + mapH]], land);

      const path = d3.geoPath(projection);

      // Draw land
      svg.append('g').selectAll('path').data(land.features || [land])
        .join('path')
        .attr('d', path)
        .attr('fill', '#e8ddd0')
        .attr('stroke', '#d4c4b0')
        .attr('stroke-width', 0.5);

      // Country positions (lon, lat)
      // Datos 2025: SunSirs/Datamar, ANDA, SECEX
      const origins = [
        { name: 'Rusia', pct: 32.2, lon: 55, lat: 58, color: '#C41E3A', detail: 'Potasio, urea' },
        { name: 'China', pct: 26.1, lon: 105, lat: 35, color: '#ECB033', detail: 'Sulfato de amonio' },
        { name: 'Canadá', pct: 10.1, lon: -100, lat: 56, color: '#C67132', detail: 'Potasa' },
        { name: 'EE.UU.', pct: 7.1, lon: -95, lat: 38, color: '#7B5137', detail: 'Fosfatos' },
        { name: 'Marruecos', pct: 6.4, lon: -8, lat: 28, color: '#8A6B50', detail: 'Fosfatos' },
        { name: 'Medio Oriente', pct: 11.9, lon: 42, lat: 22, color: '#996633', detail: 'Egipto, Israel, A. Saudita, Catar' },
        { name: 'Nacional', pct: 15, lon: -50, lat: -12, color: '#7B9A6D', detail: 'Producción propia' },
      ];

      // Brasil destination
      const brasilCoord = projection([-50, -12]);
      const brasilR = isMobile ? 14 : 18;

      // Draw arcs first (behind dots)
      origins.forEach((o, i) => {
        const from = projection([o.lon, o.lat]);
        if (!from) return;
        const to = brasilCoord;
        const strokeW = Math.max(1.5, (o.pct / 27) * (isMobile ? 6 : 10));

        // Great circle-ish arc via control point
        const midX = (from[0] + to[0]) / 2;
        const midY = (from[1] + to[1]) / 2;
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const bulge = dist * 0.3 * (i % 2 === 0 ? -1 : 1);
        const cpx = midX + perpX * bulge;
        const cpy = midY + perpY * bulge - 20;

        const arcPath = svg.append('path')
          .attr('d', `M${from[0]},${from[1]} Q${cpx},${cpy} ${to[0]},${to[1]}`)
          .attr('fill', 'none')
          .attr('stroke', o.color)
          .attr('stroke-width', strokeW)
          .attr('stroke-linecap', 'round')
          .attr('opacity', o.name === 'Nacional' ? 0.3 : 0.5);

        // Animated dots
        const pathLen = arcPath.node().getTotalLength();
        const dotCount = Math.max(1, Math.floor(o.pct / 10));

        for (let d = 0; d < dotCount; d++) {
          const dot = svg.append('circle')
            .attr('r', strokeW * 0.35)
            .attr('fill', 'white')
            .attr('opacity', 0);

          function animateDot() {
            dot.attr('opacity', 0)
              .transition().delay(d * (1800 / dotCount) + i * 200).duration(0).attr('opacity', 0.8)
              .transition().duration(2200 + Math.random() * 800).ease(d3.easeLinear)
              .attrTween('cx', function() {
                return function(t) { return arcPath.node().getPointAtLength(t * pathLen).x; };
              })
              .attrTween('cy', function() {
                return function(t) { return arcPath.node().getPointAtLength(t * pathLen).y; };
              })
              .transition().duration(150).attr('opacity', 0)
              .on('end', animateDot);
          }
          animateDot();
        }
      });

      // Brasil highlight circle
      svg.append('circle').attr('cx', brasilCoord[0]).attr('cy', brasilCoord[1])
        .attr('r', brasilR + 8)
        .attr('fill', '#7B9A6D').attr('opacity', 0.12);
      svg.append('circle').attr('cx', brasilCoord[0]).attr('cy', brasilCoord[1])
        .attr('r', brasilR + 8)
        .attr('fill', 'none').attr('stroke', '#7B9A6D').attr('stroke-width', 2);
      svg.append('text').attr('x', brasilCoord[0]).attr('y', brasilCoord[1] - 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', isMobile ? 9 : 11).attr('font-weight', 800).attr('fill', '#3B3231')
        .text('BRASIL');
      svg.append('text').attr('x', brasilCoord[0]).attr('y', brasilCoord[1] + 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', isMobile ? 7 : 9).attr('font-weight', 700).attr('fill', '#3B3231')
        .text('47M ton');

      // Bottom note
      svg.append('text').attr('x', w / 2).attr('y', h - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', isMobile ? 9 : 10).attr('fill', '#B69476')
        .text('Datos 2025. Fuente: SunSirs/Datamar, ANDA.');

      // Origin dots and labels
      origins.forEach(o => {
        const pos = projection([o.lon, o.lat]);
        if (!pos) return;
        if (o.name === 'Nacional') return; // Brasil already drawn

        const r = Math.max(4, (o.pct / 27) * (isMobile ? 8 : 10));

        svg.append('circle').attr('cx', pos[0]).attr('cy', pos[1])
          .attr('r', r)
          .attr('fill', o.color).attr('opacity', 0.2);
        svg.append('circle').attr('cx', pos[0]).attr('cy', pos[1])
          .attr('r', r)
          .attr('fill', 'none').attr('stroke', o.color).attr('stroke-width', 1.5);

        // Label — positioned to avoid map clutter
        const labelBelow = o.lat < 40;
        const lx = pos[0];
        const ly = labelBelow ? pos[1] + r + 12 : pos[1] - r - 4;

        svg.append('text').attr('x', lx).attr('y', ly)
          .attr('text-anchor', 'middle')
          .attr('font-size', isMobile ? 9 : 10).attr('font-weight', 700)
          .attr('fill', o.color).text(o.name + ' · ' + o.pct + '%');
        svg.append('text').attr('x', lx).attr('y', ly + 12)
          .attr('text-anchor', 'middle')
          .attr('font-size', isMobile ? 7 : 8).attr('fill', '#B69476').text(o.detail);
      });
    });
    }; // end topoScript.onload
  })();
