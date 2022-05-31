/*
 * @Date: 2018-01-25 00:54:00
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-31 13:12:24
 * @FilePath: /sharedb/examples/rich-text-presence/webpack.config.js
 * @Description:
 */

var webpack = require("webpack");
var path = require("path");
var WebpackBar = require("webpackbar");
var FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
var CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
 
const NODE_ENV = process.env.NODE_ENV; // 环境参数
//    是否是生产环境
const isEnvProduction = NODE_ENV === "production";
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === "development";

module.exports = {
  devtool: "source-map", // 生产环境和开发环境判断
  mode: "development",
  entry: "./client.js",
  // watch: true,
  module: {
    rules: [
      {
        test: /(\.tsx?$)|(\.ts?$)/,
        use: ["awesome-typescript-loader"].concat(
          isEnvDevelopment ? ["thread-loader", "cache-loader"] : []
        ),
      },
      {
        test: /\.m?js$/,
        enforce: "pre",
        // 排除文件,因为这些包已经编译过，无需再次编译
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
   
          },
        },
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "static/dist"),
  },
  plugins: [
    new FriendlyErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
    // // 编译ts插件
    // new CheckerPlugin(),
    // // 编译进度条
    new WebpackBar(),
    // new webpack.NoEmitOnErrorsPlugin(),
    // // 如果是配置前端就很好注入插件
    // new webpack.DefinePlugin({
    //   //也可以注入插件 能 注入vue 但是不能注入 Koa
    //   // vue,
    //   //不能注入 Koa
    //   // Koa,
    //   //注入一个环境变量
    //   "process.env": { BUILD_TARGET: "BUILD_TARGET" },
    // }),
  ],
};
