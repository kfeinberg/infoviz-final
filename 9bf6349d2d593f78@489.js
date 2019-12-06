// https://observablehq.com/@kfeinberg/land-allocated-to-national-park-service@489
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["visitors@2.csv",new URL("./files/5f527e46b2c9e69470be14e7b961d4d85b515496bbe2aeca5c2c3281cf75e2886ec3b7117927f348c5b3526c9d51d8ef35ad199b9e47198564c703c0e09175b4",import.meta.url)],["presidents.csv",new URL("./files/6ad6a7f12638a2462688e1722b35e3456adafc04d16589b23e62e0d8277bf7509c0f133b232e1b8e8e9377cf45e912a31175fc8bb5df7c6ca14b452f9c214c7e",import.meta.url)],["nps2.csv",new URL("./files/afd45d6126482153bdaaa04aed0d4674b93bf7d47f75e7a27fe608dcd2637b55f36db0bf3b6984efba593eb7df1175ff7aac0df1ae5676f4c42eef871e74699a",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Land Allocated to National Park Service

This scatterplot shows the cumulative amount of land allocated to the national park service versus the current year.`
)});
  main.variable(observer("viewof replay")).define("viewof replay", ["html"], function(html){return(
html`<button>Replay`
)});
  main.variable(observer("replay")).define("replay", ["Generators", "viewof replay"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["replay","d3","DOM","width","height","length","line","data","visitor_line","visitor_data","xAxis","yAxis","rightAxis","x","y","y_vis","halo"], function(replay,d3,DOM,width,height,length,line,data,visitor_line,visitor_data,xAxis,yAxis,rightAxis,x,y,y_vis,halo)
{
  replay;

  const svg = d3.select(DOM.svg(width, height));

  const l = length(line(data));
  const l2 = length(visitor_line(visitor_data));
  
  svg.append("g")
      .call(xAxis);
  
  svg.append("g")
      .call(yAxis);
  
  svg.append("g")
      .call(rightAxis);
  
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
  
    svg.append("path")
      .datum(visitor_data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", `0,${l2}`)
      .attr("d", visitor_line)
    .transition()
      .duration(5000)
      .ease(d3.easeLinear)
      .attr("stroke-dasharray", `${l2},${l2}`);
  
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
  
    svg.append("g")
      .attr("fill", "white")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
    .selectAll("circle")
    .data(visitor_data)
    .join("circle")
      .attr("cx", d => x(d.year))
      .attr("cy", d => y_vis(d.visitors))
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
          // case "right": t.attr("dx", "0.5em").attr("dy", "0.32em").attr("text-anchor","start"); break;
          // case "bottom": t.attr("text-anchor", "middle").attr("dy", "1.4em"); break;
          // case "left": t.attr("dx", "-0.5em").attr("dy", "0.32em").attr("text-anchor", "end"); break;
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
600
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 30, left: 40}
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => d.year)).nice()
    .range([margin.left, width - 6*margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain(d3.extent(data, d => d.acres)).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("y_vis")).define("y_vis", ["d3","visitor_data","height","margin"], function(d3,visitor_data,height,margin){return(
d3.scaleLinear()
    .domain(d3.extent(visitor_data, d => d.visitors)).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width","data","halo"], function(height,margin,d3,x,width,data,halo){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())
    // .call(g => g.selectAll(".tick line").clone()
    //     .attr("y2", -height)
    //     .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
        .attr("x", width - 4)
        .attr("y", -4)
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .attr("transform", `translate(${-5*margin.right},0)`)
        .text(data.x)
        .call(halo))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data","halo"], function(margin,d3,y,data,halo){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(12))
    .call(g => g.select(".domain").remove())
    // .call(g => g.selectAll(".tick line").clone()
    //     .attr("x2", width)
    //     .attr("stroke-opacity", 0.1))
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 4)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("fill", "green")
        .text(data.y)
        .call(halo))
)});
  main.variable(observer("rightAxis")).define("rightAxis", ["width","margin","d3","y_vis","visitor_data","halo"], function(width,margin,d3,y_vis,visitor_data,halo){return(
g => g
    .attr("transform", `translate(${width - 6*(margin.right)}, 0)`)
    .call(d3.axisLeft(y_vis).ticks(11))
    .call(g => g.select(".domain").remove())
    // .call(g => g.selectAll(".tick line").clone()
    //     .attr("x2", width)
    //     .attr("stroke-opacity", 0.1))
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 4)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("fill", "blue")
        .text(visitor_data.y)
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
  main.variable(observer("visitor_line")).define("visitor_line", ["d3","x","y_vis"], function(d3,x,y_vis){return(
d3.line()
    .curve(d3.curveLinear)
    .x(d => x(d.year))
    .y(d => y_vis(d.visitors))
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment)
{
  let data = d3.csvParse(await FileAttachment("nps2.csv").text(), ({year, scaled, party, orient}) => ({acres: +scaled, year: +year, name: party, orient: orient}));
  data.x = "Year";
  data.y = "Acres of National Park (100,000)"
  return data;
}
);
  main.variable(observer("visitor_data")).define("visitor_data", ["d3","FileAttachment"], async function(d3,FileAttachment)
{
  let data = d3.csvParse(await FileAttachment("visitors@2.csv").text(), ({year, visitors_scaled}) => ({year: +year, visitors: +visitors_scaled}));
  data.y = "Number of Visitors (10,0000)"
  return data;
}
);
  main.variable(observer("president_data")).define("president_data", ["d3","FileAttachment"], async function(d3,FileAttachment)
{
  let data = d3.csvParse(await FileAttachment("presidents.csv").text(), ({start, end, party}) => ({start: +start, end: +end, name: party}));
  data.y = "Number of Visitors (10,0000)"
  return data;
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
