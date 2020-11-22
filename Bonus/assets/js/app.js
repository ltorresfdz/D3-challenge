// @TODO: YOUR CODE HERE!

var svgWidth = 850;
var svgHeight = 700;

var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
.classed('chart',true)
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


  var chosenXAxis = "poverty";
	var chosenYAxis = "healthcare";



// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(d) {
      d.poverty = +d.poverty;
		  d.age = +d.age;
		  d.income = +d.income;
		  d.obesity = +d.obesity;
		  d.smokes = +d.smokes;
		  d.healthcare = +d.healthcare;
    });

    // Step 2: Create scale functions
    // d3.extent returns the an array containing the min and max values for the property specified
    // ==============================
    var xScale = getXScaleForAxis(healthData,chosenXAxis);
    var yScale = getYScaleForAxis(healthData,chosenYAxis);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

      chartGroup.append("text")
      .attr("transform", `translate(${width - 40},${height - 5})`)
      .attr("class", "axis-text-main")
      .text("Demographics")

  chartGroup.append("text")
      .attr("transform", `translate(15,60 )rotate(270)`)
      .attr("class", "axis-text-main")
      .text("Behavioral Risk Factors")




    // Step 5: Create Circles
    // ==============================
    var stateCircles = chartGroup.selectAll("circle")  
    .data(healthData)
    .enter()
    .append("circle")
    .classed("stateCircle",true)
    .attr("cx", d => xScale(d[chosenXAxis]))
    .attr("cy", d => yScale(d[chosenYAxis]))
    .attr("r", "9")
    .attr("fill", "blue")
    .attr("opacity", ".7");

    // Create circle labels
    var stateText = chartGroup.append("g").selectAll("text")
        .data(healthData)   
        .enter()
        .append("text")
        .attr("cx", d => xScale(d[chosenXAxis]))
        .attr("cy", d => yScale(d[chosenYAxis]))
        .attr("fill", "white")
        .attr("font-size", "8")
        .attr('transform','translate(0,4.5)')
        .text(d => d.abbr);


    // Step 6: Initialize tool tip
    // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.rockband}<br>Hair length: ${d.hair_length}<br>Hits: ${d.num_hits}`);
    //   });

    // Step 7: Create tooltip in the chart
    // ==============================
    // chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    // circlesGroup.on("click", function(data) {
    //   toolTip.show(data, this);
    // })
      // onmouseout event
    //   .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //   });



    // Create axes labels

    var xLabelsGroup =  chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      var povertyLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 20)
	    .attr('value', 'poverty')
	    .classed('aText active', true)
	    .text('In Poverty (%)');

	var ageLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 40)
	    .attr('value', 'age')
	    .classed('aText inactive', true)
	    .text('Age (Median)');

    var incomeLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 60)
	    .attr('value', 'income')
	    .classed('aText inactive', true)
	    .text('Household Income (Median)');

    var yLabelsGroup = chartGroup.append('g')

	var HealthLabel = yLabelsGroup.append('text')
	    .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
	    .attr('value', 'healthcare')
	    .classed('aText active', true)
	    .text('Lacks Healthcare (%)');

	var smokesLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-60,${height / 2})rotate(-90)`)
	    .attr('value', 'smokes')
	    .classed('aText inactive', true)
	    .text('Smokes (%)');

    var obesityLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-80,${height / 2})rotate(-90)`)
	    .attr('value', 'obesity')
	    .classed('aText inactive', true)
	    .text('Obesse (%)');


      var stateCircles = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText),
      stateText = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText);

      xLabelsGroup.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== chosenXAxis) {
			    chosenXAxis = value;

		        xScale = getXScaleForAxis(data, chosenXAxis);

		        xAxis.transition()
				    .duration(1000)
				    .ease(d3.easeBack)
					.call(d3.axisBottom(xScale));

		        stateCircles.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
			        		.attr("opacity", 0.50)
			        		.attr('r',15);
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
			        		.attr('r',10)
			        })
			        .attr('cx', d => xScale(d[chosenXAxis]));

			    d3.selectAll('.stateText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('x', d => xScale(d[chosenXAxis]));

	        	stateCircles = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText),
				stateText = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText);

		        if (chosenXAxis === 'poverty') {
				    povertyLabel
			            .classed('active', true)
			            .classed('inactive', false);
			        incomeLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            ageLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		        else if (chosenXAxis === 'age'){
		        	povertyLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        incomeLabel
			            .classed('active', false)
			            .classed('inactive', true);
		            ageLabel
			            .classed('active', true)
			            .classed('inactive', false);
		        }
		        else {
		        	povertyLabel
			            .classed('active', false)
			            .classed('inactive', true);
			        incomeLabel
			            .classed('active', true)
			            .classed('inactive', false);
		            ageLabel
			            .classed('active', false)
			            .classed('inactive', true);
		        }
		    }
      });
      

      
    yLabelsGroup.selectAll('text')
    .on('click', function() {
      var value = d3.select(this).attr('value');
      if (value !== chosenYAxis) {
        chosenYAxis = value;

          yScale = getYScaleForAxis(data, chosenYAxis);

          yAxis.transition()
          .duration(1000)
          .ease(d3.easeBack)
        .call(d3.axisLeft(yScale));

          stateCircles.transition()
            .duration(1000)
            .ease(d3.easeBack)
            .on('start',function(){
              d3.select(this)
                .attr("opacity", 0.50)
                .attr('r',15);
            })
            .on('end',function(){
              d3.select(this)
                .attr("opacity", 1)
                .attr('r',10)
            })
            .attr('cy', d => yScale(d[chosenYAxis]));

        d3.selectAll('.stateText').transition()
          .duration(1000)
          .ease(d3.easeBack)
          .attr('y', d => yScale(d[chosenYAxis]));

          stateCircles = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText),
      stateText = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText);

          if (chosenYAxis === 'healthcare') {
          HealthLabel
                .classed('active', true)
                .classed('inactive', false);
            smokesLabel
                .classed('active', false)
                .classed('inactive', true);
              obesityLabel
                .classed('active', false)
                .classed('inactive', true);
          }
          else if (chosenYAxis === 'obesity'){
            HealthLabel
                .classed('active', false)
                .classed('inactive', true);
            smokesLabel
                .classed('active', false)
                .classed('inactive', true);
              obesityLabel
                .classed('active', true)
                .classed('inactive', false);
          }
          else {
            HealthLabel
                .classed('active', false)
                .classed('inactive', true);
            smokesLabel
                .classed('active', true)
                .classed('inactive', false);
              obesityLabel
                .classed('active', false)
                .classed('inactive', true);
          }
      }
    });


  }).catch(function(error) {
    console.log(error);
  });


// Select the x scale, y scale and tool tip information


  function getXScaleForAxis(data,chosenXAxis) {
    var xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis])*.9, 
            d3.max(data, d => d[chosenXAxis])*1.1])
        .range([0, width]);
      
      return xScale;
  }
  
  function getYScaleForAxis(data,chosenYAxis) {
    var yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis])*.9, 
            d3.max(data, d => d[chosenYAxis])*1.1])
        .range([height, 0]);
  
      return yScale;
  }
  
  
  function updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText) {
      var toolTip = d3.tip()
          .attr('class','d3-tip')
          .offset([80, -60])
          .html( d => {
            if(chosenXAxis === "poverty")
                return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
                    <br>${chosenXAxis}:${d[chosenXAxis]}%`)
            else if (chosenXAxis === 'income')
                return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
                    <br>${chosenXAxis}:$${d[chosenXAxis]}`)
            else
              return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
                    <br>${chosenXAxis}:${d[chosenXAxis]}`)
        });
  
    stateCircles.call(toolTip);
    stateCircles.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);
  
    d3.selectAll('.stateText').call(toolTip);
    d3.selectAll('.stateText').on('mouseover', toolTip.show).on('mouseout', toolTip.hide);
  
    return stateCircles;
    return stateText;
  }
