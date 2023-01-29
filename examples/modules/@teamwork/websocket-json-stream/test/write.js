/*
 * @Date: 2022-04-19 09:54:46
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-19 10:19:55
 * @FilePath: /sharedb/examples/modules/@teamwork/websocket-json-stream/test/write.js
 * @Description: 
 */
const WebSocketJSONStream = require('..')
// const assert = require('chai').assert
const http = require('http')
const WebSocket = require('ws')
const testCloseStatus = require('./close-status')

this.httpServer = http.createServer()
this.wsServer = new WebSocket.Server({ server: this.httpServer })
this.httpServer.listen(() => {
    const address = this.httpServer.address()

    this.url = `http://127.0.0.1:${address.port}`
    // console.log('this.url=',this.url)


    this.connect(({ clientWebSocket, serverWebSocket }) => {
        this.clientStream = new WebSocketJSONStream(this.clientWebSocket = clientWebSocket)
        this.serverStream = new WebSocketJSONStream(this.serverWebSocket = serverWebSocket)
     
        // this.serverStream.write({
        //     name:'abc'
        // })

        // done()
    })
})

this.connect = function (callback) {
    const clientWebSocket = new WebSocket(this.url)

    this.wsServer.once('connection', serverWebSocket => {

       let serverStream = new WebSocketJSONStream(this.serverWebSocket = serverWebSocket)
    //    console.log('serverStream=',serverStream)
       serverStream.write({
            name:'abc'
        })

        serverStream.on('data',(data)=>{
         console.log('data======',data)
        })
        // clientWebSocket.once('open', () =>
        //     callback({ clientWebSocket, serverWebSocket }))
    })
}