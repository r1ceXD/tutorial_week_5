window.drawDonutChart = function (rows) {
  const chart = d3.select("#chart-2");
  const data = rows
    .map((row) => ({
      screenType: row.Screen_Tech,
      consumption: Number(row["Mean(Labelled energy consumption (kWh/year))"])
    }))
    .filter((row) => row.screenType && Number.isFinite(row.consumption) && row.consumption > 0);

  if (data.length === 0) {
    chart.text("No valid screen type energy data to plot.");
    return;
  }

  const width = chart.node().clientWidth;
  const isNarrow = width < 460;
  const height = isNarrow ? 360 : 340;
  const outerRadius = isNarrow
    ? Math.min(width * 0.3, 100)
    : Math.min(width * 0.28, height * 0.38);
  const centerX = isNarrow ? width / 2 : width * 0.34;
  const centerY = isNarrow ? outerRadius + 16 : height / 2;
  const innerRadius = outerRadius * 0.58;
  const colors = d3.scaleOrdinal(d3.schemeTableau10)
    .domain(data.map((row) => row.screenType));
  const pie = d3.pie()
    .sort(null)
    .value((row) => row.consumption);
  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  chart.selectAll("*").remove();

  const svg = chart.append("svg")
    .style("display", "block")
    .style("width", "100%")
    .style("height", "auto")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Donut chart of mean TV energy consumption by screen type");

  const plot = svg.append("g")
    .attr("transform", `translate(${centerX},${centerY})`);

  plot.selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("d", arc)
    .attr("fill", (slice) => colors(slice.data.screenType))
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);

  plot.append("text")
    .attr("text-anchor", "middle")
    .attr("fill", "#1f2937")
    .attr("font-size", "12px")
    .selectAll("tspan")
    .data(["Mean energy", "consumption"])
    .join("tspan")
    .attr("x", 0)
    .attr("dy", (label, index) => index === 0 ? "-0.2em" : "1.2em")
    .text((label) => label);

  const legend = svg.append("g")
    .attr("transform", isNarrow
      ? `translate(16,${centerY + outerRadius + 24})`
      : `translate(${width * 0.66},${centerY - ((data.length - 1) * 30) / 2})`);

  const legendItems = legend.selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (row, index) => `translate(0,${index * (isNarrow ? 24 : 30)})`);

  legendItems.append("circle")
    .attr("r", 6)
    .attr("fill", (row) => colors(row.screenType));

  legendItems.append("text")
    .attr("x", 12)
    .attr("y", 4)
    .attr("font-size", "12px")
    .text((row) => `${row.screenType}: ${d3.format(",.1f")(row.consumption)} kWh/year`);
};