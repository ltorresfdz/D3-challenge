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

//define initial selected x and y axis
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";



// Import Data and create charts
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
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

      var yAxis = chartGroup.append("g")
      .call(yAxis);
    // Create axes labels
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
    var stateCircles = chartGroup.selectAll('circle')
		.data(healthData)
		.enter()
		.append('circle')
		.classed('stateCircle',true)
		.attr('cx', d => xScale(d[chosenXAxis]))
		.attr('cy', d => yScale(d[chosenYAxis]))
		.attr('r' , 10)

    // Create circle labels
    var stateText = chartGroup.append('g').selectAll('text')
		.data(healthData)
		.enter()
		.append('text')
		.classed('stateText',true)
		.attr('x', d => xScale(d[chosenXAxis]))
		.attr('y', d => yScale(d[chosenYAxis]))
		.attr('transform','translate(0,4.5)')
		.text(d => d.abbr)


 // Create axes labels
 //=============================================
 //create all the x  axes options
  var xLabelsGroup = chartGroup.append('g')
		.attr('transform', `translate(${width / 2}, ${height + 20})`);
  
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

  //create all the y  axes options
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
	    .text('Obese (%)');

    // with these variables calls the function to update the information 
    // shown on the tooltip.  
    var stateCircles = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText);
    var stateText = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText);

    //create an event listeners for each  x axis, then get a scale for the selected x axis data
    //=======================================================================================================  
    xLabelsGroup.selectAll('text').on('click', function() { 
		    var value = d3.select(this).attr('value');//select the text value that was clicked
		    if (value !== chosenXAxis) {
			    chosenXAxis = value;
          //calls the getXScaleFor Axis functions that will generate the scale for the x axis
          xScale = getXScaleForAxis(healthData, chosenXAxis);

          //the x axis created on step 3, line 52, added transition attribute, https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
          xAxis.transition()
				    .duration(1000)
				    .ease(d3.easeBack)
					  .call(d3.axisBottom(xScale));
          //added transition attribute, ease, on, start,  reference: https://github.com/d3/d3-transition 
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

    //calls function to update the information to display on the tooltip depending 
    //on the information selected on the x  axis.
            
        stateCircles = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText),
				stateText = updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText);
    
     //setting to active axis the selected data, and inactive the other options   
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
      

    // Everything that was done for the X axis, is repeated for the y axis:  
    yLabelsGroup.selectAll('text')
    .on('click', function() {
      var value = d3.select(this).attr('value');
      if (value !== chosenYAxis) {
        chosenYAxis = value;
        yScale = getYScaleForAxis(healthData, chosenYAxis);

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



    function getXScaleForAxis(datos,chosenXAxis) {
      var xScale = d3.scaleLinear()
          .domain([d3.min(datos, d => d[chosenXAxis])*.9, 
              d3.max(datos, d => d[chosenXAxis])*1.1])
          .range([0, width]);
        
        return xScale;
    }
    
  function getYScaleForAxis(datos,chosenYAxis) {
      var yScale = d3.scaleLinear()
          .domain([d3.min(datos, d => d[chosenYAxis])*.9, 
              d3.max(datos, d => d[chosenYAxis])*1.1])
          .range([height, 0]);
    
        return yScale;
    }
    
    //This function updates the information to display on the tooltip depending 
    //on the information selected on the x  axis.
    function updateToolTip(chosenYAxis,chosenXAxis,stateCircles,stateText) {
     
    //Initialize tool tip
      var toolTip = d3.tip()
          .attr("class","d3-tip")
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
   // Create tooltip in the chart
    stateCircles.call(toolTip);
   // Create event listeners to display and hide the tooltip
    stateCircles.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);
  
    d3.selectAll('.stateText').call(toolTip);
    d3.selectAll('.stateText').on('mouseover', toolTip.show).on('mouseout', toolTip.hide);
  
    return stateCircles;
    return stateText;
  }  

  }).catch(function(error) {
    console.log(error);
  });




