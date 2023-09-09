const testData = require("../data/Revenue.json");
class MyNode {
  constructor(id: string, value: number, valueText: string) {
    this.id = id;
    this.value = value;
    this.valueText = valueText;
  }
  id = "";
  value = 0;
  valueText = "";
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

const nodes: any[] = [];
const links: any[] = [];
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
                  element[properties[0]],
                  parentKey,
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
JSONProcessor(testData);
// console.log(nodes);
console.log(links);
