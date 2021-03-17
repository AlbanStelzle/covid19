am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end


// Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

// Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormats.setKey("month", "MMMM yyyy");

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());


    createSeries("Cas", "Cas");
    createSeries("Morts", "Morts");
    createSeries("Guéris", "Guéris");


// Create series
    function createSeries(s, name) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value" + s;
        series.dataFields.dateX = "date";
        series.name = name;

        var segment = series.segments.template;
        segment.interactionsEnabled = true;
        segment.properties.strokeWidth = 3;

        var hoverState = segment.states.create("hover");
        hoverState.properties.strokeWidth = 4;

        var dimmed = segment.states.create("dimmed");
        dimmed.properties.stroke = am4core.color("#dadada");

        segment.events.on("over", function (event) {
            processOver(event.target.parent.parent.parent);
        });

        segment.events.on("out", function (event) {
            processOut(event.target.parent.parent.parent);
        });

        var data = [];
        var countrycode = location.href.match(/([^\/]*)\/*$/)[1]
        var di = selectcountries(getCountryNameFromCountryCode(countrycode))
        //   console.log(di)
        let diWeek = {};
        for (var i = 0, w = 0, z = 0; i < di.length; i += 7, w++) {
            let active = 0
            let confirmed = 0
            let recovered = 0
            let deaths = 0
            let dates = null;
            if ((di.length - i) < 7) {
                console.log((di.length - i));
                for (var y = 0; y < 7; y++, z++) {

                    active += di[z - (di.length - i)].active
                    confirmed += di[z - (di.length - i)].confirmed
                    recovered += di[z - (di.length - i)].recovered
                    deaths += di[z - (di.length - i)].deaths
                    dates = di[z - (di.length - i)].date
                }
            } else {
                for (var y = 0; y < 7; y++, z++) {

                    active += di[z].active
                    confirmed += di[z].confirmed
                    recovered += di[z].recovered
                    deaths += di[z].deaths
                    dates = di[z].date
                }

            }
            diWeek[w] = {
                active: (active / 7),
                confirmed: confirmed / 7,
                deaths: deaths / 7,
                recovered: recovered / 7,
                date: dates
            }
        }
        console.log(diWeek);
        var value = 0;
        for (var i = 0; i < Object.keys(diWeek).length; i++) {
            if (name == "Cas") {
                value = diWeek[i].confirmed;

            }
            if (name == "Morts") {
                value = diWeek[i].deaths;

            }
            if (name == "Guéris") {
                value = diWeek[i].recovered;

            }
            var dataItem = {date: new Date(diWeek[i].date)};
            dataItem["value" + s] = value;
            data.push(dataItem);
        }

        series.data = data;
        return series;
    }

    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    chart.legend.scrollable = true;
    chart.legend.itemContainers.template.events.on("over", function (event) {
        processOver(event.target.dataItem.dataContext);
    })

    chart.legend.itemContainers.template.events.on("out", function (event) {
        processOut(event.target.dataItem.dataContext);
    })

    function processOver(hoveredSeries) {
        hoveredSeries.toFront();

        hoveredSeries.segments.each(function (segment) {
            segment.setState("hover");
        })

        chart.series.each(function (series) {
            if (series != hoveredSeries) {
                series.segments.each(function (segment) {
                    segment.setState("dimmed");
                })
                series.bulletsContainer.setState("dimmed");
            }
        });
    }

    function processOut(hoveredSeries) {
        chart.series.each(function (series) {
            series.segments.each(function (segment) {
                segment.setState("default");
            })
            series.bulletsContainer.setState("default");
        });
    }

}); // end am4c ore.ready()
am4core.ready(function () {

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end


// Create chart instance
    var chart = am4core.create("chartdiv2", am4charts.XYChart);

// Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormats.setKey("month", "MMMM yyyy");

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());


    createSeries("Cas", "Cas");
    createSeries("Morts", "Morts");
    createSeries("Guéris", "Guéris");


// Create series
    function createSeries(s, name) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value" + s;
        series.dataFields.dateX = "date";
        series.name = name;

        var segment = series.segments.template;
        segment.interactionsEnabled = true;
        segment.properties.strokeWidth = 3;

        var hoverState = segment.states.create("hover");
        hoverState.properties.strokeWidth = 4;

        var dimmed = segment.states.create("dimmed");
        dimmed.properties.stroke = am4core.color("#dadada");

        segment.events.on("over", function (event) {
            processOver(event.target.parent.parent.parent);
        });

        segment.events.on("out", function (event) {
            processOut(event.target.parent.parent.parent);
        });

        var data = [];
        var countrycode = location.href.match(/([^\/]*)\/*$/)[1]
        var di = selectcountries(getCountryNameFromCountryCode(countrycode))
        //   console.log(di)
        let diWeek = {};
        let diWeekTotal = {};
        for (var i = 0, w = 0, z = 0; i < di.length; i += 7, w++) {
            let active = 0
            let confirmed = 0
            let recovered = 0
            let deaths = 0
            let dates = null;
            if ((di.length - i) < 7) {
                console.log((di.length - i));
                for (var y = 0; y < 7; y++, z++) {

                    active += di[z - (di.length - i)].active
                    confirmed += di[z - (di.length - i)].confirmed
                    recovered += di[z - (di.length - i)].recovered
                    deaths += di[z - (di.length - i)].deaths
                    dates = di[z - (di.length - i)].date
                }
            } else {
                for (var y = 0; y < 7; y++, z++) {

                    active += di[z].active
                    confirmed += di[z].confirmed
                    recovered += di[z].recovered
                    deaths += di[z].deaths
                    dates = di[z].date
                }

            }
            diWeekTotal[w] = {
                active: (active / 7),
                confirmed: confirmed / 7,
                deaths: deaths / 7,
                recovered: recovered / 7,
                date: dates
            }
            if (w == 0) {
                diWeek[w] = diWeekTotal[w]

            } else {
                diWeek[w] = {
                    active: diWeekTotal[w].active - (diWeekTotal[w - 1].active),
                    confirmed: diWeekTotal[w].confirmed - (diWeekTotal[w - 1].confirmed),
                    deaths: diWeekTotal[w].deaths - (diWeekTotal[w - 1].deaths),
                    recovered: diWeekTotal[w].recovered - (diWeekTotal[w - 1].recovered),
                    date: dates
                }
            }
        }
        console.log(diWeek);
        var value = 0;
        for (var i = 0; i < Object.keys(diWeek).length; i++) {
            if (name == "Cas") {
                value = diWeek[i].confirmed;

            }
            if (name == "Morts") {
                value = diWeek[i].deaths;

            }
            if (name == "Guéris") {
                value = diWeek[i].recovered;

            }
            var dataItem = {date: new Date(diWeek[i].date)};
            dataItem["value" + s] = value;
            data.push(dataItem);
        }

        series.data = data;
        return series;
    }

    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    chart.legend.scrollable = true;
    chart.legend.itemContainers.template.events.on("over", function (event) {
        processOver(event.target.dataItem.dataContext);
    })

    chart.legend.itemContainers.template.events.on("out", function (event) {
        processOut(event.target.dataItem.dataContext);
    })

    function processOver(hoveredSeries) {
        hoveredSeries.toFront();

        hoveredSeries.segments.each(function (segment) {
            segment.setState("hover");
        })

        chart.series.each(function (series) {
            if (series != hoveredSeries) {
                series.segments.each(function (segment) {
                    segment.setState("dimmed");
                })
                series.bulletsContainer.setState("dimmed");
            }
        });
    }

    function processOut(hoveredSeries) {
        chart.series.each(function (series) {
            series.segments.each(function (segment) {
                segment.setState("default");
            })
            series.bulletsContainer.setState("default");
        });
    }

}); // end am4c ore.ready()