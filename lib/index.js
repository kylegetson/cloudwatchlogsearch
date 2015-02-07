var program = require('commander');
var tail = require('./tail.js');

function list(val) {
  return val.split(',');
}

program
  .version('0.0.1')
  .option('--logGroupName [logGroupName]', 'logGroupName')
  .option('--logStreamName [logStreamName]', 'logStreamName')
  .option('--startTime [startTime]', 'startTime')
  .option('--region [region]', 'us-east-1')
  .option('--action [actionName]', 'What to do: [tail, search, tailsearch]')
  .option('--logFormat [type]', 'string|json')
  .option('--limit [10000]', 'size of results to get per request, 10,000 max')
  .option('--fields <list>', 'username,timestamp,notes', list)
  .option('--regex [regex]', 'only needed if doing tailsearch example value [a][0-9]', list)
  .parse(process.argv);

switch (program.action) {
case 'search':
  console.log('not yet defined');
  break;
case 'tail':
case 'tailsearch':
default:
  console.log('tailining...');
  if (program.fields) {
    program.fields.unshift('Seconds Ago');
  }
  tail(program);
  break;
}