  (function() {
    const container = document.getElementById('viz-extraccion');
    if (!container) return;
    const isMobile = window.innerWidth < 640;

    // Only years with both data points for clean stacked bars
    const prodData = [
      { year: 2020, total: 480, vm: 180 },
      { year: 2022, total: 592, vm: 277 },
      { year: 2023, total: 645, vm: 352 },
      { year: 2024, total: 709, vm: 430 },
      { year: 2025, total: 803, vm: 530 },
    ];

    const w = container.clientWidth;
    const h = isMobile ? 380 : 440;
    const m = { top: 60, right: isMobile ? 15 : 40, bottom: 110, left: isMobile ? 45 : 55 };

    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
      .style('font-family', 'Inter, sans-serif');

    svg.append('text').attr('x', m.left).attr('y', 22)
      .attr('font-size', isMobile ? 14 : 18).attr('font-weight', 700).attr('fill', '#3B3231')
      .text('Lo que se extrae');
    svg.append('text').attr('x', m.left).attr('y', 40)
      .attr('font-size', isMobile ? 10 : 12).attr('fill', '#B69476')
      .text('Producción de petróleo en Argentina (miles de barriles/día)');

    const chartH = h - m.top - m.bottom;
    const x = d3.scaleBand().domain(prodData.map(d => d.year)).range([m.left, w - m.right]).padding(0.25);
    const y = d3.scaleLinear().domain([0, 900]).range([m.top + chartH, m.top]);

    // Gridlines
    [200, 400, 600, 800].forEach(v => {
      svg.append('line')
        .attr('x1', m.left).attr('x2', w - m.right)
        .attr('y1', y(v)).attr('y2', y(v))
        .attr('stroke', '#DFBFA1').attr('stroke-width', 1).attr('stroke-dasharray', '2,3');
      svg.append('text')
        .attr('x', m.left - 6).attr('y', y(v) + 4)
        .attr('text-anchor', 'end').attr('font-size', 9).attr('fill', '#B69476')
        .text(v + 'K');
    });

    // Wave generator for oil surface
    function oilWavePath(bx, bw, topY, bottomY, phase) {
      const amp = 3;
      const freq = 2.5;
      let path = `M${bx},${bottomY}`;
      // Left edge up
      path += ` L${bx},${topY + amp}`;
      // Wavy top
      const steps = 20;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = bx + t * bw;
        const py = topY + Math.sin(t * Math.PI * freq + phase) * amp;
        path += ` L${px},${py}`;
      }
      // Right edge down and close
      path += ` L${bx + bw},${bottomY} Z`;
      return path;
    }

    const oilPaths = [];

    // Stacked bars
    prodData.forEach((d, i) => {
      const bx = x(d.year);
      const bw = x.bandwidth();
      const resto = d.total - d.vm;

      // Bottom segment: Vaca Muerta (dark oil) with wavy top
      const vmPath = svg.append('path')
        .attr('d', oilWavePath(bx, bw, y(d.vm), y(0), i * 1.2))
        .attr('fill', '#C67132');
      oilPaths.push({ el: vmPath, bx, bw, topY: y(d.vm), bottomY: y(0), offset: i * 1.2 });

      // Glossy highlight on oil
      const glossGrad = svg.append('defs').append('linearGradient')
        .attr('id', `oilGloss${i}`).attr('x1', '0').attr('y1', '0').attr('x2', '1').attr('y2', '0');
      glossGrad.append('stop').attr('offset', '0%').attr('stop-color', 'white').attr('stop-opacity', 0);
      glossGrad.append('stop').attr('offset', '35%').attr('stop-color', 'white').attr('stop-opacity', 0.08);
      glossGrad.append('stop').attr('offset', '50%').attr('stop-color', 'white').attr('stop-opacity', 0.15);
      glossGrad.append('stop').attr('offset', '65%').attr('stop-color', 'white').attr('stop-opacity', 0.08);
      glossGrad.append('stop').attr('offset', '100%').attr('stop-color', 'white').attr('stop-opacity', 0);

      svg.append('rect')
        .attr('x', bx).attr('y', y(d.vm))
        .attr('width', bw).attr('height', y(0) - y(d.vm))
        .attr('fill', `url(#oilGloss${i})`);

      // Top segment: Resto (light), with wavy bottom matching oil surface
      function restoPath(phase) {
        const amp = 3;
        const freq = 2.5;
        const steps = 20;
        const topY = y(d.total);
        const btmY = y(d.vm);
        // Top edge (straight with rounded corners)
        let p = `M${bx + 3},${topY} L${bx + bw - 3},${topY} Q${bx + bw},${topY} ${bx + bw},${topY + 3}`;
        // Right edge down to wave
        p += ` L${bx + bw},${btmY}`;
        // Wavy bottom (right to left)
        for (let s = steps; s >= 0; s--) {
          const t = s / steps;
          const px = bx + t * bw;
          const py = btmY + Math.sin(t * Math.PI * freq + phase) * amp;
          p += ` L${px},${py}`;
        }
        // Left edge up and close
        p += ` L${bx},${topY + 3} Q${bx},${topY} ${bx + 3},${topY} Z`;
        return p;
      }
      const restoEl = svg.append('path')
        .attr('d', restoPath(i * 1.2))
        .attr('fill', '#DFBFA1');
      oilPaths[oilPaths.length - 1].restoEl = restoEl;
      oilPaths[oilPaths.length - 1].restoPath = restoPath;

      // VM value inside bar (bottom segment)
      if (y(0) - y(d.vm) > 30) {
        svg.append('text')
          .attr('x', bx + bw / 2).attr('y', y(d.vm / 2))
          .attr('text-anchor', 'middle').attr('dy', '0.35em')
          .attr('font-size', isMobile ? 10 : 11).attr('font-weight', 700)
          .attr('fill', 'white')
          .text(d.vm + 'K');
      }

      // Resto value inside bar (top segment)
      if (y(d.vm) - y(d.total) > 25) {
        svg.append('text')
          .attr('x', bx + bw / 2).attr('y', (y(d.total) + y(d.vm)) / 2)
          .attr('text-anchor', 'middle').attr('dy', '0.35em')
          .attr('font-size', isMobile ? 9 : 10)
          .attr('fill', '#7B5137')
          .text(resto + 'K');
      }

      // Total on top
      svg.append('text')
        .attr('x', bx + bw / 2).attr('y', y(d.total) - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', isMobile ? 12 : 14).attr('font-weight', 700)
        .attr('fill', '#3B3231')
        .text(d.total + 'K');

      // Year
      svg.append('text')
        .attr('x', bx + bw / 2).attr('y', y(0) + 16)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11).attr('fill', '#B69476')
        .text(d.year);
    });

    // Growth annotation (2020 → 2025)
    const lastBar = prodData[prodData.length - 1];
    svg.append('text')
      .attr('x', x(lastBar.year) + x.bandwidth() / 2).attr('y', y(lastBar.total) - 26)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11).attr('font-weight', 700).attr('fill', '#C41E3A')
      .text('+67% total · VM ×2,9');

    // Vaca Muerta % share annotation
    svg.append('text')
      .attr('x', x(2020) + x.bandwidth() / 2).attr('y', y(0) + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9).attr('fill', '#C67132')
      .text('VM: 38%');
    svg.append('text')
      .attr('x', x(2025) + x.bandwidth() / 2).attr('y', y(0) + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9).attr('font-weight', 700).attr('fill', '#C67132')
      .text('VM: 66%');

    // Legend
    const legendY = h - m.bottom + 45;
    svg.append('rect').attr('x', m.left).attr('y', legendY).attr('width', 14).attr('height', 14).attr('fill', '#C67132').attr('rx', 2);
    svg.append('text').attr('x', m.left + 20).attr('y', legendY + 11).attr('font-size', 11).attr('fill', '#7B5137').text('Vaca Muerta');
    svg.append('rect').attr('x', m.left + (isMobile ? 110 : 130)).attr('y', legendY).attr('width', 14).attr('height', 14).attr('fill', '#DFBFA1').attr('rx', 2);
    svg.append('text').attr('x', m.left + (isMobile ? 130 : 150)).attr('y', legendY + 11).attr('font-size', 11).attr('fill', '#7B5137').text('Resto del país');

    // RIGI callout
    const rigiY = legendY + 30;
    svg.append('rect')
      .attr('x', m.left).attr('y', rigiY)
      .attr('width', w - m.left - m.right).attr('height', isMobile ? 40 : 34)
      .attr('fill', '#f7f2ec').attr('rx', 6);

    svg.append('text').attr('x', m.left + 12).attr('y', rigiY + (isMobile ? 14 : 12))
      .attr('font-size', 10).attr('font-weight', 700).attr('fill', '#C67132')
      .text('RIGI: 16 proyectos aprobados');
    svg.append('text').attr('x', m.left + 12).attr('y', rigiY + (isMobile ? 28 : 26))
      .attr('font-size', 10).attr('fill', '#7B5137')
      .text(isMobile ? 'USD 27.000M + 36 en evaluación (USD 97.000M)' : 'USD 27.000 millones aprobados + 36 proyectos en evaluación por USD 97.000 millones. Exenciones hasta 30 años.');

    // Animate oil wave
    let t = 0;
    let oilRunning = false;
    function animateOil() {
      if (!oilRunning) return;
      t += 0.04;
      oilPaths.forEach(p => {
        p.el.attr('d', oilWavePath(p.bx, p.bw, p.topY, p.bottomY, p.offset + t));
        if (p.restoEl && p.restoPath) {
          p.restoEl.attr('d', p.restoPath(p.offset + t));
        }
      });
      requestAnimationFrame(animateOil);
    }
    // Only animate when visible
    const oilObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!oilRunning) { oilRunning = true; animateOil(); }
      } else {
        oilRunning = false;
      }
    }, { threshold: 0.2 });
    oilObserver.observe(container);
  })();
