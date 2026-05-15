  (function() {
    const container = document.getElementById('viz-contadores');
    if (!container) return;

    const KILLED_PER_DAY = 10;
    const MISSING_PER_DAY = 80;
    const IMPUNITY = 88;

    const isMobile = window.innerWidth < 640;
    const width = container.clientWidth;
    const calCols = 7;
    const calRows = 5; // 31 days
    const cellSize = isMobile ? Math.floor((width - 40) / 9) : 52;
    const cellGap = isMobile ? 3 : 5;
    const calW = calCols * (cellSize + cellGap) - cellGap;

    // Layout: calendar left, impunity right (desktop) or stacked (mobile)
    const impunityW = isMobile ? width : 180;
    const totalCalW = isMobile ? width - 24 : calW;
    const totalH = isMobile ? calRows * (cellSize + cellGap) + 220 : calRows * (cellSize + cellGap) + 140;

    const wrapper = d3.select(container).append('div')
      .style('position', 'relative')
      .style('width', width + 'px');

    // Title
    wrapper.append('div')
      .style('font-family', 'Montserrat, sans-serif')
      .style('font-size', isMobile ? '14px' : '16px')
      .style('font-weight', '700')
      .style('color', '#3B3231')
      .style('margin-bottom', '4px')
      .style('text-align', 'center')
      .text('Un mes en México');

    wrapper.append('div')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '11px')
      .style('color', '#B69476')
      .style('margin-bottom', '16px')
      .style('text-align', 'center')
      .text('Simulación basada en cifras oficiales: 10 mujeres asesinadas y 80 desaparecidas cada día');

    // Main layout
    const layout = wrapper.append('div')
      .style('display', 'flex')
      .style('flex-direction', isMobile ? 'column' : 'row')
      .style('align-items', isMobile ? 'center' : 'flex-start')
      .style('justify-content', 'center')
      .style('gap', isMobile ? '16px' : '24px')
      .style('padding', '0 12px');

    // Calendar container
    const calContainer = layout.append('div');

    // Day headers
    const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const headerRow = calContainer.append('div')
      .style('display', 'grid')
      .style('grid-template-columns', 'repeat(7, ' + cellSize + 'px)')
      .style('gap', cellGap + 'px')
      .style('margin-bottom', '4px');

    dayNames.forEach(d => {
      headerRow.append('div')
        .style('text-align', 'center')
        .style('font-family', 'Inter, sans-serif')
        .style('font-size', '9px')
        .style('font-weight', '600')
        .style('color', '#B69476')
        .text(d);
    });

    // Calendar grid
    const grid = calContainer.append('div')
      .style('display', 'grid')
      .style('grid-template-columns', 'repeat(7, ' + cellSize + 'px)')
      .style('gap', cellGap + 'px');

    const cells = [];
    // Start on Thursday (May 2026 starts on Friday, but we use a generic month)
    const startOffset = 3; // 3 empty cells before day 1 (Thursday start)
    for (let i = 0; i < startOffset; i++) {
      grid.append('div').style('width', cellSize + 'px').style('height', cellSize + 'px');
    }

    for (let day = 1; day <= 31; day++) {
      const cell = grid.append('div')
        .style('width', cellSize + 'px')
        .style('height', cellSize + 'px')
        .style('border-radius', '6px')
        .style('background', '#f0e6da')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('transition', 'background 0.3s, transform 0.2s')
        .style('position', 'relative');

      cell.append('div')
        .style('font-family', 'Montserrat, sans-serif')
        .style('font-size', isMobile ? '11px' : '14px')
        .style('font-weight', '700')
        .style('color', '#B69476')
        .attr('class', 'day-num')
        .text(day);

      cells.push(cell);
    }

    // Right panel: counters + impunity
    const panel = layout.append('div')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('gap', '12px')
      .style('min-width', isMobile ? '100%' : '180px');

    // Killed counter
    const killedBox = panel.append('div')
      .style('background', 'rgba(196, 30, 58, 0.08)')
      .style('border-left', '3px solid #C41E3A')
      .style('border-radius', '8px')
      .style('padding', isMobile ? '10px 14px' : '14px 18px');

    const killedNum = killedBox.append('div')
      .style('font-family', 'Montserrat, sans-serif')
      .style('font-size', isMobile ? '28px' : '36px')
      .style('font-weight', '900')
      .style('color', '#C41E3A')
      .style('line-height', '1')
      .text('0');

    killedBox.append('div')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('color', '#C41E3A')
      .style('margin-top', '4px')
      .text('mujeres asesinadas');

    // Missing counter
    const missingBox = panel.append('div')
      .style('background', 'rgba(123, 81, 55, 0.08)')
      .style('border-left', '3px solid #7B5137')
      .style('border-radius', '8px')
      .style('padding', isMobile ? '10px 14px' : '14px 18px');

    const missingNum = missingBox.append('div')
      .style('font-family', 'Montserrat, sans-serif')
      .style('font-size', isMobile ? '28px' : '36px')
      .style('font-weight', '900')
      .style('color', '#7B5137')
      .style('line-height', '1')
      .text('0');

    missingBox.append('div')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('color', '#7B5137')
      .style('margin-top', '4px')
      .text('niñas y mujeres desaparecidas');

    // Impunity fixed
    const impBox = panel.append('div')
      .style('background', 'rgba(59, 50, 49, 0.08)')
      .style('border-left', '3px solid #3B3231')
      .style('border-radius', '8px')
      .style('padding', isMobile ? '10px 14px' : '14px 18px');

    impBox.append('div')
      .style('font-family', 'Montserrat, sans-serif')
      .style('font-size', isMobile ? '28px' : '36px')
      .style('font-weight', '900')
      .style('color', '#3B3231')
      .style('line-height', '1')
      .text('88%');

    impBox.append('div')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('color', '#3B3231')
      .style('margin-top', '4px')
      .text('no se investigan como feminicidio');

    // Slider
    const sliderWrap = wrapper.append('div')
      .style('padding', '16px 12px 0')
      .style('max-width', isMobile ? '100%' : (calW + impunityW + 36) + 'px')
      .style('margin', '0 auto');

    const slider = sliderWrap.append('input')
      .attr('type', 'range')
      .attr('min', 0)
      .attr('max', 31)
      .attr('value', 0)
      .attr('step', 1)
      .style('width', '100%')
      .style('cursor', 'pointer')
      .style('accent-color', '#C41E3A');

    const dayLabel = sliderWrap.append('div')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('color', '#B69476')
      .style('text-align', 'center')
      .style('margin-top', '6px')
      .text('Día 0 de 31');

    function update(day) {
      cells.forEach((cell, i) => {
        const d = i + 1;
        if (d <= day) {
          cell.style('background', d === day ? '#C41E3A' : 'rgba(196, 30, 58, 0.25)')
            .style('transform', d === day ? 'scale(1.08)' : 'scale(1)');
          cell.select('.day-num').style('color', d === day ? '#fff' : '#C41E3A');
        } else {
          cell.style('background', '#f0e6da').style('transform', 'scale(1)');
          cell.select('.day-num').style('color', '#B69476');
        }
      });

      killedNum.text(day * KILLED_PER_DAY);
      missingNum.text((day * MISSING_PER_DAY).toLocaleString('es'));

      if (day === 0) {
        dayLabel.text('Día 0 de 31');
      } else if (day === 1) {
        dayLabel.text('Día 1 — un solo día');
      } else {
        dayLabel.text('Día ' + day + ' de 31');
      }
    }

    slider.on('input', function() { update(+this.value); });

    // Auto-play on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let currentDay = 0;
          const interval = setInterval(() => {
            currentDay++;
            if (currentDay > 31) { clearInterval(interval); return; }
            slider.property('value', currentDay);
            update(currentDay);
          }, 150);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(container);
  })();
