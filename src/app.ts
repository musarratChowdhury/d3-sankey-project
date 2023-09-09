import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import processJSON from "./jsonjProcessor";
import JSONProcess, {
  SankeyData,
  SankeyLink,
  SankeyNode,
} from "./jsonProcessor";
const color = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(",.0f");
const jsonData = require("../data/Revenue.json");
console.log(jsonData);

// Start processing the JSON data
let processedData = JSONProcess(jsonData);

// Log the nodes and links arrays
console.log("processedData", processedData);
//#region Globals
const width = 1000;
const height = 600;
//#endregion
// Select the HTML container where you want to render the Sankey graph
const container = d3.select("#sankey-container");
// Defines a color scale.
// Define types for your JSON data

// Parse your JSON data (replace this with your actual data)
const sankeyData: SankeyData = processedData;
sankeyData.nodes.forEach((node, index) => {
  node.color = color(index.toString());
});

// Create a D3-sankey layout
const sankeyLayout = sankey<SankeyData, SankeyNode, SankeyLink>()
  .nodeId((d) => d.id)
  .nodeWidth(40)
  .nodePadding(30)
  .extent([
    [1, 1],
    [width - 1, height - 5],
  ]);

const { nodes, links } = sankeyLayout(processedData);
// const { nodes, links } = processedData;

// Create an SVG element to contain the Sankey graph
const svg = container
  .append("svg")
  .attr("width", "100%")
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; font: 15px sans-serif;");

// Create links between nodes
const link = svg
  .append("g")
  .selectAll(".link")
  .data(links)
  .enter()
  .append("path")
  .attr("stroke-opacity", 0.5)
  .attr("stroke", "grey")
  .attr("d", sankeyLinkHorizontal())
  .attr("stroke-width", (d) => Math.max(1, d.width!))
  .attr("fill", "none")
  .style("mix-blend-mode", "multiply");

// Creates a gradient, if necessary, for the source-target color option.

const gradient = link
  .append("linearGradient")
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", (d) => d.source)
  .attr("x2", (d) => d.target);
gradient.append("stop").attr("offset", "0%").attr("stop-color", "red");
gradient.append("stop").attr("offset", "100%").attr("stop-color", "blue");

link
  .append("path")
  .attr("d", sankeyLinkHorizontal())
  .attr("stroke", "red")
  .attr("stroke-width", (d) => Math.max(1, d.width!));

link
  .append("title")
  .text((d) => `${d.source} → ${d.target}\n${format(d.value)} TWh`);

// Create nodes
const node = svg
  .append("g")
  .attr("stroke", "#000")
  .selectAll(".node")
  .data(nodes)
  .enter()
  .append("g")
  .attr("fill", (d) => d.color)
  .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

// Add rectangles to represent nodes
node
  .append("rect")
  .attr("width", (d) => d.x1! - d.x0!)
  .attr("height", (d) => d.y1! - d.y0!)
  // .style("fill", (d) => (d.color = color(d.id.replace(/ .*/, ""))))
  .style("stroke", (d) => d3.rgb(d.color).darker(2).toString())
  .append("title")
  .text((d) => `${d.id}\n${format(d.value!)}$`); // Display node labels on hover

// Add labels to nodes
node
  .append("text")
  .attr("x", -6)
  .attr("y", (d) => (d.y1! - d.y0!) / 2)
  .attr("dy", "0.35em")
  .attr("text-anchor", "end")
  .text((d) => d.id)
  .filter((d) => d.x0! < width / 2)
  .attr("x", 6 + sankeyLayout.nodeWidth())
  .attr("text-anchor", "start");

svg
  .append("g")
  .selectAll()
  .data(nodes)
  .join("text")
  .attr("x", (d) => (d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6))
  .attr("y", (d) => (d.y1! + d.y0!) / 2)
  .attr("dy", "0.35em")
  .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"))
  .text((d) => d.id);
// Optionally, you can customize styles and add interactivity as needed
// the function for moving the nodes
// const  dragmove(d:any)=> {
//   d3.select(this)
//     .attr("transform",
//           "translate("
//              + d.x + ","
//              + (d.y = Math.max(
//                 0, Math.min(height - d.dy, d3.event.y))
//                ) + ")");
//   sankey.relayout();
//   link.attr("d", path);
// }
// Here you can add additional features like tooltips, interactions, or styling
