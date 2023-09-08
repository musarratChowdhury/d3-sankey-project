const testData = require("../data/Revenue.json");
class MyNode {
  constructor(id: string) {
    this.id = id;
  }
  id = "";
}

const nodes: any[] = [];
const links: any[] = [];
function JSONProcessor(temp: any) {
  Object.keys(temp).forEach((key) => {
    if (typeof temp[key] == "object" && key !== "total") {
      console.log(typeof temp[key]);
      if (
        temp[key].hasOwnProperty("value") ||
        temp[key].hasOwnProperty("total")
      ) {
        nodes.push(new MyNode(key));
        JSONProcessor(temp[key]);
      }
    } else {
      //   if (typeof temp == "object") {
      //     console.log("others", temp);
      //   }
    }
    if (Array.isArray(temp[key])) {
      console.log("found an arry", temp[key]);
      temp[key].forEach((element: any) => {
        if (Array.isArray(element)) {
          JSONProcessor(element);
        } else {
          console.log(element);

          // JSONProcessor(element);
          if (element.hasOwnProperty("value")) {
            let properties = Object.getOwnPropertyNames(element);
            nodes.push(new MyNode(element[properties[0]]));
          }
        }
      });
    }
  });
  console.log(nodes);
}

JSONProcessor(testData);
