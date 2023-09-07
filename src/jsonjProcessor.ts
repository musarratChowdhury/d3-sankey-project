interface Node {
  id: string;
}

// Initialize arrays for nodes and links
const nodes: any[] = [];
const links: any[] = [];
// Process the JSON data
export default function processJSON(data: any) {
  // Function to add nodes
  function addNode(id: string) {
    if (!nodes.some((node) => node.id === id)) {
      nodes.push({ id: id });
    }
  }

  // Function to add link
  function addLink(source: string, target: string, value: string) {
    links.push({ source: source, target: target, value: value });
  }
  for (const key in data) {
    if (typeof data[key] === "object") {
      addNode(key);
      for (const innerKey in data[key]) {
        if (innerKey !== "total") {
          addNode(innerKey);
          console.log(innerKey == "value" ? data[key].value : 0);
          addLink(key, innerKey, innerKey == "value" ? data[key].value : 0);
          if (typeof data[key][innerKey] === "object") {
            processJSON(data[key][innerKey]);
          }
        }
      }
    }
  }
  //

  return { nodes, links };
}
