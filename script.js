let listStyles = [
    {
        'background': 'red',
        'color': 'white',
        'width': '35',
    },
    {
        'background': 'yellow',
        'color': 'black',
        'width': '25',
    },
    {
        'background': 'green',
        'color': 'white',
        'width': '50',
    },
    {
        'background': 'black',
        'color': 'white',
        'width': '10',
    },
    {
        'background': 'orange',
        'color': 'white',
        'width': '10',
    },
];

let li = d3.select('body').selectAll('.items li')
    .data(listStyles)
    .style('background', d => d.background)
    .style('color', d => d.color)
    .style('width', d => d.width + '%')
