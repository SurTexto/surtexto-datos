// VIZ 4 — Colombia: violencia LGBTIQ+ 2025
// Requiere D3.js v7: https://cdn.jsdelivr.net/npm/d3@7

(function() {
    const container = document.getElementById('viz-mapa');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    const w = container.clientWidth || 600;
    const h = isMobile ? 500 : 560;

    // Propiedad en el GeoJSON: NOMBRE_DPT (mayúsculas)
    // Estimaciones basadas en Caribe Afirmativo 2026
    // Antioquia + Valle + Bogotá = ~30% de 270 = ~81 casos
    const nameMap = {
      // Datos reales: Caribe Afirmativo, "Un sistema que falla", mayo 2026
      'VALLE DEL CAUCA':          46,   // real
      'ANTIOQUIA':                41,   // real
      'SANTAFE DE BOGOTA D.C':    40,   // real
      'BOLIVAR':                  12,   // real
      'ATLANTICO':                 8,   // real
      'MAGDALENA':                 7,   // real
      // Estimaciones proporcionales para el resto
      'SANTANDER':                14,
      'NORTE DE SANTANDER':        9,
      'NARIÑO':                    9,
      'CAUCA':                     8,
      'CORDOBA':                   8,
      'CUNDINAMARCA':              6,
      'TOLIMA':                    5,
      'HUILA':                     5,
      'RISARALDA':                 5,
      'META':                      4,
      'CALDAS':                    4,
      'CESAR':                     4,
      'PUTUMAYO':                  3,
      'SUCRE':                     3,
      'CHOCO':                     3,
      'LA GUAJIRA':                3,
      'BOYACA':                    3,
      'CAQUETA':                   2,
      'QUINDIO':                   2,
    };

    const displayName = {
      'ANTIOQUIA':             'Antioquia',
      'VALLE DEL CAUCA':       'Valle del Cauca',
      'SANTAFE DE BOGOTA D.C': 'Bogotá',
      'SANTANDER':             'Santander',
    };

    const topLabels = Object.keys(displayName);

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`)
      .attr('width', '100%')
      .style('font-family', 'Inter, sans-serif');

    svg.append('text').attr('x', w / 2).attr('y', 26)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 13 : 17).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('Dónde ocurren los homicidios');
    svg.append('text').attr('x', w / 2).attr('y', 44)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? 9 : 11).attr('fill', '#B69476')
      .text('Colombia 2025 — distribución estimada por departamento');

    const colorScale = d3.scaleSequential()
      .domain([0, 38])
      .interpolator(d3.interpolateRgb('#f0e8df', '#C41E3A'));

    const mapG = svg.append('g');
    const labelG = svg.append('g');

    // Tooltip
    const tip = d3.select(container).append('div')
      .style('position', 'absolute')
      .style('background', 'rgba(59,50,49,0.93)')
      .style('color', 'white')
      .style('padding', '5px 10px')
      .style('border-radius', '4px')
      .style('font-size', '11px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('white-space', 'nowrap')
      .style('transition', 'opacity 0.15s');

    const GEO_URL = '/colombia.geo.json';

    d3.json(GEO_URL).then(function(geo) {
        const proj = d3.geoMercator().fitSize([w, h - 72], geo);
        proj.translate([proj.translate()[0], proj.translate()[1] + 50]);
        const path = d3.geoPath().projection(proj);

        mapG.selectAll('path')
          .data(geo.features)
          .enter().append('path')
          .attr('d', path)
          .attr('fill', function(d) {
            const val = nameMap[d.properties.NOMBRE_DPT] || 0;
            return colorScale(val);
          })
          .attr('stroke', '#f7f2ec')
          .attr('stroke-width', 0.6)
          .on('mousemove', function(event, d) {
            const key = d.properties.NOMBRE_DPT;
            const val = nameMap[key];
            const label = displayName[key] || key.charAt(0) + key.slice(1).toLowerCase();
            tip.style('opacity', 1)
              .html(val
                ? '<strong>' + label + '</strong>: ~' + val + ' homicidios est.'
                : '<strong>' + label + '</strong>')
              .style('left', (event.offsetX + 12) + 'px')
              .style('top', (event.offsetY - 32) + 'px');
          })
          .on('mouseleave', function() {
            tip.style('opacity', 0);
          });

        // Etiquetas para departamentos top
        geo.features.forEach(function(d) {
          const key = d.properties.NOMBRE_DPT;
          if (!topLabels.includes(key)) return;
          const c = path.centroid(d);
          if (!c || isNaN(c[0])) return;
          labelG.append('text')
            .attr('x', c[0]).attr('y', c[1])
            .attr('text-anchor', 'middle').attr('dy', '0.35em')
            .attr('font-size', isMobile ? 7 : 8).attr('font-weight', 700)
            .attr('fill', 'white').attr('pointer-events', 'none')
            .text(displayName[key]);
        });

        // Leyenda
        const legX = (w - legW) / 2;
        const legY = h - 26;
        const legW = isMobile ? 110 : 150;
        const legH = 8;
        const defs = svg.append('defs');
        const grad = defs.append('linearGradient').attr('id', 'mapaLegGrad');
        grad.append('stop').attr('offset', '0%').attr('stop-color', '#f0e8df');
        grad.append('stop').attr('offset', '100%').attr('stop-color', '#C41E3A');

        svg.append('rect').attr('x', legX).attr('y', legY)
          .attr('width', legW).attr('height', legH).attr('rx', 2)
          .attr('fill', 'url(#mapaLegGrad)');
        svg.append('text').attr('x', legX).attr('y', legY - 4)
          .attr('font-size', 8).attr('fill', '#B69476').text('0');
        svg.append('text').attr('x', legX + legW).attr('y', legY - 4)
          .attr('text-anchor', 'end').attr('font-size', 8).attr('fill', '#B69476').text('35+');
        svg.append('text').attr('x', legX + legW / 2).attr('y', legY - 4)
          .attr('text-anchor', 'middle').attr('font-size', 8).attr('fill', '#B69476')
          .text('homicidios estimados');
      })
      .catch(function() {
        svg.append('text').attr('x', w / 2).attr('y', h / 2)
          .attr('text-anchor', 'middle').attr('fill', '#B69476').attr('font-size', 12)
          .text('Mapa no disponible.');
      });
  })();