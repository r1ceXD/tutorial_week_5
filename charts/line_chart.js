window.drawLineChart = function (rows) {
  const chart = d3.select("#chart-4");
  const data = rows
    .map((row) => ({
      rawYear: row.Year,
      rawAveragePrice: row["Average Price (notTas-Snowy)"],
      year: Number(row.Year),
      averagePrice: Number(row["Average Price (notTas-Snowy)"])
    }))
    .filter((row) => row.rawYear.trim() !== ""
      && row.rawAveragePrice.trim() !== ""
      && Number.isFinite(row.year)
      && Number.isFinite(row.averagePrice))
    .sort((a, b) => a.year - b.year);

  if (data.length === 0) {
    chart.text("No valid average spot price data to plot.");
    return;
  }

  const width = chart.node().clientWidth;
  const height = 340;
  const margin = { top: 16, right: 20, bottom: 52, left: 68 };
  const yearExtent = d3.extent(data, (row) => row.year);

  if (yearExtent[0] === yearExtent[1]) {
    yearExtent[0] -= 1;
    yearExtent[1] += 1;
  }

  const x = d3.scaleLinear()
    .domain(yearExtent)
    .nice()
    .range([margin.left, width - margin.right]);
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, (row) => row.averagePrice)])
    .nice()
    .range([height - margin.bottom, margin.top]);
  const line = d3.line()
    .x((row) => x(row.year))
    .y((row) => y(row.averagePrice));

  chart.selectAll("*").remove();

  const svg = chart.append("svg")
    .style("display", "block")
    .style("width", "100%")
    .style("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Line chart of average ARE spot price by year");

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(Math.min(data.length, 8)).tickFormat(d3.format("d")));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#7c3aed")
    .attr("stroke-width", 2.5)
    .attr("d", line);

  svg.append("text")
    .attr("x", (margin.left + width - margin.right) / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("Year");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + height - margin.bottom) / 2)
    .attr("y", 17)
    .attr("text-anchor", "middle")
    .text("Average price ($ per megawatt hour)");
};