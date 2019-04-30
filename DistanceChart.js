let exoplanet_distance_data = [
        {exoplanet: "TRAPPIST-1e", distance: 229900},
        {exoplanet: "Gliese 581 g", distance: 117990},
        {exoplanet: "Luyten b", distance: 72200},
         // {exoplanet: "Kepler-62e", distance: 368},
         // {exoplanet: "LHS 1723 b", distance: 98},
        {exoplanet: "the Edge of the Solar System", distance: 10},
        
 ];


// let toggleClass = (i,toggle) => {
//    d3.select("#viz div:nth-child("+ i +")").classed("highlightBar",toggle);
//    d3.select("#legend li:nth-child("+ i +")").classed("highlightText",toggle);
// };

// let divSelection = d3.select("body").selectAll("div").selectAll("div")
// let listSelection = d3.select("body").selectAll("ol").selectAll("li")

// divSelection
// 	.data(exoplanet_distance_data)
// 	.enter()
// 	.append("div")
	
// 	.attr("class", "bar")
	
// 	.style("width", 0)
// 	.transition().delay(500).duration(8000)
// 		// .attr("bar", function(d, i){ return "element-"+i; })
// 	// .attr("bar", "elements")
// 	// .text("DIV TEST!")
// 	.style("width", function(d){ return d.distance / 100 +"px"; })

// 	.on("mouseover", function(d, i){return toggleClass(i, d3.select(this)) });
// 	.on("click", function(d, i){
// 	d3.select(this).text(d)
// 	})
// 	.on("mouseover", function(d, i){
//   		toggleClass(i+1, true)
//   	// d3.select(this).classed("highlightBar", true)
// 	})
// 	.on("mouseout",function(d, i){
//   		toggleClass(i+1, false)
//   	// d3.select(this).classed("highlightBar", false)
// 	});

// listSelection
// 	.data(exoplanet_distance_data)
// 	.enter()
// 	.append("li")
// 	.text(function(d){ return d.exoplanet +": "+ d.distance;})
// 	.on("mouseover", function(d, i){
//   		toggleClass(i+1, true)
//   	// d3.select(this).classed("highlightText", true)
// 	})
// 	.on("mouseout",function(d, i){
//   		toggleClass(i+1, false)
//   	// d3.select(this).classed("highlightText", false)
// 	});




var width = 1300
var height = 500
var emptyVar = 0
// var dataArray = [0.35,1.66,3.04,1.54,3.45,2.56,2.29,1.37];
var emptyData = [];
var widthScale = d3.scaleLinear()
                .domain([0, 230000])
                .range([0, width]);     

// var heightScale = d3.scaleLinear()
// 	            .domain([0, 300])
// 	            .range([height, 0]);

// var color = d3.scaleLinear()
//             .domain([0,5])
//             .range(["#000066", "#22abff"])

var xaxis = d3.axisBottom()
            .ticks("10")
            .scale(widthScale);

// var y = d3.axisLeft()
//             .ticks("10");
//             .scale(heightScale);

var canvas = d3.select("#evaviz")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(30, 0)");

var bars = canvas.selectAll("rect")
            .data(exoplanet_distance_data)
            .enter()           
                .append("rect")
                .attr("width", 0)
                .attr("height", 50)
                // .attr("fill", function(d) { return color(d) })
                .attr("fill", '#186493')
                .attr("y", function(d, i) { return i * 55 })


    canvas.append("g")
        .attr("transform", "translate(0, 430)")
        .attr("font-family", "Helvetica")
        .attr("font-size", "15px")
        .call(xaxis);
        // .call(y);
 
    bars.transition()
            .duration(1500)
            .delay(200)
            .attr("width", function(d) { return widthScale(d.distance); })
 
 

    canvas.selectAll('div')
    	.data(exoplanet_distance_data)
    	.enter()
    	.append('text')
    	.attr('class','below')
    	.attr('x', 5)
    	.attr("y", function(d, i) { return (55*i + 30); })
    	.attr('text-anchor','left')
    	.text(function(d) {return d.exoplanet + ": " + d.distance + " billion miles";})
    	.style('fill', "black")
    	// .style("stroke-width",'0.5')
    	// .style('stroke',"#7b7867") gray
    	.style('stroke',"black") 
 
 