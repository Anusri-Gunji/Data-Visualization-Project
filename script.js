colors = [
  "#943126",
  "#4A235A",
  "#004c6d",
  "#488f31",
  "#ffbf00",
  "#808000",
  "#F3CFC6",
  "#FBCEB1",
  "#D3D3D3",
  "#B03A2E",
  "#FFB6C1",
  "#FFBF00",
  "#B2BEB5",
  "#939035",
  "#ffc544",
  "#659d4f",
  "#005e81",
  "#5B2C67",
  "#C9A9A6",
  "#FFAC1C",
  "#A9A9A9",
  "#a5a059",
  "#fdcb68",
  "#7fac6c",
  "#007295",
  "#6C3483",
  "#CB4335",
  "#FF69B4",
  "#E3963E",
  "#808080",
  "#b6b17b",
  "#fad188",
  "#99ba8a",
  "#0085a9",
  "#7D3C98",
  "#E74C3C",
  "#AA336A",
  "#CC5500",
  "#E97451",
  "#36454F",
  "#c7c29e",
  "#f6d8a8",
  "#b3c9a8",
  "#009abc",
  "#8E44AD",
  "#EC7063",
  "#ccd7c6",
  "#00afce",
  "#A569BD",
  "#F1948A",
  "#00c4e0",
  "#BB8FCE",
  "#F5B7B1",
  "#00daf0",
  "#D2B4DE",
  "#FADBD8",
  "#00f0ff",
  "#00FFFF",
  "#FF00FF",
  "#C0C0C0",
  "#A04000",
  "#808000",
  "#CD6155",
  "#8E44AD",
  "#F4D03F",
  "#BA4A00",
  "#85929E",
];
columns = [
  "brand",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
];
isRegion = false;
isOwnership = false;
isBrand = false;
selectedRegion = "";

d3.csv("data/countries.csv").then((continents) => {
  updateBubbles(getContinents(continents));
});

drawStarterLineChart();
drawStarterParallelCoordinates();

function getContinents(data) {
  return d3
    .nest()
    .key(function (element) {
      return element.Continent;
    })
    .entries(data);
}

function groupByRegion(data) {
  return d3
    .nest()
    .key(function (element) {
      return element.region;
    })
    .key(function (element) {
      return element.ownership;
    })
    .entries(data);
}

function groupByOwnership(data) {
  return d3
    .nest()
    .key(function (element) {
      return element.ownership;
    })
    .key(function (element) {
      return element.region;
    })
    .entries(data);
}

function getDataByKey(key, data) {
  list = [];
  data.forEach((element) => {
    if (element.region === key) {
      isRegion = true;
      isOwnership = false;
      isBrand = false;
      list.push(element);
    } else if (element.ownership === key && element.region === selectedRegion) {
      isRegion = false;
      isOwnership = true;
      isBrand = false;
      list.push(element);
    } else if (element.brand === key && element.region === selectedRegion) {
      isRegion = false;
      isOwnership = false;
      isBrand = true;
      list.push(element);
    }
  });
  copyList = [...list];
  groupedData = d3
    .nest()
    .key(function (element) {
      return isRegion
        ? element.ownership
        : isOwnership
        ? element.brand
        : element.region;
    })
    .entries(list);
  if (isRegion) {
    onBubbleClick(groupedData);
    onBubbleClickParallelCoordinates(copyList);
  }
  return groupedData;
}

function getCountriesByContinent(continent, data) {
  list = [];
  data.forEach((element) => {
    if (element.Continent === continent) list.push({ key: element.Country });
  });
  d3.csv("data/sales_data.csv").then((data) => {
    countries = [];
    list.forEach((country) => {
      data.forEach((element) => {
        if (element.region === country.key) {
          countries.push(element);
        }
      });
    });
    groupedData = d3
      .nest()
      .key(function (element) {
        return element.region;
      })
      .entries(countries);
    onBubbleClick(groupedData);
    onBubbleClickParallelCoordinates(countries);
  });
  return list;
}

