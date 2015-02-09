var AWS = require('aws-sdk');
var async = require('async');

// defaults to ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials();
AWS.config.credentials = credentials;

var Table = require('cli-table');

// defaults
var requestMaxResults = 1000;
var awsRegion = 'us-east-1';
var slowdownms = 5000;
var startTime = (+Date.now() - 60000);
var now = +Date.now();

// the tail and tailsearch function
module.exports = function (program) {
  var nextToken;

  if (program.region) {
    awsRegion = program.region;
  }
  if (program.limit) {
    requestMaxResults = program.limit;
  }

  AWS.config.update({
    region: awsRegion
  });

  var logs = new AWS.CloudWatchLogs();

  async.forever(
    function (next) {

      if (program.startTime) {
        startTime = program.startTime;
      }

      if (nextToken) {
        startTime = undefined;
      }

      logs.getLogEvents({
        limit: requestMaxResults,
        logGroupName: program.logGroupName,
        logStreamName: program.logStreamName,
        startTime: startTime,
        nextToken: nextToken
      }, function (err, res) {
        if (err) {
          return next(err);
        }
        else {

          nextToken = res.nextForwardToken;

          if (res.events.length) {
            var table = new Table({
              head: program.fields,
              truncate: false
            });
          }
          var displayLength = 0;
          res.events.forEach(function (event) {

            // filter things?
            if (program.action == 'tailsearch' && program.regex) {
              var r = new RegExp(program.regex);
              if (!r.test(event.message)) {
                return;
              }
            }

            if (program.logFormat == 'json' && program.fields) {

              var timeDiff = Math.floor(Math.abs(event.ingestionTime - now) / 1000);

              var rowData = handleJson(event.message, program.fields);
              var row = [timeDiff];

              // no undefineds in the table apparently
              program.fields.forEach(function (f) {
                if (f != 'ingestionTime' && f != 'Seconds Ago') {
                  row.push(rowData[f] || '-');
                }
              });

              table.push(row);
              displayLength++;

            }
            else if (program.logFormat == 'json') {
              console.log({
                ingestionTime: new Date(event.ingestionTime),
                event: event.message
              });
              displayLength++;
            }
            else {
              console.log(new Date(event.ingestionTime) + ': ' + event.message);
              displayLength++;
            }
          });

          // if we have table to display
          if (res.events.length && table && displayLength && program.fields) {
            console.log(table.toString());
          }

          console.log(res.events.length + " events");

          // wasnt full, slow down with incoming requests, CWLogs isnt realtime
          if (res.events.length < requestMaxResults) {
            return setTimeout(next, slowdownms);
          }

          return next();
        }

      });

    },
    function (err) {
      console.log(err);
    }
  );

}

// the message string the properties that need to be returned/displayed
function handleJson(string, props) {
  var robj = {};
  try {
    var obj = JSON.parse(string);
  }
  catch (e) {
    return robj;
  }
  props.forEach(function (p) {
    if (p != 'ingestionTime' && p != 'Seconds Ago') {
      robj[p] = p.split('.').reduce(index, obj);
    }
  });
  return robj;
}

// for turning strings into obj properties
function index(obj, i) {
  if (obj && obj[i]) {
    return obj[i];
  }
}