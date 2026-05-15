    // ── VIZ 4: Recortes vs nueva carga ──
    (function() {
      const el = document.getElementById('viz-recortes');
      const w = el.clientWidth;
      const h = 220;
      const leftM = Math.max(w * 0.18, 80);
      const m = { top: 50, right: 20, bottom: 20, left: leftM };

      const svg = d3.select('#viz-recortes').append('svg')
        .attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%')
        .style('font-family', 'Inter, sans-serif');

      svg.append('text').attr('x', m.left).attr('y', 20)
        .attr('font-size', w < 500 ? 13 : 16).attr('font-weight', 700).attr('fill', ST[900])
        .text('Menos presupuesto, más responsabilidades');

      svg.append('text').attr('x', m.left).attr('y', 36)
        .attr('font-size', w < 500 ? 9 : 11).attr('fill', ST[600])
        .text('Recortes + nueva carga de reportar migrantes');

      const data = [
        { name: 'Sanidad', cut: 478 },
        { name: 'Educación', cut: 247 },
      ];

      const x = d3.scaleLinear().domain([0, 550]).range([m.left, w - m.right]);
      const y = d3.scaleBand().domain(data.map(d => d.name)).range([m.top + 10, h - m.bottom]).padding(0.4);

      // Bars (going right = money lost)
      data.forEach(d => {
        svg.append('rect')
          .attr('x', m.left).attr('y', y(d.name))
          .attr('width', x(d.cut) - m.left).attr('height', y.bandwidth())
          .attr('fill', '#dc2626').attr('rx', 3).attr('opacity', 0.85);

        svg.append('text')
          .attr('x', m.left - 10).attr('y', y(d.name) + y.bandwidth() / 2)
          .attr('dy', '0.35em').attr('text-anchor', 'end')
          .attr('font-size', 13).attr('fill', ST[900]).attr('font-weight', 600)
          .text(d.name);

        svg.append('text')
          .attr('x', x(d.cut) + 8).attr('y', y(d.name) + y.bandwidth() / 2)
          .attr('dy', '0.35em')
          .attr('font-size', 13).attr('font-weight', 700).attr('fill', '#dc2626')
          .text(`-$${d.cut}M`);

        // New burden label
        svg.append('text')
          .attr('x', m.left + 10).attr('y', y(d.name) + y.bandwidth() / 2)
          .attr('dy', '0.35em')
          .attr('font-size', 10).attr('fill', 'white').attr('font-weight', 600)
          .text('+ Reportar migrantes irregulares');
      });
    })();
  </script>
</EdicionLayout>
