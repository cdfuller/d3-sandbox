function update() {

  // let dataset = [
  //     { label: 'Abulia', count: 10 },
  //     { label: 'Betelgeuse', count: 20 },
  //     { label: 'Cantaloupe', count: 30 },
  //     { label: 'Dijkstra', count: 40 },
  //   ];
    
    let width = 360;
    let height = 360;
    let donutWidth = 75;
    let radius = Math.min(width, height) / 2;
    
    let legendRectSize = 18;
    let legendSpacing = 4;
    
    let color = d3.scaleOrdinal(d3.schemeCategory20c);
    
    let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
    
    let arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);
    
    let pie = d3.pie()
    .value(d => d.count)
    .sort(null);

    let tooltip = d3.select('#chart')
      .append('div')
      .attr('class', 'tooltip');

    tooltip.append('div')
      .attr('class', 'label')

    tooltip.append('div')
      .attr('class', 'count');

    tooltip.append('div')
      .attr('class', 'percent');


    d3.csv('weekdays.csv', (err, dataset) => {
      dataset.forEach(d => {
        d.count = +d.count;
        d.enabled = true;
      });

      let path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(d.data.label))
      .each(d => this._current = d);

      path.on('mouseover', d => {
        let total = d3.sum(dataset.map(d => (d.enabled) ? d.count : 0));
        let percent = Math.round(1000 * d.data.count / total) / 10;
        tooltip.select('.label').html(d.data.label);
        tooltip.select('.count').html(d.data.count);
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('display', 'block');
      });

      path.on('mouseout', d => {
        tooltip.style('display', 'none');
      });

      path.on('mousemove', d => {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
          .style('left', (d3.event.layerX + 10) + 'px');
      })
      
      let legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        let height = legendRectSize + legendSpacing;
        let offset = height * color.domain().length / 2;
        let horz = -2 * legendRectSize;
        let vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });
      
      legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color)
      .on('click', function(label) {

        let rect = d3.select(this);
        let enabled = true;
        let totalEnabled = d3.sum(dataset.map(d => {
          return (d.enabled) ? 1 : 0;
        }));

        if (rect.attr('class') === 'disabled') {
          rect.attr('class', '');
        } else {
          if (totalEnabled < 2) return;
          rect.attr('class', 'disabled');
          enabled = false;
        }

        pie.value(d => {
          if (d.label === label) d.enabled = enabled;
          return (d.enabled) ? d.count : 0;
        })

        path = path.data(pie(dataset));

        path.transition()
          .duration(750)
          .attrTween('d', d => {
            let interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              return arc(interpolate(t));
            }
          });
      })
      
      legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(d => d.toUpperCase());

    });
  }