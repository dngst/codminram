async function drawChart() {
  // access data
  const dataset = await d3.csv("cod_releases.csv")

  const xAccessor = d => d.Year
  const yAccessor = d => d.Memory

  // create chart dimensions
  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9
  ])
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 15,
      bottom: 50,
      left: 55
    }
  }

  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // draw canvas
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  let bounds = wrapper.append("g")
    .style("transform", `translate(${
      dimensions.margin.left
    }px, ${
      dimensions.margin.top
    }px)`)

  // create scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])

  // draw data
  const dots = bounds.selectAll("circle")
    .data(dataset)
    .enter().append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("class", "dot")
    .on("mouseenter", function(e, datum) {
        onMouseEnter(datum)
      })
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)
    .transition().duration(800).delay((d, i) => i * 20).ease(d3.easeElastic)
      .attr("r", 6)

  // draw peripherals
  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"))

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .attr("id", "x-axis")
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
      .attr("id", "y-axis")

  const yAxisLabel = yAxis.append("text")
    .attr("x", -dimensions.boundedWidth / 2)
    .attr("y", -dimensions.margin.left + 12)
    .text("Memory (1000 MB = 1 GB)")
    .attr("class", "y-axis-label")

  // setup interactions
  const tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")

  function onMouseEnter(d) {
    tooltip.select("#cod_title")
      .text(`${d.Title}  (${d.Year})`)
    if(d.Memory) {
      tooltip.select("#memory")
        .text(`Minimum ${formatMemory(d.Memory)}`)
    } else {
      tooltip.select("#memory")
        .text("No PC release")
    }
    tooltip.style("opacity", 0.9)
  }

  function onMouseMove() {
    tooltip.style("left", `${event.pageX}px`)
    tooltip.style("top", `${event.pageY - 40}px`)
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }

  // utils
  function formatMemory(d) {
    if(d >= 1000) {
      return `${d.toString().split("")[0]} GB`
    } else {
      return `${d} MB`
    }
  }
}

drawChart()
