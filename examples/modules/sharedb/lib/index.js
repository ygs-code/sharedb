/*
 * @Date: 2022-03-31 15:10:32
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-31 15:21:47
 * @FilePath: /sharedb/examples/modules/sharedb/lib/index.js
 * @Description: 
 */
 
var Backend = require('./backend');
module.exports = Backend;
Backend.Agent = require('./agent');
Backend.Backend = Backend;
Backend.DB = require('./db');
Backend.Error = require('./error');
Backend.logger = require('./logger');
Backend.MemoryDB = require('./db/memory');
Backend.MemoryMilestoneDB = require('./milestone-db/memory');
Backend.MemoryPubSub = require('./pubsub/memory');
Backend.MilestoneDB = require('./milestone-db');
Backend.ot = require('./ot');
Backend.projections = require('./projections');
Backend.PubSub = require('./pubsub');
Backend.QueryEmitter = require('./query-emitter');
Backend.SubmitRequest = require('./submit-request');
Backend.types = require('./types');
 
 