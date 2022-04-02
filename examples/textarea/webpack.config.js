/*
 * @Date: 2018-01-25 00:54:00
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-02 18:50:16
 * @FilePath: /sharedb/examples/textarea/webpack.config.js
 * @Description:
 */
var path = require("path");

module.exports = {
  devtool: "source-map", // 生产环境和开发环境判断
  mode: "development",
  entry: "./client.js",
  watch: true,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "static"),
  },
};
