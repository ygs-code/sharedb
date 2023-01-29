var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec;
let startTime = new Date().getTime()
let bufferTime = 1000
// console.log('fs.watch=',fs)
fs.watch(
    path.resolve(__dirname, "./../modules")
    , {
        recursive: true
    }, function (event, filename) {
        let nowTime = new Date().getTime()
        if (nowTime - startTime < bufferTime) {
            return
        }
        startTime = nowTime
        // console.log('event is: ' + event);
        exec('browserify client.js -o static/dist/bundle.js', function (err, stdout, stderr) {
            if (err) {
                console.log('get weather api error:' + stderr);
            } else {
                console.log('Compile successfully')
            }
        });
        // if (filename) {
        //     console.log('filename provided: ' + filename);
        // } else {
        //     console.log('filename not provided');
        // }
    });
fs.watch(
    './client.js'
    , {
        recursive: true
    }, function (event, filename) {
        let nowTime = new Date().getTime()
        if (nowTime - startTime < bufferTime) {
            return
        }
        startTime = nowTime
        // exec('browserify client.js -o static/dist/bundle.js', function (err, stdout, stderr) {
        //     if (err) {
        //         console.log('get weather api error:' + stderr);
        //     } else {
        //         console.log('Compile successfully')
        //     }
        // });
        // if (filename) {
        //     console.log('filename provided: ' + filename);
        // } else {
        //     console.log('filename not provided');
        // }
    });    