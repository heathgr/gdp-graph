/*global window, console, d3*/

/*
	targetElement is a string, a css selector identifiying the element the graph will be built in
	data is a json data containing the data needed to create the graph
*/
function gdpGraph(targetElement, data){	
	
	var graphDiv = d3.select(targetElement); //a reference to the div the graph will be placed in
	var graphWidth = parseInt(graphDiv.style("width"));
	var graphHeight = parseInt(graphDiv.style("height"));
	var graphBarWidth = graphWidth / data.length;
	var graphBarHorizontalMargin = 4;
	var axisHeight = 20;
	var axisWidth = 55;
	
	//find the min and max years and gdp
	var minYear = d3.min(data, function(d){return parseInt(d.year);});
	var maxYear = d3.max(data, function(d){return parseInt(d.year);});
	var minGDP = d3.min(data, function(d){return parseFloat(d.gdp);});
	var maxGDP = d3.max(data, function(d){return parseFloat(d.gdp);});
	
	//create scale objects to map graph data
	var GDPPadding = maxGDP * 0.1; //used to pad the GDPScale so that min and max values aren't at edge of graph
	var yearScale = d3.scale.linear().domain([minYear, maxYear + 1]).range([0, graphWidth - axisWidth]);
	var GDPScale = d3.scale.linear().domain([minGDP - GDPPadding, maxGDP + GDPPadding]).range([graphHeight - axisHeight, 0]);
	
	var animationTime = 500;
	var animationOffset = 25;
	
	//create an svg element to place the graph in
	var graphSVG = graphDiv
		.append("svg") 
		.attr("width", graphWidth)
		.attr("height", graphHeight);
	//create rectangle elements for the graph's bars
	var graphGroup = graphSVG
		.append("g");
	var graphItems = graphGroup
		.attr("transform", "translate(" + axisWidth + ", 0)")
		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("class", "graphBar")
		.attr("width", yearScale(minYear + 1) - (graphBarHorizontalMargin * 2))
		.attr("height", function(d){return GDPScale(minGDP + (maxGDP - d.gdp));})
		.attr("x", function(d){return yearScale(d.year) + graphBarHorizontalMargin;})
		.attr("y", function(d){return GDPScale(d.gdp);})
		.style("opacity", 0)
		.on("mouseover", onMouseOver)
		.on("mousemove", onMouseOver)
		.on("mouseout", onMouseOut)
		.transition()
			.duration(animationTime)
			.delay(function(d, i) {return animationOffset * (i + 1);})
			.style("opacity", 1);
	var title = graphGroup
		.append("text")
		.text("United States Gross Domestic Product " + minYear + "-" + maxYear)
		.attr("class", "graphTitle")
		.attr("x", (graphWidth - axisWidth) * 0.5)
		.attr("y", graphHeight * 0.1)
		.style("opacity", 0)
		.transition()
			.duration(animationTime)
			.delay(animationOffset * 2)
			.style("opacity", 1);
	
	//add axis to the bottom and top of graph
	var commasFormatter = d3.format(",.0f");
	var yearAxis = d3.svg.axis()
		.scale(yearScale)
		.ticks(data.length + 1)
		.tickFormat(d3.format(""))
		.tickSize(0)
		.tickValues(
			function(){
				var values = [];
				
				for(var i = minYear; i <= maxYear; i++){
					values.push(i);
				}
				return values;
			}
		)
		.orient("bottom");
	var GDPAxis = d3.svg.axis()
		.scale(GDPScale)
		.tickFormat(function(d){return "$" + commasFormatter(d) + "B";})
		.orient("left");
	
	graphSVG
		.append("g")
		.attr("class", "xAxis")
		.call(yearAxis)
		.attr("transform", "translate(" + axisWidth + ", " + (graphHeight - axisHeight) + ")")
		.style("opacity", 0)
		.transition()
			.duration(animationTime)
			.delay(animationOffset)
			.style("opacity", 1);
	graphSVG
		.append("g")
		.attr("class", "yAxis")
		.call(GDPAxis)
		.attr("transform", "translate(" + axisWidth + ", 0)")
		.style("opacity", 0)
		.transition()
			.duration(animationTime)
			.style("opacity", 1);
	d3.selectAll(".xAxis text")
		.attr("x", yearScale(minYear + 1) * 0.5);
	
	//TODO create the elements used for the tooltip
	
	
	//MOUSE EVENT HANDLERS
	//show and place the tooltip
	function onMouseOver(evt) {
		var commasFormatter = d3.format(",.0f");
		var toolTip = d3.select("#toolTip");

		toolTip.style("opacity", 1);
		toolTip.style("left", (d3.event.pageX + 20) + "px");
		toolTip.style("top", d3.event.pageY + "px");
		d3.select("#toolTip #year").text("Year: " + evt.year);
		d3.select("#toolTip #gdp").text("GDP: $" + commasFormatter(evt.gdp) + " Billion");
	}

	//hide the tooltip
	function onMouseOut() {
		d3.select("#toolTip").style("opacity", 0);
	}
}