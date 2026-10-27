window.chartData = {};

const datasets = [
  {
    key: "tvEnergyAllSizes",
    label: "TV energy by screen type (all sizes)",
    path: "data/Ex5_TV_energy_Allsizes_byScreenType.csv",
    selector: "#chart-2"
  },
  {
    key: "tvEnergy55Inch",
    label: "TV energy by screen type (55-inch TVs)",
    path: "data/Ex5_TV_energy_55inchtv_byScreenType.csv",
    selector: "#chart-3"
  },
  {
    key: "tvEnergy",
    label: "TV energy",
    path: "data/Ex5_TV_energy.csv",
    selector: "#chart-3"
  },
  {
    key: "spotPrices",
    label: "ARE spot prices",
    path: "data/Ex5_ARE_Spot_Prices.csv",
    selector: "#chart-4"
  }
];

Promise.allSettled(datasets.map(async (dataset) => {
  try {
    const rows = await d3.csv(dataset.path);
    window.chartData[dataset.key] = rows;
  } catch (error) {
    d3.select(dataset.selector).text(`Failed to load ${dataset.label}.`);
    console.error(`Failed to load dataset: ${dataset.path}`, error);
    throw error;
  }
})).then((results) => {
  const failedCount = results.filter((result) => result.status === "rejected").length;
  if (failedCount > 0) {
    console.error(`${failedCount} dataset(s) failed to load.`);
  }

  if (window.chartData.tvEnergy) {
    window.drawScatterPlot(window.chartData.tvEnergy);
  } else {
    d3.select("#chart-1").text("Unable to plot: TV energy data failed to load.");
  }

  if (window.chartData.tvEnergyAllSizes) {
    window.drawDonutChart(window.chartData.tvEnergyAllSizes);
  } else {
    d3.select("#chart-2").text("Unable to plot: all-sizes TV energy data failed to load.");
  }

  if (window.chartData.tvEnergy55Inch) {
    window.drawBarChart(window.chartData.tvEnergy55Inch);
  } else {
    d3.select("#chart-3").text("Unable to plot: 55-inch TV energy data failed to load.");
  }

  if (window.chartData.spotPrices) {
    window.drawLineChart(window.chartData.spotPrices);
  } else {
    d3.select("#chart-4").text("Unable to plot: ARE spot price data failed to load.");
  }
});