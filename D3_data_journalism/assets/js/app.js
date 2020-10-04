//**Healthcare vs Poverty */

// Make chart responsive
async function makeResponsive() {
    var svgArea = d3.select("#scatter").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50,
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
    var chartGroup = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    (async function() {
        var healthcareData = await d3
            .csv("assets/data/data.csv")
            .catch(function(error) {
                console.log(error);
            });
        console.log(healthcareData);

        //parse data
        healthcareData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });
        console.log(healthcareData);

        //create scale functions
        var xScale = d3
            .scaleLinear()
            .domain([9, d3.max(healthcareData, (d) => d.poverty)])
            .range([0, width]);
        var yScale = d3
            .scaleLinear()
            .domain([4, d3.max(healthcareData, (d) => d.healthcare)])
            .range([height, 0]);

        //create axis functions
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        //append axes to the chart
        chartGroup
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
        chartGroup.append("g").call(yAxis);

        //create circles
        var circlesGroup = chartGroup
            .selectAll("circle")
            .data(healthcareData)
            .join("circle")
            .attr("cx", (d) => xScale(d.poverty))
            .attr("cy", (d) => yScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "blue");

        //create text in circles
        var textGroup = chartGroup
            .selectAll("text.my-state")
            .data(healthcareData)
            .join("text")
            .attr("x", (d) => xScale(d.poverty))
            .attr("y", (d) => yScale(d.healthcare))
            .attr("fill", "black")
            .attr("dx", function(d) {
                return -10;
            })
            .attr("dy", function(d) {
                return 5;
            })
            .attr("fill", "white")
            .attr("stroke-width", 1)
            .classed("my-state", true)
            .text(function(d) {
                return d.abbr;
            });

        //create axes labels
        chartGroup
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");
        chartGroup
            .append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");
    })();
}

makeResponsive();

d3.select(window).on("resize", makeResponsive);