import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
const color = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(",.0f");
const sampledata = {
  nodes: [
    { id: "Node A", color: color("Node A") },
    { id: "Node B", color: color("Node B") },
    { id: "Node C", color: color("Node C") },
    { id: "Node D", color: color("Node D") },
    { id: "Node E", color: color("Node E") },
  ],
  links: [
    { source: "Node A", target: "Node B", value: 10 },
    { source: "Node A", target: "Node C", value: 5 },
    { source: "Node B", target: "Node D", value: 8 },
    { source: "Node C", target: "Node D", value: 3 },
    { source: "Node B", target: "Node E", value: 1 },
  ],
};
//#region Globals
const width = 800;
const height = 400;
//#endregion
// Select the HTML container where you want to render the Sankey graph
const container = d3.select("#sankey-container");
// Defines a color scale.
// Define types for your JSON data
interface SankeyNode {
  id: string;
  color: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Parse your JSON data (replace this with your actual data)
const sankeyData: SankeyData = sampledata;
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

const { nodes, links } = sankeyLayout(sankeyData);

// Create an SVG element to contain the Sankey graph
const svg = container
  .append("svg")
  .attr("width", width)
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
  .attr("d", sankeyLinkHorizontal())
  .attr("stroke", "#f0f") // Customize the link color
  .attr("stroke-width", (d) => Math.max(1, d.width!))
  .attr("fill", "none")
  .style("mix-blend-mode", "multiply");

// Creates a gradient, if necessary, for the source-target color option.

const gradient = link
  .append("linearGradient")
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", (d) => d.source)
  .attr("x2", (d) => d.target);
gradient
  .append("stop")
  .attr("offset", "0%")
  .attr("stop-color", (d) => color(d.source));
gradient
  .append("stop")
  .attr("offset", "100%")
  .attr("stop-color", (d) => color(d.target));

link
  .append("path")
  .attr("d", sankeyLinkHorizontal())
  .attr("stroke", (d) => color(d.source))
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

// Here you can add additional features like tooltips, interactions, or styling
