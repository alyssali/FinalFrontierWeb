d3.xml("systems.xml").then(function(dataset) {
  let systems = dataset.querySelector("systems").querySelectorAll("system")
  
  let data = [].filter.call(systems, function(d) {    
    if (d.querySelector("distance") === null) {      
      return false;
    }
    return true;
  }).map(function(d) {        
    let ra = d.querySelector("rightascension").textContent.split(' ')
    let dec = d.querySelector("declination").textContent.split(' ')
    let a = (ra[0] * 15) + (ra[1] * 0.25) + (ra[2] * 0.004166)
    let b = (Math.abs(dec[0]) + (dec[1] / 60) + (dec[2] / 3600)) * dec[0]
    let c = d.querySelector("distance").textContent
    return {
      system: d.querySelector("name").textContent,
      stars: [].map.call(d.querySelectorAll('star'), function(d){
        return {
          name: d.querySelector("name").textContent,
          mass: d.querySelector("mass") !== null ? d.querySelector("mass").textContent : 0,
          radius: d.querySelector("radius") !== null ? d.querySelector("radius").textContent : 0,
          temperature: d.querySelector("temperature") !== null ? d.querySelector("temperature").textContent : 0,
          metallicity: d.querySelector("metallicity") !== null ? d.querySelector("metallicity").textContent : 0,
          spectraltype: d.querySelector("spectraltype") !== null ? d.querySelector("spectraltype").textContent : 0,
          mag_v: d.querySelector("magV") !== null ? d.querySelector("magV").textContent : 0,
          mag_b: d.querySelector("magB") !== null ? d.querySelector("magB").textContent : 0,
          mag_j: d.querySelector("magJ") !== null ? d.querySelector("magJ").textContent : 0,
          mag_h: d.querySelector("magH") !== null ? d.querySelector("magH").textContent : 0,
          mag_k: d.querySelector("magK") !== null ? d.querySelector("magK").textContent : 0,

        }
      }),
      planets: [].map.call(d.querySelectorAll('planet'), function(d){
        return {
          name: d.querySelector("name").textContent,
          status: d.querySelector("list") !== null ? d.querySelector("list").textContent : 'none',
          discovered: d.querySelector("discoveryyear") !== null ? d.querySelector("discoveryyear").textContent : 0,
          method: d.querySelector("discoverymethod") !== null ? d.querySelector("discoverymethod").textContent : 'unlisted',
          description: d.querySelector("description") !== null ? d.querySelector("description").textContent : 'none',
          mass: d.querySelector("mass") !== null ? d.querySelector("mass").textContent : 0,
          period: d.querySelector("period") !== null ? d.querySelector("period").textContent : 0,
          sm_axis: d.querySelector("semimajoraxis") !== null ? d.querySelector("semimajoraxis").textContent : 0,
          eccentricity: d.querySelector("eccentricity") !== null ? d.querySelector("eccentricity").textContent : 0,
          periastron: d.querySelector("periastron") !== null ? d.querySelector("periastron").textContent : 0,
          peri_time: d.querySelector("periastrontime") !== null ? d.querySelector("periastrontime").textContent : 0.0
        }
      }),
      x: (c * Math.cos(b)) * Math.cos(a),
      y: (c * Math.cos(b)) * Math.sin(a),
      z: c * Math.sin(b),
      distance: c
    };
  });
   
  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
  const padding = 10
  const scatterDiv = d3.select("#michaels-D3")
  .append('div')
  .attr("id", "scatter-plot")
  .style('width', '100%')
  .style('height', '100%')
  let width = parseInt(window.getComputedStyle(d3.select("#scatter-plot").node()).width) - margin.left - margin.right
  let height = parseInt(window.getComputedStyle(d3.select("#scatter-plot").node()).height) - margin.top - margin.bottom
  let scale = 2.0
  
  var svg = scatterDiv.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

  const starGroup = svg.append('g')

  var stars = svg.append("defs")
    .append("radialGradient")
    .attr("id", "stars");

  stars.append("stop")
    .attr("offset", "10%")
    .attr("stop-color", "#0967A4")
    .attr("stop-opacity", 0.7);

  stars.append("stop")
    .attr("offset", "100%")
    .attr("stop-opacity", 0.1);
    
  var xScale = d3.scaleLinear()
    .domain([d3.min(data, function(d) {
      return d.x;
    }), d3.max(data, function(d) {
      return d.x;
    })])
    .range([0, width]);  
  
  var yScale = d3.scaleLinear()
    .domain([d3.min(data, function(d) {
      return d.y;
    }), d3.max(data, function(d) {
      return d.y;
    })])
    .range([height, 0]);

  var zScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d.z;
    })])
    .range([0, .1]);
  
  var sizeScale = d3.scaleLog()
    .domain([d3.min(data, function(d) {
      return d.distance;
    }), d3.max(data, function(d) {
      return d.distance;
    })])
    .range([5, 1]);
  
  let starScale = d3.scaleLinear()
  .domain([d3.min(data, function(d) {
    return typeof d.stars[0] !== 'undefined' ? d.stars[0].mass : 0;
  }), d3.max(data, function(d) {
    return typeof d.stars[0] !== 'undefined' ? d.stars[0].mass : 0;
  })])
  .range([10, 25]);

  let orbitScale = d3.scaleLinear()
  .domain([d3.min(data, function(d) {
    return typeof d.planets[0] !== 'undefined' & d.planets[0].periastron !== 0 ? d.planets[0].periastron : 5;
  }), d3.max(data, function(d) {
    return typeof d.planets[0] !== 'undefined' & d.planets[0].periastron !== 0 ? d.planets[0].periastron : 5;
  })])
  .range([30, 60]);

  let orbitingPlanetSizeScale = d3.scaleLinear()
  .domain([d3.min(data, function(d) {
    return typeof d.planets[0] !== 'undefined' ? d.planets[0].mass : 0.0031457007;
  }), d3.max(data, function(d) {
    return typeof d.planets[0] !== 'undefined' ? d.planets[0].mass : 0.0031457007;
  })])
  .range([5, 20]);

  let planetSizeScale = d3.scaleLinear()
  .domain([d3.min(data, function(d) {
    return typeof d.planets[0] !== 'undefined' ? d.planets[0].mass : 0.0031457007;
  }), d3.max(data, function(d) {
    return typeof d.planets[0] !== 'undefined' ? d.planets[0].mass : 0.0031457007;
  })])
  .range([5, 100]);

  const planetDetails = d3.select(".planetDesc")
  .style("opacity", 0);

  planetDetails.select('.desc').append('div').html('<h4>Size in Jupiter Masses</h4>')

