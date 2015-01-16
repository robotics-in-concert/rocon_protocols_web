var MongoClient = require('mongodb').MongoClient,
  path = require('path'),
  CronJob = require('cron').CronJob,
  fs = require('fs'),
  argv = require('minimist')(process.argv.slice(2));



var config;
if(argv.config){
  config = JSON.parse(fs.readFileSync(argv.config));
}else{
  config = require("./config");
}

MongoClient.connect(config.mongo_url, function(e, db){
  if(e) throw e;
  console.log('mongo connected');

  var job = new CronJob({
    cronTime: '0 0 * * * *', // every hour
    onTick: function(){
      require('./sync_message')(db);
      require('./sync_rocon_app')(db, config.rocon_apps_url);
      require('./sync_hic_app')(db, config.hic_apps_url);
    },
    start: true
  });
  console.log('scheduler started');



});


