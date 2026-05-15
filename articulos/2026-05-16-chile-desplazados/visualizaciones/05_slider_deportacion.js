    // ── VIZ 3: Río de deportación (Minard-style) + slider interactivo ──
    (function() {
      const el = document.getElementById('viz-anatomia');
      const W = el.clientWidth;
      const TOTAL = 75000;
      const CURRENT_RATE = 32; // deportaciones/mes

      // Controls will be appended AFTER timeline and summary (bottom position for mobile)

      // ── Timeline de hitos (protagonista) ──
      // SVG icons (monochrome, SurTexto style)
      const ICONS = {
        govt: `<circle cx="10" cy="6" r="2" fill="${ST[600]}"/><path d="M3 18v-2l7-5 7 5v2H3z M10 4l8 5H2l8-5z" fill="${ST[600]}"/>`,
        car: `<rect x="3" y="10" width="14" height="5" rx="2" fill="${ST[600]}"/><circle cx="6" cy="16" r="1.5" fill="${ST[400]}"/><circle cx="14" cy="16" r="1.5" fill="${ST[400]}"/><path d="M5 10l2-4h6l2 4" fill="none" stroke="${ST[600]}" stroke-width="1.5"/>`,
        temp: `<rect x="9" y="3" width="2" height="12" rx="1" fill="${ST[600]}"/><circle cx="10" cy="17" r="3" fill="${ST.accent}"/><rect x="9" y="10" width="2" height="5" fill="${ST.accent}"/>`,
        rocket: `<path d="M10 2c-2 3-3 7-3 10 0 2 .5 3 1 4h4c.5-1 1-2 1-4 0-3-1-7-3-10z" fill="${ST[600]}"/><path d="M7 16l-2 3h2l1-1.5L7 16z M13 16l2 3h-2l-1-1.5 1-1.5z" fill="${ST[400]}"/><circle cx="10" cy="9" r="1.5" fill="${ST[50]}"/>`,
        dna: `<path d="M7 3c0 4 6 5 6 9s-6 5-6 9 M13 3c0 4-6 5-6 9s6 5 6 9" fill="none" stroke="${ST[600]}" stroke-width="1.5"/><line x1="5" y1="7" x2="15" y2="7" stroke="${ST[400]}" stroke-width="1"/><line x1="5" y1="13" x2="15" y2="13" stroke="${ST[400]}" stroke-width="1"/>`,
        wave: `<path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" fill="none" stroke="${ST.accent}" stroke-width="2"/><path d="M2 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0" fill="none" stroke="${ST[600]}" stroke-width="1.5" opacity=".5"/>`,
        bolt: `<polygon points="12,2 5,11 9,11 8,20 15,9 11,9" fill="${ST.accent}"/>`,
        planet: `<circle cx="10" cy="10" r="5" fill="none" stroke="${ST[600]}" stroke-width="1.5"/><ellipse cx="10" cy="10" rx="9" ry="2.5" fill="none" stroke="${ST[400]}" stroke-width="1" transform="rotate(-20 10 10)"/><circle cx="10" cy="10" r="2" fill="${ST[600]}"/>`,
        chip: `<rect x="5" y="5" width="10" height="10" rx="1" fill="${ST[600]}"/><rect x="7" y="7" width="6" height="6" rx=".5" fill="${ST[400]}"/><line x1="8" y1="3" x2="8" y2="5" stroke="${ST[600]}" stroke-width="1.5"/><line x1="12" y1="3" x2="12" y2="5" stroke="${ST[600]}" stroke-width="1.5"/><line x1="8" y1="15" x2="8" y2="17" stroke="${ST[600]}" stroke-width="1.5"/><line x1="12" y1="15" x2="12" y2="17" stroke="${ST[600]}" stroke-width="1.5"/>`,
        flag: `<line x1="4" y1="3" x2="4" y2="18" stroke="${ST[900]}" stroke-width="1.5"/><path d="M4 3h10l-3 4 3 4H4z" fill="${ST.accent}"/>`,
        pin: `<circle cx="10" cy="7" r="3" fill="${ST.accent}"/><path d="M10 18l-4-7a5 5 0 1 1 8 0z" fill="${ST.accent}" opacity=".6"/>`,
      };

      function svgIcon(name, size) {
        return `<svg viewBox="0 0 20 20" width="${size}" height="${size}" style="display:block;margin:0 auto;">${ICONS[name] || ''}</svg>`;
      }

      const MILESTONES = [
        { year: 2030, icon: 'govt', label: 'Fin gobierno Kast' },
        { year: 2035, icon: 'car', label: 'Autos autónomos masivos' },
        { year: 2040, icon: 'temp', label: 'Meta emisiones cero' },
        { year: 2050, icon: 'rocket', label: 'Humanos en Marte' },
        { year: 2075, icon: 'dna', label: 'Vida > 100 años' },
        { year: 2100, icon: 'wave', label: 'Mar sube 1 metro' },
        { year: 2150, icon: 'bolt', label: 'Fusión nuclear' },
        { year: 2250, icon: 'planet', label: 'Colonias estelares' },
        { year: 2500, icon: 'chip', label: 'Singularidad IA' },
      ];

      const tlContainer = document.createElement('div');
      tlContainer.style.cssText = `padding:16px 0;background:${ST[100]};overflow-x:auto;`;
      el.appendChild(tlContainer);

      const tlSvgWrap = document.createElement('div');
      tlSvgWrap.id = 'milestone-timeline';
      tlSvgWrap.style.cssText = `padding:0 20px;`;
      tlContainer.appendChild(tlSvgWrap);

      // Summary row below timeline
      const summaryDiv = document.createElement('div');
      summaryDiv.id = 'viz-summary';
      summaryDiv.style.cssText = `display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding:12px 20px;background:${ST[100]};font-family:Inter,sans-serif;border-top:1px solid ${ST[200]};`;
      el.appendChild(summaryDiv);

      function render(rate) {
        const yearsNeeded = Math.ceil(TOTAL / (rate * 12));
        const endYear = 2026 + yearsNeeded;
        const deportedPerYear = rate * 12;
        const planesPerMonth = Math.ceil(rate / 230);

        // Update controls
        document.getElementById('rate-value').textContent = rate.toLocaleString('es');
        const ctx = document.getElementById('rate-context');
        if (rate <= 32) {
          ctx.innerHTML = `<span style="color:#dc2626;font-weight:700;">Ritmo actual.</span> 80 deportados en 2,5 meses.`;
        } else if (rate <= 100) {
          ctx.innerHTML = `${Math.round(rate/32)}× el ritmo actual. ~${planesPerMonth} vuelo${planesPerMonth > 1 ? 's' : ''} Boeing 737/mes.`;
        } else if (rate <= 500) {
          ctx.innerHTML = `${Math.round(rate/32)}× el ritmo actual. ~${planesPerMonth} vuelos Boeing 737/mes.`;
        } else {
          ctx.innerHTML = `<span style="color:#dc2626;font-weight:700;">${Math.round(rate/32)}× el ritmo actual.</span> ${planesPerMonth} vuelos/mes. Logísticamente inviable.`;
        }

        // ── Render timeline ──
        const container = document.getElementById('milestone-timeline');
        container.innerHTML = '';

        const tlW = W - 40;
        const tlH = 180;

        const svg = d3.select(container).append('svg')
          .attr('viewBox', `0 0 ${tlW} ${tlH}`)
          .attr('width', '100%')
          .style('font-family', 'Inter, sans-serif')
          .style('display', 'block');

        const xScale = d3.scaleLinear()
          .domain([2026, Math.max(endYear, 2032)])
          .range([40, tlW - 40]);

        const endpoint = { year: endYear, icon: 'flag', label: `Última deportación` };
        const candidates = MILESTONES.filter(m => m.year > 2026 && m.year < endYear);

        // Filter to avoid overlap: ensure minimum pixel distance between points
        const minPxGap = 70;
        const filtered = [];
        let lastPx = xScale(2026);
        for (const m of candidates) {
          const mx = xScale(m.year);
          if (mx - lastPx >= minPxGap) {
            filtered.push(m);
            lastPx = mx;
          }
        }
        const allPoints = [
          { year: 2026, icon: 'pin', label: 'Hoy' },
          ...filtered,
          endpoint,
        ];

        // Background track
        svg.append('line')
          .attr('x1', xScale(2026)).attr('y1', 65)
          .attr('x2', xScale(Math.max(endYear, 2032))).attr('y2', 65)
          .attr('stroke', ST[200]).attr('stroke-width', 6)
          .attr('stroke-linecap', 'round');

        // Colored progress
        const lineColor = endYear <= 2035 ? '#16a34a' : endYear <= 2060 ? ST.accent : '#dc2626';
        svg.append('line')
          .attr('x1', xScale(2026)).attr('y1', 65)
          .attr('x2', xScale(endYear)).attr('y2', 65)
          .attr('stroke', lineColor).attr('stroke-width', 6)
          .attr('stroke-linecap', 'round');

        // Milestone dots, icons, labels
        allPoints.forEach((m, i) => {
          const mx = xScale(m.year);
          const isStart = m.year === 2026;
          const isEnd = m === endpoint;

          // Dot
          svg.append('circle')
            .attr('cx', mx).attr('cy', 65)
            .attr('r', isStart || isEnd ? 8 : 5)
            .attr('fill', isEnd ? lineColor : isStart ? ST[900] : 'white')
            .attr('stroke', isEnd ? lineColor : ST[600])
            .attr('stroke-width', isStart || isEnd ? 0 : 2);

          // Icon above
          const iconSize = isStart || isEnd ? 28 : 24;
          svg.append('foreignObject')
            .attr('x', mx - iconSize/2).attr('y', 22 - iconSize)
            .attr('width', iconSize).attr('height', iconSize)
            .html(svgIcon(m.icon, iconSize));

          // Year below
          svg.append('text')
            .attr('x', mx).attr('y', 85)
            .attr('text-anchor', 'middle')
            .attr('font-size', isEnd ? 18 : isStart ? 14 : 12)
            .attr('font-weight', isEnd || isStart ? 800 : 500)
            .attr('fill', isEnd ? lineColor : ST[900])
            .text(m.year);

          // Label below year — alternate rows
          const row = i % 2;
          svg.append('text')
            .attr('x', mx).attr('y', 103 + row * 16)
            .attr('text-anchor', 'middle')
            .attr('font-size', 10).attr('font-weight', isEnd ? 600 : 400)
            .attr('fill', isEnd ? lineColor : ST[600])
            .text(m.label);
        });

        // Years count moved to summary row below

        // ── Summary row ──
        const totalFlights = Math.ceil(TOTAL / 230);
        summaryDiv.innerHTML = `
          <div style="display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;">
            <span style="font-size:28px;font-weight:900;color:${lineColor};line-height:1;">${yearsNeeded.toLocaleString('es')}</span>
            <span style="font-size:13px;color:${ST[600]};">años — de 2026 a ${endYear.toLocaleString('es')}</span>
          </div>
          <div style="font-size:12px;color:${ST[600]};margin-top:4px;">
            ${deportedPerYear.toLocaleString('es')} deportaciones/año
            <span style="color:${ST[400]};margin:0 6px;">·</span>
            <svg viewBox="0 0 24 24" width="14" height="14" style="vertical-align:middle;margin-right:2px;"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="${ST.accent}"/></svg>
            <strong>${planesPerMonth}</strong> vuelo${planesPerMonth > 1 ? 's' : ''}/mes (Boeing 737 · 230 pax)
            <span style="color:${ST[400]};margin:0 6px;">·</span>
            ${totalFlights.toLocaleString('es')} vuelos totales
          </div>
        `;
      }

      // ── Controls at bottom (so thumb doesn't cover viz on mobile) ──
      const controls = document.createElement('div');
      controls.style.cssText = `font-family:Inter,sans-serif;padding:14px 20px;background:${ST[100]};border-radius:0 0 8px 8px;border-top:1px solid ${ST[200]};`;
      controls.innerHTML = `
        <div style="font-size:12px;color:${ST[600]};margin-bottom:8px;">
          ¿Qué pasa si Chile cambia el ritmo de deportación? Desliza para explorar.
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <input type="range" id="rate-slider" min="32" max="1563" value="${CURRENT_RATE}" step="1"
            style="flex:1;min-width:200px;accent-color:${ST.accent};cursor:pointer;height:28px;">
          <div style="text-align:right;min-width:140px;">
            <span id="rate-value" style="font-size:24px;font-weight:900;color:${ST.accent};">${CURRENT_RATE}</span>
            <span style="font-size:11px;color:${ST[600]};"> dep./mes</span>
          </div>
        </div>
        <div id="rate-context" style="font-size:11px;color:${ST[600]};margin-top:4px;">
          Ritmo actual: 80 deportados en 2,5 meses = 32/mes
        </div>
      `;
      el.appendChild(controls);

      // Initial render
      render(CURRENT_RATE);

      // Slider interaction
      document.getElementById('rate-slider').addEventListener('input', function() {
        render(parseInt(this.value));
      });
    })();