function selectBubble(param) {
  param === "America's" || param === "Asia" || param === "Europe"
    ? d3.csv("data/countries.csv").then((data) => {
        d3.select("#bubble").remove();
        updateBubbles(getCountriesByContinent(param, data));
      })
    : d3.csv("data/sales_data.csv").then((data) => {
        d3.select("#bubble").remove();
        updateBubbles(getDataByKey(param, data), isOwnership);
      });
}

function onClear() {
  d3.csv("data/countries.csv").then((continents) => {
    isRegion = false;
    isOwnership = false;
    isBrand = false;
    d3.select("#bubble").remove();
    updateBubbles(getContinents(continents));
    d3.select("#lineChart").remove();
    drawStarterLineChart();
    d3.select("#parallel").remove();
    drawStarterParallelCoordinates();
  });
}

function onBubbleClick(data) {
  array = [];
  maxValue = 0;
  data.forEach((element) => {
    year2014 = 0;
    year2015 = 0;
    year2016 = 0;
    year2017 = 0;
    year2018 = 0;
    year2019 = 0;
    year2020 = 0;
    year2021 = 0;
    element.values.forEach((data) => {
      year2014 += parseInt(data[2014]);
      year2015 += parseInt(data[2015]);
      year2016 += parseInt(data[2016]);
      year2017 += parseInt(data[2017]);
      year2018 += parseInt(data[2018]);
      year2019 += parseInt(data[2019]);
      year2020 += parseInt(data[2020]);
      year2021 += parseInt(data[2021]);
    });
    maxValue = Math.max(
      maxValue,
      year2014,
      year2015,
      year2016,
      year2017,
      year2018,
      year2019,
      year2020,
      year2021
    );
    list = [
      { date: "2014", sales: year2014 },
      { date: "2015", sales: year2015 },
      { date: "2016", sales: year2016 },
      { date: "2017", sales: year2017 },
      { date: "2018", sales: year2018 },
      { date: "2019", sales: year2019 },
      { date: "2020", sales: year2020 },
      { date: "2021", sales: year2021 },
    ];
    array.push({ key: element.key, data: list });
  });
  d3.select("#lineChart").remove();
  drawLineChart(array, maxValue);
}

function onBubbleClickParallelCoordinates(data) {
  data.forEach((element) => {
    delete element.region;
    delete element.ownership;
  });
  colsToSum = columns.slice(1);
  sums = d3.rollup(
    data,
    (v) =>
      Object.fromEntries(
        colsToSum.map((col) => [col, d3.sum(v, (d) => +d[col])])
      ),
    (d) => d.brand
  );
  brands = Array.from(sums.keys());
  filteredData = Array.from(sums, ([brand, counts]) => {
    const result = { ...counts };
    result.brand = brand;
    return result;
  });
  d3.select("#parallel").remove();
  drawParallelCoordinates(filteredData, brands, columns);
}

