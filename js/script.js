
// margin
const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// svg 
const svg = d3.select('#vis')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


// scales
const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

// draw axes
const xAxis = d3.axisBottom(xScale);
svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

const yAxis = d3.axisLeft(yScale).ticks(5);
svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);


// data
let currentData = [];

d3.json('data/data.json')
    .then(data => {
        console.log(data)
        currentData = data.points;
        updateVis(currentData);
    })
    .catch(error => console.error('Error loading data:', error));

    // Without transition

// function updateVis() {
//     const points = svg.selectAll('.point')
//         .data(data, d => d.id)
//         .join(function (enter) {
//             enter.append('circle')
//                  .attr('cx', d => xScale(d.x))
//                  .attr('cy', d => yScale(d.y))
//                  .style('fill', d => d.color)
//                  .attr('class', 'point')
//                  .attr('r', 6)
//         },
//             function (update) {
//                 update.attr('cx', d => xScale(d.x))
//                       .attr('cy', d => yScale(d.y))
//             },
//             function (exit) {
//                 exit.remove()
//             }
//         )
// }

function updateVis() {
    const points = svg.selectAll('.point')
        .data(currentData, d => d.id)
        .join( (enter) => {
            enter.append('circle')
                 .attr('cx', d => xScale(d.x))
                 .attr('cy', d => yScale(d.y))
                 .style('fill', d => d.color)
                 .attr('class', 'point')
                 .attr('r', 0)
                 .transition()
                 .duration(500)
                 .attr('r', 6)
        },
            function (update) {
                update.transition()
                      .duration(500)
                      .attr('cx', d => xScale(d.x))
                      .attr('cy', d => yScale(d.y))
            },
            function (exit) {
                exit 
                .transition()
                .duration(500)
                .attr('r', 0)
                .remove()
            }
        )
}

function addRandomPoint() {
    const newPoint = {
        id: currentData.length + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: 'red'
    };
    currentData.push(newPoint);
    updateVis();
}

function removeRandomPoint() {
        currentData.pop()
        updateVis();
}

function updateRandomPoints() {
    currentData = currentData.map(d => ({
        ...d,
        x: Math.max(0, d.x + (Math.random() - 0.5) * 20),
        y: Math.max(0, d.y + (Math.random() - 0.5) * 20)
    }));
    updateVis();
}