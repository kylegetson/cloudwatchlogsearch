# Cloud Watch Log Search
Cloud watch log search tool. Currently only does tailing, and tailing with regex (tailserach). If you use JSON formatted logs, make sure you set the logformat, and select fields to display for a table view. Unless startTime is defined, tailing defaults to 60 seconds ago.

**Required**

```
--logGroupName [MyLog/Group]
--logStreamName [messages]
--action [tail]
```

### For help
```./bin/logsearch -h```

```
Usage: logsearch [options]

  Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    --logGroupName [logGroupName]    logGroupName
    --logStreamName [logStreamName]  logStreamName
    --startTime [startTime]          startTime
    --region [region]                us-east-1
    --action [actionName]            What to do: [tail, search, tailsearch]
    --logFormat [type]               string|json
    --limit [10000]                  size of results to get per request, 10,000 max
    --fields <list>                  username,timestamp,notes
    --regex [regex]                  only needed if doing tailsearch example value [a][0-9]
```

#### Example 
```./bin/logsearch --action=tail --logFormat json --fields hostname,audit.res.latency,audit.res.statusCode  --logGroupName MyLog/GroupName --logStreamName myStreamName```

![alt text](https://github.com/kylegetson/cloudwatchlogsearch/raw/master/images/output.png "Example output")


To run this, you must set up an AWS credentials file with your secret key and secret access key. Create a file located at ```~/.aws/credentials``` 

```
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

[More information on authentication](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
