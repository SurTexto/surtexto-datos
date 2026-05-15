  (function() {
    const container = document.getElementById('viz-feminicidios');
    if (!container) return;

    const data = [
      { year: 2015, value: 411 },
      { year: 2016, value: 602 },
      { year: 2017, value: 741 },
      { year: 2018, value: 898 },
      { year: 2019, value: 944 },
      { year: 2020, value: 947 },
      { year: 2021, value: 981 },
      { year: 2022, value: 947 },
      { year: 2023, value: 832 },
      { year: 2024, value: 823 },
      { year: 2025, value: 721 }
    ];

    const hitos = [
      { year: 2015, label: 'Fátima asesinada\n(12 años)', y_offset: 30, anchor: 'start' },
      { year: 2019, label: 'Ataque con ácido\na María Elena Ríos', y_offset: -40, anchor: 'middle' },
      { year: 2021, label: 'Pico: 981\nfeminicidios', y_offset: -40, anchor: 'middle' },
      { year: 2025, label: 'Fallo Fátima:\ncero cumplimiento', y_offset: 30, anchor: 'end' }
    ];

    const isMobile = window.innerWidth < 640;
    const width = container.clientWidth;
    const dripZone = isMobile ? 60 : 80;
    const height = (isMobile ? 300 : 380) + dripZone;
    const margin = { top: 50, right: 30, bottom: 40 + dripZone, left: isMobile ? 45 : 55 };
    const chartBottom = height - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Clip path for drip area
    const defs = svg.append('defs');

    const xScale = d3.scaleLinear()
      .domain([2015, 2025])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 1100])
      .range([chartBottom, margin.top]);

    // Interpolator for getting y value at any x
    const lineGen = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Area fill
    const area = d3.area()
      .x(d => xScale(d.year))
      .y0(chartBottom)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('d', area)
      .attr('fill', '#C41E3A')
      .attr('opacity', 0.12);

    // Line
    svg.append('path')
      .datum(data)
      .attr('d', lineGen)
      .attr('fill', 'none')
      .attr('stroke', '#C41E3A')
      .attr('stroke-width', 2.5);

    // Dots
    svg.selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.value))
      .attr('r', isMobile ? 3 : 4)
      .attr('fill', '#C41E3A');

    // Value labels
    svg.selectAll('.val-label')
      .data(data)
      .join('text')
      .attr('x', d => xScale(d.year))
      .attr('y', d => yScale(d.value) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Montserrat, sans-serif')
      .attr('font-size', isMobile ? '9px' : '11px')
      .attr('font-weight', '700')
      .attr('fill', '#C41E3A')
      .text(d => d.value);

    // Hitos
    if (!isMobile) {
      hitos.forEach(h => {
        const hx = xScale(h.year);
        const dataPoint = data.find(d => d.year === h.year);
        const hy = yScale(dataPoint.value);
        const below = h.y_offset > 0;
        const anchor = h.anchor || 'middle';

        svg.append('line')
          .attr('x1', hx).attr('y1', hy + (below ? 8 : -8))
          .attr('x2', hx).attr('y2', hy + h.y_offset)
          .attr('stroke', '#B69476')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,2');

        const lines = h.label.split('\n');
        lines.forEach((txt, i) => {
          svg.append('text')
            .attr('x', hx)
            .attr('y', hy + h.y_offset + (below ? 14 : -8) + i * 12)
            .attr('text-anchor', anchor)
            .attr('font-family', 'Inter, sans-serif')
            .attr('font-size', '9px')
            .attr('fill', '#7B5137')
            .text(txt);
        });
      });
    }

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${chartBottom})`)
      .call(d3.axisBottom(xScale).ticks(isMobile ? 6 : 11).tickFormat(d3.format('d')))
      .call(g => g.select('.domain').attr('stroke', '#DFBFA1'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#DFBFA1'))
      .call(g => g.selectAll('.tick text').attr('font-family', 'Inter, sans-serif').attr('font-size', '10px').attr('fill', '#7B5137'));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('x2', width - margin.left - margin.right).attr('stroke', '#DFBFA1').attr('stroke-opacity', 0.5))
      .call(g => g.selectAll('.tick text').attr('font-family', 'Inter, sans-serif').attr('font-size', '10px').attr('fill', '#B69476'));

    // Title
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', 18)
      .attr('font-family', 'Montserrat, sans-serif')
      .attr('font-size', isMobile ? '13px' : '15px')
      .attr('font-weight', '700')
      .attr('fill', '#3B3231')
      .text('Feminicidios registrados en México por año');

    svg.append('text')
      .attr('x', margin.left)
      .attr('y', 34)
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', '11px')
      .attr('fill', '#B69476')
      .text('SESNSP, 2015-2025');

    // ── DRIPPING BLOOD ANIMATION ──
    // Blood drop SVG path: teardrop shape centered at (0,0), tip points down
    // s = scale factor (radius-like)
    function bloodDropPath(s) {
      return `M0,${s*1.1} C${-s*0.7},${s*0.4} ${-s*0.7},${-s*0.5} 0,${-s*1.3} C${s*0.7},${-s*0.5} ${s*0.7},${s*0.4} 0,${s*1.1}Z`;
    }

    const dripGroup = svg.append('g').attr('class', 'drips');
    const dripMaxLen = dripZone - 10;
    let animating = false;

    const dotPositions = data.map(d => ({ x: xScale(d.year), y: yScale(d.value), value: d.value }));

    function spawnDrips() {
      if (animating) return;
      animating = true;

      function createDrip() {
        if (!animating) return;
        const dot = dotPositions[Math.floor(Math.random() * dotPositions.length)];
        const startX = dot.x + (Math.random() - 0.5) * 4;
        const startY = dot.y;
        const fallDist = chartBottom - startY + 5 + Math.random() * (dripMaxLen - 5);

        const dropSize = 2.5 + Math.random() * 2.5;
        const trailWidth = dropSize * 0.5;
        const duration = 1000 + Math.random() * 1200;
        const opacity = 0.3 + Math.random() * 0.35;

        // Trail: tapers from thick to thin
        const trail = dripGroup.append('path')
          .attr('d', `M${startX - trailWidth/2},${startY} L${startX + trailWidth/2},${startY} L${startX + trailWidth*0.15},${startY} L${startX - trailWidth*0.15},${startY} Z`)
          .attr('fill', '#C41E3A')
          .attr('opacity', opacity);

        trail.transition()
          .duration(duration)
          .ease(d3.easeCubicIn)
          .attrTween('d', function() {
            return function(t) {
              const top = startY + fallDist * t * 0.4;
              const bot = startY + fallDist * t;
              const wTop = trailWidth * (1 - t * 0.3);
              const wBot = trailWidth * 0.15;
              return `M${startX - wTop/2},${top} L${startX + wTop/2},${top} L${startX + wBot/2},${bot} L${startX - wBot/2},${bot} Z`;
            };
          })
          .transition()
          .duration(500)
          .attr('opacity', 0)
          .remove();

        // Blood drop at tip
        const drop = dripGroup.append('path')
          .attr('d', bloodDropPath(dropSize))
          .attr('transform', `translate(${startX},${startY}) rotate(180)`)
          .attr('fill', '#C41E3A')
          .attr('opacity', opacity + 0.1);

        drop.transition()
          .duration(duration)
          .ease(d3.easeCubicIn)
          .attr('transform', `translate(${startX},${startY + fallDist}) rotate(180) scale(1.2)`)
          .transition()
          .duration(400)
          .attr('opacity', 0)
          .remove();
      }

      // Initial burst
      dotPositions.forEach((_, i) => {
        setTimeout(() => {
          if (!animating) return;
          const dot = dotPositions[i];
          const startX = dot.x;
          const startY = dot.y;
          const fallDist = chartBottom - startY + 5 + Math.random() * (dripMaxLen - 5);
          const dropSize = 3 + Math.random() * 2;
          const trailWidth = dropSize * 0.5;
          const duration = 1200 + Math.random() * 1000;

          const trail = dripGroup.append('path')
            .attr('d', `M${startX},${startY} L${startX},${startY}`)
            .attr('fill', '#C41E3A')
            .attr('opacity', 0.35);

          trail.transition()
            .duration(duration)
            .ease(d3.easeCubicIn)
            .attrTween('d', function() {
              return function(t) {
                const top = startY + fallDist * t * 0.4;
                const bot = startY + fallDist * t;
                const wTop = trailWidth * (1 - t * 0.3);
                const wBot = trailWidth * 0.15;
                return `M${startX - wTop/2},${top} L${startX + wTop/2},${top} L${startX + wBot/2},${bot} L${startX - wBot/2},${bot} Z`;
              };
            })
            .transition()
            .duration(600)
            .attr('opacity', 0)
            .remove();

          const drop = dripGroup.append('path')
            .attr('d', bloodDropPath(dropSize))
            .attr('transform', `translate(${startX},${startY}) rotate(180)`)
            .attr('fill', '#C41E3A').attr('opacity', 0.4);

          drop.transition()
            .duration(duration)
            .ease(d3.easeCubicIn)
            .attr('transform', `translate(${startX},${startY + fallDist}) rotate(180) scale(1.3)`)
            .transition()
            .duration(500)
            .attr('opacity', 0)
            .remove();
        }, i * 50);
      });

      // Continuous drips
      const dripInterval = setInterval(() => {
        if (!animating) { clearInterval(dripInterval); return; }
        createDrip();
      }, 200 + Math.random() * 200);
    }

    // Start dripping when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          spawnDrips();
        } else {
          animating = false;
        }
      });
    }, { threshold: 0.2 });
    observer.observe(container);
  })();
