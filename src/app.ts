import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import processJSON from "./jsonjProcessor";
const color = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(",.0f");
const jsonData = {
  Revenues: {
    total: { value: 50100000000, valueText: "$50.1B", change: "+11% Y/Y" },
    products: [
      {
        pro1: "Microsoft 365, Linked in",
        value: 16500000000,
        valueText: "$16.5B",
        change: "+9% Y/Y",
      },
      {
        pro2: "Intelligent Cloud",
        value: 20300000000,
        valueText: "$20.3B",
        change: "+20% Y/Y",
      },
      {
        pro3: "Intelligent Cloud",
        value: 13300000000,
        valueText: "$13.3B",
        change: "Flat Y/Y",
      },
    ],
    "Gross Profit": {
      total: {
        value: 34700000000,
        valueText: "$34.7B",
        change: "(1pp) Y/Y",
        margin: "69% margin",
      },
      "Operating Profit": {
        total: {
          value: 21500000000,
          valueText: "$21.5B",
          change: "(2pp) Y/Y",
          margin: "43% margin",
        },
        "Net Profit": {
          total: {
            value: 17600000000,
            valueText: "$17.6B",
            change: "(10pp) Y/Y",
            margin: "35% margin",
          },
          "Other Profit": { value: 54000000, valueText: "$54M" },
        },
        Tax: { value: 4000000000, valueText: "($4.0B)" },
      },
      "Operating Expenses": {
        total: { value: 13200000000, valueText: "($13.2B)" },
        expenses: [
          { exp1: "R&D", value: 6600000000, valueText: "($6.6B)" },
          { exp2: "S&M", value: 5100000000, valueText: "($5.1B)" },
          { exp3: "G&A", value: 1400000000, valueText: "($1.4B)" },
        ],
      },
    },
    "Cost of Revenue": {
      value: 15500000000,
      valueText: "($15.5B)",
      change: "",
    },
  },
};
// const sampledata = {
//   nodes: [
//     { id: "Revenues", color: color("Revenues") },
//     {
//       id: "Products (Microsoft 365, Linked in)",
//       color: color("Products (Microsoft 365, Linked in)"),
//     },
//     {
//       id: "Products (Intelligent Cloud)",
//       color: color("Products (Intelligent Cloud)"),
//     },
//     { id: "Gross Profit", color: color("Gross Profit") },
//     { id: "Operating Profit", color: color("Operating Profit") },
//     { id: "Net Profit", color: color("Net Profit") },
//     { id: "Other Profit", color: color("Other Profit") },
//     { id: "Tax", color: color("Tax") },
//     { id: "Operating Expenses", color: color("Operating Expenses") },
//     { id: "R&D", color: color("R&D") },
//     { id: "S&M", color: color("S&M") },
//     { id: "G&A", color: color("G&A") },
//     { id: "Cost of Revenue", color: color("Cost of Revenue") },
//   ],
//   links: [
//     {
//       source: "Revenues",
//       target: "Products (Microsoft 365, Linked in)",
//       value: 16500000000,
//     },
//     {
//       source: "Revenues",
//       target: "Products (Intelligent Cloud)",
//       value: 20300000000,
//     },
//     {
//       source: "Revenues",
//       target: "Products (Intelligent Cloud)",
//       value: 13300000000,
//     },
//     { source: "Revenues", target: "Gross Profit", value: 34700000000 },
//     { source: "Gross Profit", target: "Operating Profit", value: 21500000000 },
//     {
//       source: "Gross Profit",
//       target: "Operating Expenses",
//       value: 13200000000,
//     },
//     { source: "Operating Profit", target: "Net Profit", value: 17600000000 },
//     { source: "Operating Profit", target: "Other Profit", value: 54000000 },
//     { source: "Operating Profit", target: "Tax", value: 4000000000 },
//     { source: "Operating Expenses", target: "R&D", value: 6600000000 },
//     { source: "Operating Expenses", target: "S&M", value: 5100000000 },
//     { source: "Operating Expenses", target: "G&A", value: 1400000000 },
//     { source: "Gross Profit", target: "Cost of Revenue", value: 15500000000 },
//   ],
// };
// Start processing the JSON data
let processedData = processJSON(jsonData);

// Log the nodes and links arrays
console.log("Nodes:", processedData.nodes);
console.log("Links:", processedData.links);
//#region Globals
const width = 1000;
const height = 600;
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
