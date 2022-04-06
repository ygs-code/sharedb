/*
 * @Date: 2022-03-31 17:20:04
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 17:24:57
 * @FilePath: /sharedb/examples/modules/demo/CLI-Progress.js
 * @Description: 
 */
const cliProgress = require('cli-progress'); 

// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// start the progress bar with a total value of 200 and start value of 0
bar1.start(10000, 0);

// update the current value in your application..
bar1.update(100);

// stop the progress bar
bar1.stop();

console.log('bar1=',bar1)

