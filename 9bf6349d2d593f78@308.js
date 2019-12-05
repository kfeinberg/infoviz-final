// https://observablehq.com/@kfeinberg/land-allocated-to-national-park-service@308
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Land Allocated to National Park Service

This scatterplot shows the cumulative amount of land allocated to the national park service versus the current year.`
)});
  main.variable(observer("viewof replay")).define("viewof replay", ["html"], function(html){return(
html`<button>Replay`
)});
  main.variable(observer("replay")).define("replay", ["Generators", "viewof replay"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["replay","d3","DOM","width","height","length","line","data","xAxis","yAxis","x","y","halo"], function(replay,d3,DOM,width,height,length,line,data,xAxis,yAxis,x,y,halo)
{
  replay;

  const svg = d3.select(DOM.svg(width, height));

  const l = length(line(data));
  
  svg.append("g")
      .call(xAxis);
  
  svg.append("g")
      .call(yAxis);
  
  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", `0,${l}`)
      .attr("d", line)
    .transition()
      .duration(5000)
      .ease(d3.easeLinear)
      .attr("stroke-dasharray", `${l},${l}`);
  
  svg.append("g")
      .attr("fill", "white")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => x(d.year))
      .attr("cy", d => y(d.acres))
      .attr("r", 3);
  
  const label = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", d => `translate(${x(d.year)},${y(d.acres)})`)
      .attr("opacity", 0);
  
  label.append("text")
      .text(d => d.name)
      .each(function(d) {
        const t = d3.select(this);
        switch (d.orient) {
          case "top": t.attr("text-anchor", "middle").attr("dy", "-0.7em"); break;
          case "right": t.attr("dx", "0.5em").attr("dy", "0.32em").attr("text-anchor", "start"); break;
          case "bottom": t.attr("text-anchor", "middle").attr("dy", "1.4em"); break;
          case "left": t.attr("dx", "-0.5em").attr("dy", "0.32em").attr("text-anchor", "end"); break;
        }
      })
      .call(halo);
  
  label.transition()
      .delay((d, i) => length(line(data.slice(0, i + 1))) / l * (5000 - 125))
      .attr("opacity", 1);
  
  return svg.node();
}
);
  main.variable(observer("height")).define("height", function(){return(
720
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 30, left: 40}
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => d.year)).nice()
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => d.acres)).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width","data","halo"], function(height,margin,d3,x,width,data,halo){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("y2", -height)
        .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
        .attr("x", width - 4)
        .attr("y", -4)
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text(data.x)
        .call(halo))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","height","width","data","halo"], function(margin,d3,y,height,width,data,halo){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(height / 80))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("x2", -width)
        .attr("stroke-opacity", 0.1))
    .call(g => g.append("text").clone()
        .attr("x", 4)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text(data.y)
        .call(halo))
)});
  main.variable(observer("halo")).define("halo", function(){return(
function halo(text) {
  text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
}
)});
  main.variable(observer("length")).define("length", ["d3"], function(d3){return(
function length(path) {
  return d3.create("svg:path").attr("d", path).node().getTotalLength();
}
)});
  main.variable(observer("line")).define("line", ["d3","x","y"], function(d3,x,y){return(
d3.line()
    .curve(d3.curveLinear)
    .x(d => x(d.year))
    .y(d => y(d.acres))
)});
  main.variable(observer("data")).define("data", ["d3"], function(d3)
{
  let data = d3.csvParse(`acres,year
2219790.71,1872
3385600.84,1890
3621982.48,1899
3839177.37,1902
3891662.54,1906
4904791.48,1910
5170586.68,1915
5633871.7,1916
10374782.86,1917
11772724.27,1919
13170665.68,1921
13206500.76,1928
13516544.72,1929
13563311.17,1930
15594706.15,1934
15793901.42,1935
16716551.52,1938
17750242.83,1940
17803073.02,1941
18604236.23,1944
18619184.69,1956
18840600.46,1962
19178198.29,1964
19264565.39,1966
19908345.7,1968
20445129.09,1971
20758331.92,1978
48966337.02,1980
49043517.02,1986
49051773.69,1988
49116474.91,1992
53371889.51,1994
53402639.26,1999
53435211.61,2000
53461487.43,2003
53568829.3,2004
53595515.03,2013`, ({acres, year}) => ({acres: +acres, year: +year}));
  data.x = "Year";
  data.y = "Acres of National Park"
  return data;
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
