// @TODO: YOUR CODE HERE!
var svgWidth = 840;
var svgHeight = 480;

var margin = {
    top: 30,
    right: 30,
    bottom: 70,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}

// Function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);

    return yLinearScale;
}

// Function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// Function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var bottomAxis = d3.axisBottom(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return yAxis;
}

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// Function used for updating text in circles group with a transition to new text.
function renderText(circleTextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circleTextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return circleTextGroup;
}

// Function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xLabel;
    var yLabel;

    if (chosenXAxis === "poverty") {
        xLabel = "In Poverty (%)";
    }
    else {
        xLabel = "Age (Median)";
    }

    if (chosenYAxis === "healthcare") {
        yLabel = "Lacks Healthcare (%)";
    }
    else {
        yLabel = "Smokes (%)";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}`)
        });
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (data, err) {
    if (err) throw err;

    // Parse data
    data.forEach(function (d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);

    // yLinearScale function above csv import
    var yLinearScale = yScale(data, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".45");

    // Add text of State abbreviations to initial circles
    var circleTextGroup = chartGroup.selectAll()
        .data(data)
        .enter()
        .append("text")
        .text(d => (d.abbr))
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style("fill", "white");

    // Create axes labels.
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 35 - margin.left)
        .attr("x", 0 - (height / 2.5))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Lacks Healthcare (%)");

        
    chartGroup.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 20)
    .classed("active", true)
    .text("In Poverty (%)");

    // Update circles with new x values.
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
    // Update circles text with new values.
    circleTextGroup = renderText(circleTextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);


}).catch(function (error) {
    console.log(error);
});