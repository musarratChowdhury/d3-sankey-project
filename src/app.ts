import * as d3 from "d3";
import {
  sankey,
  sankeyCenter,
  sankeyJustify,
  sankeyLeft,
  sankeyLinkHorizontal,
  sankeyRight,
} from "d3-sankey";
import JSONProcess, {
  SankeyData,
  SankeyLink,
  SankeyNode,
} from "./jsonProcessor";
const color = d3.scaleOrdinal(d3.schemeCategory10);
const jsonData = require("../data/Revenue.json");
console.log(jsonData);

// Start processing the JSON data
let processedData = JSONProcess(jsonData);

// Log the nodes and links arrays
console.log("processedData", processedData);
//#region Globals
const width = 1000;
const height = 450;
const format = d3.format(",.0f");
//#endregion
// Select the HTML container where you want to render the Sankey graph
const container = d3.select("#sankey-container");
const sankeyContainer = document.querySelector(".sankey-container");
const title = document.createElement("h2");
title.classList.add("title-text");
title.innerText = "Microsoft Q1 FY23 income statement";
sankeyContainer?.appendChild(title);

// Defines a color scale.
// Define types for your JSON data

// Parse your JSON data (replace this with your actual data)
const sankeyData: SankeyData = processedData;

// Create a D3-sankey layout
const sankeyLayout = sankey<SankeyData, SankeyNode, SankeyLink>()
  .nodeId((d) => d.id)
  .nodeWidth(45)
  .nodePadding(50)
  .nodeAlign(sankeyCenter)
  .extent([
    [1, 1],
    [width - 1, height - 5],
  ]);

const { nodes, links } = sankeyLayout(processedData);

console.log(nodes);
console.log(links);
// const { nodes, links } = processedData;

// Create an SVG element to contain the Sankey graph
const svg = container
  .append("svg")
  .attr("width", "100%")
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height + 40])
  .attr("style", "max-width: 100%; height: auto; font: 15px sans-serif;");

// Create nodes
const node = svg
  .append("g")
  .attr("stroke", "#000")
  .selectAll()
  .data(nodes)
  .join("rect")
  .attr("x", (d) => d.x0)
  //@ts-ignore
  .attr("y", (d) => d.y0)
  //@ts-ignore
  .attr("height", (d) => d.y1 - d.y0)
  .attr("width", (d) => d.x1 - d.x0)
  .attr("fill", (d) => color(d.category));

// Add rectangles to represent nodes
node.append("title").text((d) => `${d.id}\n${format(d.value!)}$`); // Display node labels on hover

// Create links between nodes
const link = svg
  .append("g")
  .attr("fill", "none")
  .attr("stroke-opacity", 0.5)
  .selectAll(".link")
  .data(links)
  .join("g")
  .style("mix-blend-mode", "multiply");

// Creates a gradient, if necessary, for the source-target color option.

//#region GRADIENT CONFIGURATION
const uid = `O-${Math.random().toString(16).slice(2)}`;
const gradient = link
  .append("linearGradient")
  //@ts-ignore
  .attr("id", (d) => `${uid}-link-${d.index}`)
  .attr("gradientUnits", "userSpaceOnUse")
  //@ts-ignore
  .attr("x1", (d) => d.source.x1)
  //@ts-ignore
  .attr("x2", (d) => d.target.x0);
gradient
  .append("stop")
  .attr("offset", "0%")
  .attr("stop-color", (d) => {
    // console.log(d);
    //@ts-ignore
    return color(d.source.category);
  });
gradient
  .append("stop")
  .attr("offset", "100%")
  //@ts-ignore
  .attr("stop-color", (d) => color(d.target.category));
// console.log("Grad", gradient);
//#endregion

link
  .append("path")
  .attr("d", sankeyLinkHorizontal())
  //@ts-ignore
  .attr("stroke", (d, i) => `url(#${uid}-link-${i})`)
  .attr("stroke-width", (d) => Math.max(1, d.width!));

link
  .append("title")
  .text((d) => `${d.source} → ${d.target}\n${format(d.value)} TWh`);

// Add labels to nodes

svg
  .append("g")
  .selectAll()
  .data(nodes)
  .join("text")
  .attr("x", (d) => (d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6))
  .attr("y", (d) => (d.y1! + d.y0!) / 2)
  // .attr("y", (d) => d.y0! - 10)
  .attr("dy", "-0.35em")
  .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"))
  .style("mix-blend-mode", "multiply")
  .style("font-size", "18px") // Set font size to 16 pixels
  .style("font-weight", "700")
  .style("font-family", "Roboto, sans-serif") // Set font family
  .attr("fill", (d) => color(d.category))
  .text((d) => `${d.id}`);

svg
  .append("g")
  .selectAll()
  .data(nodes)
  .join("text")
  .attr("x", (d) => (d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6))
  .attr("y", (d) => (d.y1! + d.y0!) / 2)
  // .attr("y", (d) => d.y0! - 10)
  .attr("dy", "1em")
  .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"))
  .style("mix-blend-mode", "multiply")
  .style("font-size", "16px") // Set font size to 16 pixels
  .style("font-weight", "500")
  .style("font-family", "Roboto, sans-serif") // Set font family
  .attr("fill", (d) => color(d.category))
  .text((d) => `${d.valueText}`);

svg
  .append("g")
  .selectAll()
  .data(nodes)
  .join("text")
  .attr("x", (d) => (d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6))
  .attr("y", (d) => (d.y1! + d.y0!) / 2)
  // .attr("y", (d) => d.y0! - 10)
  .attr("dy", "2em")
  .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"))
  .style("mix-blend-mode", "multiply")
  .style("font-size", "14px") // Set font size to 16 pixels
  .style("font-weight", "400")
  .style("font-family", "Roboto, sans-serif") // Set font family
  .attr("fill", (d) => color(d.category))
  .text((d) => `${d.change}`);

svg
  .append("g")
  .selectAll()
  .data(nodes)
  .join("text")
  .attr("x", (d) => (d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6))
  .attr("y", (d) => (d.y1! + d.y0!) / 2)
  // .attr("y", (d) => d.y0! - 10)
  .attr("dy", "3em")
  .attr("text-anchor", (d) => (d.x0! < width / 2 ? "start" : "end"))
  .style("mix-blend-mode", "multiply")
  .style("font-size", "14px") // Set font size to 16 pixels
  .style("font-weight", "400")
  .style("font-family", "Roboto, sans-serif") // Set font family
  .attr("fill", (d) => color(d.category))
  .text((d) => `${d.margin}`);
