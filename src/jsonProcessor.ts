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
function JSONProcessor(temp: any) {
  Object.keys(temp).forEach((key) => {
    if (typeof temp[key] == "object" && key !== "total") {
      console.log(typeof temp[key]);
      if (temp[key].hasOwnProperty("value")) {
        nodes.push(new MyNode(key, temp[key].value, temp[key].valueText));
        JSONProcessor(temp[key]);
      }
      if (temp[key].hasOwnProperty("total")) {
        nodes.push(
          new MyNode(key, temp[key].total.value, temp[key].total.valueText)
        );
        JSONProcessor(temp[key]);
      }
    } else {
      //   if (typeof temp == "object") {
      //     console.log("others", temp);
      //   }
    }
    if (Array.isArray(temp[key])) {
      console.log("found an arry", temp);
      temp[key].forEach((element: any) => {
        if (Array.isArray(element)) {
          JSONProcessor(element);
        } else {
          console.log(element);

          // JSONProcessor(element);
          if (element.hasOwnProperty("value")) {
            let properties = Object.getOwnPropertyNames(element);
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
  console.log(nodes);
}

JSONProcessor(testData);
