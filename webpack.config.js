const path = require("path");
module.exports = {
  entry: "./dist/app.js",
  output: {
    filename: "bundle.js",
    // filename: "musarrat.js", // Your output filename
    // path: path.resolve(
    //   __dirname,
    //   "E:/Folder D/project/IMS/IMS.WEB/Scripts/IMS/RenderedJs"
    // ), // Output folder path
  },
  externals: {},
  mode: "development", // Change the mode to "development"
  devtool: "source-map", // Add this line to enable source maps
};
