window.drawBarChart = function (rows) {
  const chart = d3.select("#chart-3");
  const data = rows
    .map((row) => ({
      screenType: row.Screen_Tech,
      consumption: Number(row["Mean(Labelled energy consumption (kWh/year))"])
    }))
    .filter((row) => row.screenType && Number.isFinite(row.consumption));

  if (data.length === 0) {
    chart.text("No valid 55-inch TV energy data to plot.");
    return;
  }

  const width = chart.node().clientWidth;
  const height = 340;
  const margin = { top: 16, right: 20, bottom: 58, left: 64 };
  const x = d3.scaleBand()
    .domain(data.map((row) => row.screenType))
    .range([margin.left, width - margin.right])
    .padding(0.25);
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, (row) => row.consumption)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  chart.selectAll("*").remove();

  const svg = chart.append("svg")
    .style("display", "block")
    .style("width", "100%")
    .style("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Bar chart of mean energy consumption for 55-inch TVs by screen type");

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", (margin.left + width - margin.right) / 2)
    .attr("y", height - 12)
    .attr("text-anchor", "middle")
    .text("Screen technology");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + height - margin.bottom) / 2)
    .attr("y", 16)
    .attr("text-anchor", "middle")
    .text("Mean energy consumption (kWh/year)");

  svg.append("g")
    .attr("fill", "#0f766e")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (row) => x(row.screenType))
    .attr("y", (row) => y(row.consumption))
    .attr("width", x.bandwidth())
    .attr("height", (row) => y(0) - y(row.consumption))
    .attr("rx", 3);
};