const planetComparison = planetDetails.select('.desc')
  .append('svg')
  .attr('width', '300px')
  .attr('height', '200px')
const planetDescription = planetDetails.select('.desc')
  .append('div')

let earth = planetComparison.append('circle')
    .attr('cx', '100')
    .attr('cy', '100')
    .attr('id', 'earth')
    .attr('fill', 'blue')
    .attr('r', planetSizeScale(0.0031457007))

  planetComparison.append('text')
    .attr('x', '100')
    .attr('y', '130')
    .attr("text-anchor", "middle")
    .text('Earth')
  
  planetComparison.append('text')
    .attr('x', '100')
    .attr('y', '150')
    .attr("text-anchor", "middle")
    .text('0.00314')

  let exoplanet = planetComparison.append('circle')
      .attr('cx', '200')
      .attr('cy', '100')
      .attr('fill', 'green')
      .attr('id', 'exoplanet')

  var xAxis = d3.axisBottom().scale(xScale).ticks(5);
  var yAxis = d3.axisLeft().scale(yScale).ticks(5);

  const toolTip = d3.select(".tooltip")
    .style("opacity", 0);
  
  const filters = d3.select(".key-filters")
  filters.raise()

  let earthlikeSystems = []

  filters.select("#system-filter").on('click', function(){

    let systemFilter = d3.select('input[name="system-filter"]:checked').node().value
    if (systemFilter === '2'){
      starGroup.selectAll('circle')
      .style('visibility', function(d){
        
        if(earthlikeSystems.includes(d.system)) return 'visible'
        return 'hidden'
      })
    } else {
      starGroup.selectAll('circle')
      .style('visibility','visible')
    }
  })

  const systemDescription = d3.select(".sysDesc")
    .style("opacity", 0);

  const solarSystem = systemDescription.select('.desc')
    .append('div')
    .append('svg')
    .attr('width', '300px')
    .attr('height', '300px')

  const discoveryViz = systemDescription.select('.desc')
    .append('div')
    .attr('id', 'method-viz')

  systemDescription.select('.desc')
    .append('div')
    .attr('id', 'distance')
    .html('<h4>Distance From Earth</h4>');

  const distanceGraph = systemDescription.select('#distance')
    .append('svg')
    .attr('id', 'distanceGraph')
    .attr('width', '300px')
    .attr('height', '110px')
    .append("g")
    .attr("transform", "translate(2, 0)");

  
  const systemStar = solarSystem.append('circle')
    .attr('cx', 150)
    .attr('cy', 150)

  starGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "system")				
    .attr("cx", function(d) {
      return xScale(d.x)
    })
    .attr("cy", function(d) {
      return yScale(d.y) + (yScale(d.x) * zScale(d.z));
    })
    .attr("r", function(d) {
      return sizeScale(d.distance)
    })
    .style("fill", function(d){
      let earthlike = false
      let sunlike = false
      for(i in d.planets){
        if (d.planets[i].mass >= 0.00252 && d.planets[i].mass <= 0.005985){
          earthlike = true
          break
        }
      }

      if(earthlike) {
        console.log(d.system);
        earthlikeSystems.push(d.system);
        return '#ff9d1e'
      }
      return '#105bd8'
    })
    .attr("opacity", function(d){
      let earthlike = false
      let sunlike = false
      for(i in d.planets){
        if (d.planets[i].mass >= 0.00252 && d.planets[i].mass <= 0.005985){
          earthlike = true
          break
        }
      }
      if(earthlike) {
        console.log(d.system);
        return 0.7
      }
      return 0.5
    })
    .attr('id', function(d){
      return d.system.replace(/ /g, '_').replace(/\+/g, '_')
    })
    .on("mouseover", function(d) {
      toolTip.raise()		
      toolTip.transition()		
          .duration(200)		
          .style("opacity", .9);		
      toolTip	.html('<strong>System: </strong>' + d.system +
                    '<br/>' +
                    '<strong>Planets: </strong>' + d.planets.length +
                    '<br/>' +
                    '<strong>distance: </strong>' + parseFloat(d.distance).toLocaleString('en') + ' Lightyears')	
          .style("left", (parseFloat(d3.select('#' + d.system.replace(/ /g, '_').replace(/\+/g, '_')).attr('cx')) + 15) + "px")		
          .style("top", (parseFloat(d3.select('#' + d.system.replace(/ /g, '_').replace(/\+/g, '_')).attr('cy')) - 75) + "px");	
      })					
    .on("mouseout", function(d) {		
        toolTip.transition()		
            .duration(500)		
            .style("opacity", 0);	
    })
    .on('click',  function(d) {
      toolTip.style('opacity', 0)
      systemDescription.style('opacity', 0)
      planetDetails.style('opacity', 0)

      starGroup.select('.focused').remove()
      starGroup.selectAll('line').remove()
      
      selected_system = d3.select(`#${d3.event.srcElement.id}`)
      
      starGroup.append('circle').classed('focused', true)
        .attr('cx', (selected_system.attr('cx')))
        .attr('cy', (selected_system.attr('cy')))
        .attr('r', (selected_system.attr('r') * 2))
        .attr("fill-opacity", 0)
        .attr('stroke', 'black')
        .attr('stroke-wdith', 2)

        systemDescription.select('.name')
          .html("<h4>" + d.system + '</h4>' + 
          '<strong>distance: </strong>' + parseFloat(d.distance).toLocaleString('en') + ' Lightyears' +
          '<br/>' +
          '<strong>Planets: </strong>' + d.planets.length)

        discoveryViz.select('#method-img').remove()
        discoveryViz.select('h4').remove()


        discoveryViz.append('h4').html('Method - ' + d.planets[0].method)

        discoveryViz.append('img')
          .attr('id', 'method-img')
          .attr('width', '200px')
          .style('margin', '0 auto')
          .style('display', 'block')
          .attr('src', function(){
            if (d.planets[0].method === 'transit'){
              return 'RV.png'
            }
            if (d.planets[0].method === 'timing'){
              return 'timing.png'
            }
            if (d.planets[0].method === 'microlensing'){
              return 'microlensing.png'
            }
            if (d.planets[0].method === 'RV'){
              return 'transit.png'
            }
            if (d.planets[0].method === 'imaging'){
              return 'imaging.png'
            }
          })
        
        systemStar.attr('r', starScale(d.stars[0].mass))
          .attr('fill', '#ff9d1e')

        let planets = d.planets
        
        solarSystem.selectAll('.orbits').remove()
        solarSystem.selectAll('.orbits')
          .data(planets)
          .enter()
          .append("circle")
          .attr('class', 'orbits')
          .attr('cx', systemStar.attr('cx'))
          .attr('cy', systemStar.attr('cy'))
          .attr("fill-opacity", 0)
          .attr('stroke', 'black')
          .attr('stroke-wdith', 2)
          .attr('r', function(p, i){      
            return p.periastron !== 0 ? orbitScale(p.periastron) : 20 * (i + 1) + 10
          })
        
        solarSystem.selectAll('.planets').remove()
        solarSystem.selectAll('.earthlike').remove()
        solarSystem.selectAll('.planets')
          .data(planets)
          .enter()
          .append("circle")
          .attr('class', function(d){
            if (d.mass >= 0.00252 && d.mass <= 0.005985){
              return 'earthlike'
            }
            return 'planets'
          })
          .attr('fill', function(d){
            if (d.mass >= 0.00252 && d.mass <= 0.005985){
              return '#105bd8'
            }
            return '#aeb0b5'
          })
          .attr('cx', function(p, i){    
            return p.periastron !== 0 ? parseFloat(systemStar.attr('cx')) + orbitScale(p.periastron) : parseFloat(systemStar.attr('cx')) + (20 * (i + 1) + 10)
          })
          .attr('cy', systemStar.attr('cy'))
          .attr('r', function(p) {
            return orbitingPlanetSizeScale(p.mass)
          })
          .on("mouseover", function(d) {
            toolTip.raise()		
            toolTip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            toolTip	.html('<h4>' + d.name + '</h4>')	
                .style("left", (d3.event.pageX + 5) + "px")		
                .style("top", (d3.event.pageY - 30) + "px");	
            })					
          .on("mouseout", function(d) {		
              toolTip.transition()		
                  .duration(500)		
                  .style("opacity", 0);	
          })
          .on('click', function(p){
            planetDetails.style('opacity', 0)
            planetDetails.select('.name')
              .html("<h4>" + p.name + '</h4>' +
              '<strong>discovered: </strong>' + p.discovered +
              '<br/>' +
              '<strong>Status: </strong>' + p.status)

            
            planetDescription.html('<strong>Description: </strong>' + p.description )

            planetComparison.select('#exoplanet')
              .attr('r', planetSizeScale(p.mass))

            d3.selectAll('.exoplanet-mass').remove()

            planetComparison.append('text')
              .attr('class', 'exoplanet-mass')
              .attr('x', '200')
              .attr('y', 130 + planetSizeScale(p.mass))
              .attr("text-anchor", "middle")
              .text(p.name)
            
            planetComparison.append('text')
              .attr('class', 'exoplanet-mass')
              .attr('x', '200')
              .attr('y', 150 + planetSizeScale(p.mass))
              .attr("text-anchor", "middle")
              .text(p.mass)

              planetDetails
              .style("left", (width/3 + 400) + "px")		
              .style("top", (height/2) + "px")
              .transition()		
                .duration(200)		
                .style("opacity", .95);
              planetDetails.raise()
          })


      if (!solarSystem.select('.earthlike').empty()){
        console.log(solarSystem.select('.earthlike'));
        
        solarSystem.selectAll('.earthlike').call(pulsate)
        //pulsate(solarSystem.select('.earthlike'))
      }
          
      
      // DISTANCe GRAPH
      let distanceScale = d3.scaleLinear()
          .domain([0, d.distance])
          .range([0, 275]);

      distanceGraph.selectAll('rect').remove()

      distanceGraph.selectAll('rect')
          .data([
            {exoplanet: "Alpha Centauri", distance: 1.295},
            {exoplanet: d.system, distance: d.distance}])
          .enter()
          .append('rect')
          .attr('opacity', 0.5)
          .attr("y", function(d, i) { return i * 35 })
          .attr('height', 20)
          .transition()
          .duration(1500)
          .delay(200)
          .attr('width', function (s){            
            return distanceScale(s.distance)
          })

          distanceGraph.selectAll('text').remove()
        
          distanceGraph.selectAll('text')
          .data([
            {exoplanet: "Alpha Centauri", distance: 1.295},
            {exoplanet: d.system, distance: d.distance}])
          .enter()
          .append('text')
          .attr('class','below')
          .attr('x', 5)
          .attr("y", function(d, i) { return (35*i) + 15 })
          .attr('text-anchor','left')
          .text(function(d) {return d.exoplanet + ": " + d.distance + " lightyears";})
          .style('font-size', '15px') 

        const distanceAxis = d3.axisBottom()
          .ticks("5")
          .scale(distanceScale);
          
        distanceGraph.select('#distance-axis').remove()
        distanceGraph.append("g")
          .attr('id', 'distance-axis')
          .attr("transform", "translate(0, 70)")
          .call(distanceAxis);
        
      starGroup.transition()
        .duration(750)
        .attr("transform", "translate(" + (width/3 - selected_system.attr('cx')) + "," + (height/2 - selected_system.attr('cy')) + ")")
        .on('end', function(){

          systemDescription
          .style("left", (width/3 + 100) + "px")		
          .style("top", (height/2 - 100) + "px")
          .transition()		
            .duration(200)		
            .style("opacity", .95);
          systemDescription.raise()
          
          let x = parseFloat(selected_system.attr('cx'))
          let y = parseFloat(selected_system.attr('cy'))
          let r = parseFloat(selected_system.attr('r'))

          starGroup.append('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr('x1', x + r*2)
            .attr("y1", y)
            .attr("x2", x + r*2 + 10)
            .attr("y2", y)
          starGroup.append('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", x + r*2 + 10)
            .attr("y1", y)
            .attr("x2", x + 70)
            .attr("y2", y - 100);
          starGroup.append('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", x + 70)
            .attr("y1", y - 100)
            .attr("x2", x + 90)
            .attr("y2", y - 100); 
        })
  })

    const fieldZoom = d3.zoom()
        .scaleExtent([1, 100])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed)

    svg
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(fieldZoom);
        
    function depth(x,z,distToScreen){
      return x* (1/distToScreen)/(z+ (1/distToScreen))
    }

    function resize() {
  
      width = parseInt(window.getComputedStyle(d3.select("#scatter-plot").node()).width) - margin.left - margin.right
      height = parseInt(window.getComputedStyle(d3.select("#scatter-plot").node()).height) - margin.top - margin.bottom
    
      // Update the range of the scale with new width/height
      xScale.range([0, width]);
      yScale.range([height, 0]);
    
      // Update the axis and text with the new scale
      svg.select('.x.axis')
        .attr("transform", "translate(" + padding + "," + height + ")")
        .call(xAxis);
    
      svg.select('.x.axis').select('.label')
          .attr("x",width);
    
      svg.select('.y.axis')
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);
    
      // Update the tick marks
      xAxis.ticks(width / 75);
      yAxis.ticks(height / 75);
    
      // Update the circles
    
      svg.selectAll('circle')
        .attr("cx", function(d) { return xScale(d.x) })
        .attr("cy", function(d) { return yScale(d.y) })
    }

    let selected_system = null

    function zoomed() {
      toolTip.style('opacity', 0)
        .style('left', 0)
        .style('top', height)
      systemDescription.style('opacity', 0)
        .style('left', 0)
        .style('top', height)
      
      starGroup.select('.focused').remove()
      starGroup.selectAll('line').remove()
      planetDetails.style('opacity', 0)
        .style('left', 0)
        .style('top', height)


      var new_xScale = d3.event.transform.rescaleX(xScale);
      var new_yScale = d3.event.transform.rescaleY(yScale);
      scale = d3.event.transform.k

      starGroup.selectAll('circle')
        .attr('cx', function(d) {return depth(new_xScale(d.x), zScale(d.z),sizeScale(d.distance) - d3.event.transform.k)})
        .attr('cy', function(d) {return depth(new_yScale(d.y), zScale(d.z),sizeScale(d.distance) - d3.event.transform.k)})
        .attr("r", function(d) {
          return sizeScale(d.distance) * d3.event.transform.k <= 8 ? sizeScale(d.distance) * d3.event.transform.k : 8;
        })
    }

    starGroup.on('click', function(){
      toolTip.style('opacity', 0)
        .style('left', 0)
        .style('top', height)
      systemDescription.style('opacity', 0)
        .style('left', 0)
        .style('top', height)
      
      starGroup.selectAll('line').remove()
      planetDetails.style('opacity', 0)
        .style('left', 0)
        .style('top', height)
    })

    let trappist = d3.select('#TRAPPIST-1')

    pulsate(trappist)

    function pulsate(selection) {
      recursive_transitions();
  
      function recursive_transitions() {
          selection.transition()
              .duration(400)
              .attr("r", selection.attr('r'))
              .transition()
              .duration(800)
              .attr("r", parseFloat(selection.attr('r')) *2)
              .transition()
              .duration(400)
              .attr("r", parseFloat(selection.attr('r')))
              .on("end", recursive_transitions);
      }
    }
    
    d3.select(window).on('resize', resize);
    
});