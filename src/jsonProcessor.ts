const testData = require("../data/Revenue.json");
export interface SankeyNode {
  id: string;
  value: number;
  valueText: string;
  color: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}
class MyNode {
  constructor(id: string, value: number, valueText: string) {
    this.id = id;
    this.value = value;
    this.valueText = valueText;
  }
  id = "";
  value = 0;
  valueText = "";
  color = "";
}
class MyLink {
  constructor(source: string, target: string, value: number) {
    this.source = source;
    this.target = target;
    this.value = value;
  }
  source = "";
  target = "";
  value = 0;
}
export default function JSONProcess(data: any): SankeyData {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];
  //#region function body
  function JSONProcessor(temp: any, parentKey?: any) {
    Object.keys(temp).forEach((key) => {
      // if (parentKey) {
      //   console.log("-----temp--all---", parentKey, key);
      // }
      if (typeof temp[key] == "object" && key !== "total") {
        // console.log(typeof temp[key]);
        if (temp[key].hasOwnProperty("value")) {
          if (parentKey) {
            console.log("-----parentkey, key-----", parentKey, key);
            links.push(new MyLink(parentKey, key, temp[key].value));
          }
          nodes.push(new MyNode(key, temp[key].value, temp[key].valueText));
          JSONProcessor(temp[key], key);
        }
        if (temp[key].hasOwnProperty("total")) {
          if (parentKey) {
            console.log("-----parentkey, key-----", parentKey, key);
            links.push(new MyLink(parentKey, key, temp[key].total.value));
          }
          nodes.push(
            new MyNode(key, temp[key].total.value, temp[key].total.valueText)
          );
          JSONProcessor(temp[key], key);
        }
      } else {
        // if (typeof temp == "object") {
        //   // console.log("others", temp);
        //   console.log("-----temp--else---", parentKey, key);
        // }
      }
      if (Array.isArray(temp[key])) {
        // console.log("found an arry", temp);
        temp[key].forEach((element: any) => {
          if (Array.isArray(element)) {
            JSONProcessor(element, key);
          } else {
            // JSONProcessor(element);
            if (element.hasOwnProperty("value")) {
              let properties = Object.getOwnPropertyNames(element);
              if (parentKey) {
                console.log(
                  "-----temp-from array section----",
                  element[properties[0]],
                  parentKey
                );
                links.push(
                  new MyLink(
                    parentKey,
                    element[properties[0]],
                    element[properties[1]]
                  )
                );
              }

              nodes.push(
                new MyNode(
                  element[properties[0]],
                  element[properties[1]],
                  element[properties[2]]
                )
              );
            }
          }
        });
      }
    });
  }
  //#endregion
  JSONProcessor(data);
  console.log("links", links);
  return { nodes, links };
}