function drawStarterLineChart() {
  array = [];
  maxValue = 0;
  d3.csv("data/sales_data.csv").then((sales) => {
    year2014 = 0;
    year2015 = 0;
    year2016 = 0;
    year2017 = 0;
    year2018 = 0;
    year2019 = 0;
    year2020 = 0;
    year2021 = 0;
    sales.forEach((element) => {
      if (element.region === "USA" || element.region === "Canada") {
        year2014 += parseInt(element[2014]);
        year2015 += parseInt(element[2015]);
        year2016 += parseInt(element[2016]);
        year2017 += parseInt(element[2017]);
        year2018 += parseInt(element[2018]);
        year2019 += parseInt(element[2019]);
        year2020 += parseInt(element[2020]);
        year2021 += parseInt(element[2021]);
      }
    });
    maxValue = Math.max(
      maxValue,
      year2014,
      year2015,
      year2016,
      year2017,
      year2018,
      year2019,
      year2020,
      year2021
    );
    list = [
      { date: "2014", sales: year2014 },
      { date: "2015", sales: year2015 },
      { date: "2016", sales: year2016 },
      { date: "2017", sales: year2017 },
      { date: "2018", sales: year2018 },
      { date: "2019", sales: year2019 },
      { date: "2020", sales: year2020 },
      { date: "2021", sales: year2021 },
    ];
    array.push({ key: "America's", data: list });
    year2014 = 0;
    year2015 = 0;
    year2016 = 0;
    year2017 = 0;
    year2018 = 0;
    year2019 = 0;
    year2020 = 0;
    year2021 = 0;
    sales.forEach((element) => {
      if (
        element.region === "Japan" ||
        element.region === "China" ||
        element.region === "India"
      ) {
        year2014 += parseInt(element[2014]);
        year2015 += parseInt(element[2015]);
        year2016 += parseInt(element[2016]);
        year2017 += parseInt(element[2017]);
        year2018 += parseInt(element[2018]);
        year2019 += parseInt(element[2019]);
        year2020 += parseInt(element[2020]);
        year2021 += parseInt(element[2021]);
      }
    });
    maxValue = Math.max(
      maxValue,
      year2014,
      year2015,
      year2016,
      year2017,
      year2018,
      year2019,
      year2020,
      year2021
    );
    list = [
      { date: "2014", sales: year2014 },
      { date: "2015", sales: year2015 },
      { date: "2016", sales: year2016 },
      { date: "2017", sales: year2017 },
      { date: "2018", sales: year2018 },
      { date: "2019", sales: year2019 },
      { date: "2020", sales: year2020 },
      { date: "2021", sales: year2021 },
    ];
    array.push({ key: "Asia", data: list });
    year2014 = 0;
    year2015 = 0;
    year2016 = 0;
    year2017 = 0;
    year2018 = 0;
    year2019 = 0;
    year2020 = 0;
    year2021 = 0;
    sales.forEach((element) => {
      if (element.region === "UK" || element.region === "Germany") {
        year2014 += parseInt(element[2014]);
        year2015 += parseInt(element[2015]);
        year2016 += parseInt(element[2016]);
        year2017 += parseInt(element[2017]);
        year2018 += parseInt(element[2018]);
        year2019 += parseInt(element[2019]);
        year2020 += parseInt(element[2020]);
        year2021 += parseInt(element[2021]);
      }
    });
    maxValue = Math.max(
      maxValue,
      year2014,
      year2015,
      year2016,
      year2017,
      year2018,
      year2019,
      year2020,
      year2021
    );
    list = [
      { date: "2014", sales: year2014 },
      { date: "2015", sales: year2015 },
      { date: "2016", sales: year2016 },
      { date: "2017", sales: year2017 },
      { date: "2018", sales: year2018 },
      { date: "2019", sales: year2019 },
      { date: "2020", sales: year2020 },
      { date: "2021", sales: year2021 },
    ];
    array.push({ key: "Europe", data: list });
    drawLineChart(array, maxValue);
  });
}

function drawStarterParallelCoordinates() {
  d3.csv("data/sales_data.csv").then((data) => {
    data.forEach((element) => {
      delete element.region;
      delete element.ownership;
    });
    data.columns = data.columns.slice(2);
    colsToSum = data.columns.slice(1);
    sums = d3.rollup(
      data,
      (v) =>
        Object.fromEntries(
          colsToSum.map((col) => [col, d3.sum(v, (d) => +d[col])])
        ),
      (d) => d.brand
    );
    brands = Array.from(sums.keys());
    filteredData = Array.from(sums, ([brand, counts]) => {
      const result = { ...counts };
      result.brand = brand;
      return result;
    });
    drawParallelCoordinates(filteredData, brands, data.columns);
  });
}
