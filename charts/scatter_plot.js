window.drawScatterPlot = function (rows) {
  const chart = d3.select("#chart-1");
  const data = rows
    .map((row) => ({
      rawStar2: row.star2,
      rawEnergyConsumption: row.energy_consumpt,
      star2: Number(row.star2),
      energyConsumption: Number(row.energy_consumpt)
    }))
    .filter((row) => row.rawStar2.trim() !== ""
      && row.rawEnergyConsumption.trim() !== ""
      && Number.isFinite(row.star2)
      && Number.isFinite(row.energyConsumption));

  if (data.length === 0) {
    chart.text("No valid star rating and energy consumption data to plot.");
    return;
  }

  const width = chart.node().clientWidth;
  const height = 340;
  const margin = { top: 12, right: 16, bottom: 44, left: 58 };
  const x = d3.scaleLinear()
    .domain(d3.extent(data, (row) => row.star2))
    .nice()
    .range([margin.left, width - margin.right]);
  const y = d3.scaleLinear()
    .domain(d3.extent(data, (row) => row.energyConsumption))
    .nice() 
    .range([height - margin.bottom, margin.top]);

  chart.selectAll("*").remove();

  const svg = chart.append("svg")
    .style("display", "block")
    .style("width", "100%")
    .style("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Scatter plot of TV energy consumption by star rating");

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", (width + margin.left - margin.right) / 2)
    .attr("y", height - 6)
    .attr("text-anchor", "middle")
    .text("Star rating");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height - margin.top - margin.bottom) / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Energy consumption");

  svg.append("g")
    .attr("fill", "#2563eb")
    .attr("fill-opacity", 0.65)
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (row) => x(row.star2))
    .attr("cy", (row) => y(row.energyConsumption))
    .attr("r", 3);
};