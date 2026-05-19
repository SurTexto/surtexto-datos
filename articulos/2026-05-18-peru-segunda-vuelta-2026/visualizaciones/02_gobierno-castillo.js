// VIZ 2: Timeline animado — arco con clímax en autogolpe
// Requiere D3 v7: https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js
// Montar en: <div id="viz-castillo"></div>

(function() {
    const container = document.getElementById('viz-castillo');
    if (!container) return;
    container.style.position = 'relative';

    const isMobile = window.innerWidth < 640;
    const w = container.clientWidth || 600;
    const h = isMobile ? 268 : 310;

    // ── Geometría del arco ──────────────────────────────────
    const tlPad = isMobile ? 18 : 40;
    const tlW   = w - tlPad * 2;
    const baseY = isMobile ? 178 : 210;
    const peakY = isMobile ? 66  : 78;

    const govStart  = new Date('2021-07-28');
    const autogolpe = new Date('2022-12-07');
    const sentencia = new Date('2025-11-27');

    function xPos(dateStr) {
      const d = new Date(dateStr);
      if (d <= autogolpe) {
        const frac = (d - govStart) / (autogolpe - govStart);
        return tlPad + frac * tlW * 0.58;
      } else {
        const frac = (d - autogolpe) / (sentencia - autogolpe);
        return tlPad + tlW * 0.58 + frac * tlW * 0.42;
      }
    }

    const xStart = xPos('2021-07-28');
    const xPeak  = xPos('2022-12-07');
    const xEnd   = xPos('2025-11-27');

    function arcY(x) {
      const ref = x <= xPeak ? xStart : xEnd;
      const t = (x - xPeak) / (ref - xPeak);
      return peakY + (baseY - peakY) * t * t;
    }

    // ── Eventos con descripciones ───────────────────────────
    const eventos = [
      {
        fecha: '2021-07-28', color: '#2C6E49', arriba: true, xOff: 0,
        label: 'Asume la presidencia',
        sub: '28 jul 2021',
        desc: 'Pedro Castillo, maestro rural y sindicalista de Cajamarca, asume como presidente con el 50,13% de los votos. Ganó por 44.263 votos a Keiko Fujimori.',
      },
      {
        fecha: '2021-11-01', color: '#C67132', arriba: false, xOff: 0,
        label: '1ª vacancia fallida',
        sub: 'nov 2021 · 46 votos',
        desc: 'El Congreso intenta vacarlo por primera vez. Solo 46 votos a favor, muy lejos de los 87 necesarios. Castillo sobrevive, pero su gobierno ya está en crisis.',
      },
      {
        fecha: '2022-03-28', color: '#C67132', arriba: false, xOff: 0,
        label: '2ª vacancia fallida',
        sub: 'mar 2022 · 55 votos',
        desc: 'Segundo intento. 55 votos, aún insuficientes. En 17 meses de gobierno, Castillo cambia 5 gabinetes y más de 80 ministros. La inestabilidad es permanente.',
      },
      {
        fecha: '2022-12-07', color: '#C41E3A', arriba: true, xOff: 0,
        label: 'Autogolpe y detención',
        sub: '7 dic 2022 · 11:48h',
        desc: 'A las 11:48h, Castillo anuncia por cadena la disolución del Congreso. La Fiscalía lo rechaza en minutos. El Congreso lo vaca con 101 votos. Dos horas después, lo detienen en la avenida Garcilaso de la Vega cuando intentaba llegar a la embajada de México.',
      },
      {
        fecha: '2025-11-27', color: '#3B3231', arriba: true, xOff: 0,
        label: 'Condenado a 11 años',
        sub: '27 nov 2025',
        desc: 'El Tribunal Supremo lo condena a 11 años, 5 meses y 15 días por conspiración para la rebelión. Sigue preso en el penal Barbadillo de Lima. Roberto Sánchez, su exministro, corre en su nombre en 2026.',
      },
    ];

    // Progreso de cada evento en el arco (0→1)
    eventos.forEach(function(e) {
      const x = xPos(e.fecha) + (e.xOff || 0);
      e.x = x;
      e.y = arcY(x);
      e.progress = (x - xStart) / (xEnd - xStart);
    });

    // ── SVG ────────────────────────────────────────────────
    const svg = d3.select(container).append('svg')
      .attr('width', w).attr('height', h).style('display','block');

    svg.append('rect').attr('width', w).attr('height', h).attr('fill', '#FAF7F2');

    svg.append('text').attr('x', w / 2).attr('y', isMobile ? 18 : 22)
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 13 : 16)
      .attr('font-weight', 700).attr('fill', '#3B3231')
      .text('Los 497 días de Castillo: del Palacio al penal');

    // Relleno degradado
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'arcGrad2')
      .attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1');
    grad.append('stop').attr('offset','0%').attr('stop-color','#C41E3A').attr('stop-opacity', 0.08);
    grad.append('stop').attr('offset','100%').attr('stop-color','#C41E3A').attr('stop-opacity', 0);

    const nPts = 120;
    const arcPts = d3.range(nPts + 1).map(function(i) {
      const x = xStart + (xEnd - xStart) * i / nPts;
      return [x, arcY(x)];
    });

    const areaFn = d3.area().x(d => d[0]).y0(baseY).y1(d => d[1]).curve(d3.curveCatmullRom.alpha(0.5));
    svg.append('path').datum(arcPts).attr('d', areaFn).attr('fill', 'url(#arcGrad2)');

    const lineFn = d3.line().x(d => d[0]).y(d => d[1]).curve(d3.curveCatmullRom.alpha(0.5));
    svg.append('path').datum(arcPts).attr('d', lineFn)
      .attr('fill', 'none').attr('stroke', '#B69476').attr('stroke-width', 2.5);

    svg.append('line').attr('x1', xStart).attr('y1', baseY)
      .attr('x2', xEnd).attr('y2', baseY).attr('stroke', '#D4C4B0').attr('stroke-width', 0.8);

    // Anotaciones de periodo
    svg.append('text').attr('x', (xStart + xPeak) / 2).attr('y', baseY + (isMobile ? 16 : 20))
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 7 : 8)
      .attr('fill', '#B69476').attr('font-style', 'italic')
      .text('← 497 días de gobierno · 5 gabinetes →');
    svg.append('text').attr('x', (xPeak + xEnd) / 2).attr('y', baseY + (isMobile ? 16 : 20))
      .attr('text-anchor', 'middle').attr('font-size', isMobile ? 7 : 8)
      .attr('fill', '#B69476').attr('font-style', 'italic')
      .text('← en prisión →');

    // Puntos de evento (inicialmente pequeños y gris claro)
    const dotR = isMobile ? 5 : 6;
    const lineLen = isMobile ? 18 : 22;
    const fsLabel = isMobile ? 8 : 9;

    const dotEls = eventos.map(function(e) {
      return svg.append('circle')
        .attr('cx', e.x).attr('cy', e.y).attr('r', dotR)
        .attr('fill', '#D4C4B0').attr('stroke', '#FAF7F2').attr('stroke-width', 1.5);
    });

    // Labels con transparencia en el estado inicial
    const labelGroups = eventos.map(function(e) {
      const dy = e.arriba ? -1 : 1;
      const g = svg.append('g').attr('opacity', 0.38);

      g.append('line')
        .attr('x1', e.x).attr('y1', e.y)
        .attr('x2', e.x).attr('y2', e.y + dy * lineLen)
        .attr('stroke', '#B69476').attr('stroke-width', 1);

      const textY = e.y + dy * (lineLen + (isMobile ? 11 : 13));
      g.append('text').attr('x', e.x).attr('y', textY)
        .attr('text-anchor', 'middle').attr('font-size', fsLabel)
        .attr('font-weight', 700).attr('fill', '#7B5137')
        .text(e.label);
      g.append('text').attr('x', e.x).attr('y', textY + (isMobile ? 11 : 13))
        .attr('text-anchor', 'middle').attr('font-size', isMobile ? 7 : 8)
        .attr('fill', '#B69476')
        .text(e.sub);

      return g;
    });

    // Bolita animada (oculta al inicio)
    const ball = svg.append('circle').attr('r', isMobile ? 8 : 10)
      .attr('cx', xStart).attr('cy', arcY(xStart))
      .attr('fill', '#C41E3A').attr('stroke', '#FAF7F2').attr('stroke-width', 2)
      .style('display', 'none').style('filter', 'drop-shadow(0 2px 4px rgba(196,30,58,0.4))');

    // ── Card HTML ──────────────────────────────────────────
    const card = document.createElement('div');
    Object.assign(card.style, {
      position: 'absolute', display: 'none', zIndex: '10',
      background: 'white', border: '1px solid #E8DDD0',
      borderRadius: '10px', padding: isMobile ? '12px 14px' : '16px 20px',
      boxShadow: '0 4px 20px rgba(59,50,49,0.14)',
      maxWidth: isMobile ? '210px' : '260px',
      fontFamily: 'sans-serif', pointerEvents: 'auto',
    });
    container.appendChild(card);

    // ── Botón play ─────────────────────────────────────────
    const btn = document.createElement('button');
    btn.textContent = '▶  Ver la historia';
    Object.assign(btn.style, {
      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      bottom: isMobile ? '34px' : '40px',
      background: '#3B3231', color: 'white', border: 'none',
      borderRadius: '20px', padding: isMobile ? '7px 18px' : '8px 22px',
      fontSize: isMobile ? '12px' : '13px', fontWeight: '700',
      fontFamily: 'sans-serif', cursor: 'pointer', letterSpacing: '0.04em',
      boxShadow: '0 2px 8px rgba(59,50,49,0.25)',
    });
    container.appendChild(btn);

    // ── Lógica de animación ────────────────────────────────
    let currentIdx = -1;
    let animFrame = null;
    let animating = false;

    function showCard(e) {
      const svgRect = container.getBoundingClientRect();
      const svgEl = container.querySelector('svg');
      const svgElemRect = svgEl.getBoundingClientRect();
      const relLeft = svgElemRect.left - svgRect.left;
      const relTop  = svgElemRect.top  - svgRect.top;
      const scale   = svgElemRect.width / w;

      const bx = relLeft + e.x * scale;
      const by = relTop  + e.y * scale;

      const cardW = isMobile ? 210 : 260;
      let left = bx - cardW / 2;
      left = Math.max(4, Math.min(left, container.clientWidth - cardW - 4));

      const above = e.arriba || e.y > baseY - 40;
      const top = above ? Math.max(4, by - (isMobile ? 120 : 145)) : by + (isMobile ? 18 : 22);

      card.style.left  = left + 'px';
      card.style.top   = top  + 'px';
      card.style.borderLeft = '3px solid ' + e.color;

      const isLast = (currentIdx === eventos.length - 1);
      card.innerHTML =
        '<div style="font-size:' + (isMobile ? '11px' : '13px') + ';font-weight:700;color:' + e.color + ';margin-bottom:3px">' + e.label + '</div>' +
        '<div style="font-size:' + (isMobile ? '10px' : '11px') + ';color:#B69476;margin-bottom:8px">' + e.sub + '</div>' +
        '<div style="font-size:' + (isMobile ? '11px' : '12px') + ';color:#3B3231;line-height:1.5;margin-bottom:10px">' + e.desc + '</div>' +
        '<button id="card-next-btn" style="background:' + e.color + ';color:white;border:none;border-radius:14px;padding:5px 14px;font-size:' + (isMobile ? '11px' : '12px') + ';font-weight:700;cursor:pointer">' +
        (isLast ? '↺ Reiniciar' : 'Continuar →') + '</button>';

      card.style.display = 'block';

      document.getElementById('card-next-btn').addEventListener('click', function() {
        card.style.display = 'none';
        if (isLast) {
          resetViz();
        } else {
          currentIdx++;
          animateTo(eventos[currentIdx]);
        }
      });
    }

    function animateTo(e) {
      animating = true;
      const startX = parseFloat(ball.attr('cx'));
      const targetX = e.x;
      const duration = Math.max(800, Math.abs(targetX - startX) / (xEnd - xStart) * 2800);
      const startTime = performance.now();

      function frame(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
        const cx = startX + (targetX - startX) * eased;
        const cy = arcY(cx);
        ball.attr('cx', cx).attr('cy', cy);

        if (t < 1) {
          animFrame = requestAnimationFrame(frame);
        } else {
          animating = false;
          // Iluminar el punto del evento
          dotEls[currentIdx]
            .attr('fill', e.color)
            .attr('r', dotR + 2);
          ball.style('display', 'none');
          // Mostrar card
          showCard(e);
        }
      }
      animFrame = requestAnimationFrame(frame);
    }

    function startPlay() {
      btn.style.display = 'none';
      card.style.display = 'none';
      // Ocultar labels del estado mudo
      labelGroups.forEach(function(g) { g.style('display', 'none'); });
      // Reset dots
      dotEls.forEach(function(d) { d.attr('fill','#D4C4B0').attr('r', dotR); });
      ball.attr('cx', xStart).attr('cy', arcY(xStart)).style('display', null);
      currentIdx = 0;
      setTimeout(function() { animateTo(eventos[0]); }, 400);
    }

    function resetViz() {
      currentIdx = -1;
      card.style.display = 'none';
      ball.style('display', 'none');
      dotEls.forEach(function(d) { d.attr('fill','#D4C4B0').attr('r', dotR); });
      // Restaurar labels del estado mudo
      labelGroups.forEach(function(g) { g.style('display', null); });
      btn.textContent = '▶  Ver la historia';
      btn.style.display = 'block';
    }

    btn.addEventListener('click', startPlay);
  })();
