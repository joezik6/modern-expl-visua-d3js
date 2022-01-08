const ancho = 800;
const alto = 600;
const margen = {
  superior: 10,
  inferior: 40,
  izquierdo: 60,
  derecho: 10,
};
// ------------------------ // -----------------------
const diCaprioBirthYear = 1974;
const today = new Date().getFullYear();
const age = function (year) {
  return year - diCaprioBirthYear;
};
//console.log(age(2010));
// ----------------------------------------------------------
// array years since 1998
function generateArrayOfYears() {
  var max = 2019;
  var min = max - 21;
  var years = [];

  for (var i = max; i >= min; i--) {
    years.push(i);
  }
  return years;
}
var years = generateArrayOfYears();
// console.log(years);

const ages = years.map((year) => year - 1974);
//console.log(ages);
//console.log(ages[0]);

// --------------------------------------- //// --------------------------

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", ancho)
  .attr("height", alto)
  .attr("id", "svg");
const grupoElementos = svg
  .append("g")
  .attr("id", "grupoElementos")
  .attr("transform", `translate(${margen.izquierdo}, ${margen.superior})`);

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

// escalas y ejes:
var x = d3.scaleBand().range([0, ancho - margen.izquierdo - margen.derecho]);
var y = d3.scaleLinear().range([alto - margen.inferior - margen.superior, 0]);

const grupoEjes = svg.append("g").attr("id", "grupoEjes");
const grupoX = grupoEjes
  .append("g")
  .attr("id", "grupoX")
  .attr(
    "transform",
    `translate(${margen.izquierdo}, ${alto - margen.inferior})`
  );
const grupoY = grupoEjes
  .append("g")
  .attr("id", "grupoY")
  .attr("transform", `translate(${margen.izquierdo}, ${margen.superior})`);

const ejeX = d3.axisBottom().scale(x);
const ejeY = d3.axisLeft().scale(y);

const formatDate = d3.timeParse("%Y");

data = d3.csv("data.csv").then((misDatos) => {
  misDatos.map((d) => {
    d.year = +d.year;
    d.age = +d.age;
  });
  //console.log(misDatos);

  y.domain([0, ages[0]]);
  x.domain(misDatos.map((d) => d.year));

  grupoX.call(ejeX);
  grupoY.call(ejeY);

  var colours = d3
    .scaleOrdinal()
    .range([
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
      "#ffa600",
    ]);

  var bars = grupoElementos.selectAll("rect").data(misDatos);
  bars
    .enter()
    .append("rect")
    //.attr("fill", "black")
    .attr("fill", (d) => colours(d.name))
    .attr("stroke", "white")
    .attr("class", (d) => d.name.replace(" ", "-"))
    .attr("x", (d) => x(d.year))
    .attr("y", (d) => y(d.age))
    .attr("width", x.bandwidth())
    .attr("height", (d) => alto - margen.inferior - margen.superior - y(d.age))
    .on("mousemove", (d) => {
      tooltip
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .html(
          d.name +
            "<br>" +
            "Age: " +
            d.age +
            "<br>" +
            "Age Difference: " +
            (age(d.year) - d.age)
        );
    })
    .on("mouseout", (d) => {
      tooltip.style("display", "none");
    });

  // Linea ---

  let lineaDiCaprio = [];
  years.forEach(function (d, i) {
    let obj = {};
    obj.years = d;
    obj.ages = ages[i];
    lineaDiCaprio.push(obj);
  });

  let createLine = d3
    .line()
    .y((d) => y(d["ages"]))
    .x((d) => x(d["years"]));
  //console.log(lineaDiCaprio);
  grupoElementos
    .append("path")
    .datum(lineaDiCaprio)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("d", createLine);
});
