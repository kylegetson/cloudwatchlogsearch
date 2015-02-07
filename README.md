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

#### Example 
```./bin/logsearch --action=tail --logFormat json --fields hostname,audit.res.latency,audit.res.statusCode  --logGroupName MyLog/GroupName --logStreamName myStreamName```

To run this, you must set up an AWS credentials file with your secret key and secret access key. Create a file located at ```~/.aws/credentials``` 

```
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

[More information on authentication](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
