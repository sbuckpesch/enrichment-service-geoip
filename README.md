# Enrichment service boilerplate

## Getting started

With Serverless Framework v1.5 and later, a new project based on the
project template is initialized with the command
```
> sls install -u https://github.com/apparena/enrichment-service-boilerplate -n myservicename
> cd myservicename
> yarn
```
### Create a new function

Create a new function including tests and two HTTP endpoints (they are
optional. Remove the `--httpEvent` if you don't want them...

`sls create function -f myFunctionName --handler
functions/myFunctionName/index.handler --httpEvent "post myResource"
--httpEvent "get myResource"`

### Deploy your function

Deploy your function to your AWS account.

` sls deploy --stage dev`

### Display logs

Open a new terminal and enter this command to see incoming logs for
`myFunctionName` in `dev` environment.

`sls logs -f myFunctionName --stage dev --startTime 10m -t`

### Call your function

You can either **send a request to your HTTP-Endpoint** (will be
displayed after successful deployment) **or you call your function via
console**.

`SLS_DEBUG=* sls invoke --stage dev -f myFunctionName -p
functions/myFunctionName/mockData.json`

Remove the `-p functions/myFunctionName/mockData.json` parameter if you
do not want to send a mock event to your function.

See https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html for
sample events.

### Debugging

Please change the `debug` and `debug:invoke` script in `package.json` **if you
are not using Windows or installed Serverless using Yarn**. You need to
adapt the Path to your serverless command.

**Debugging HTTP requests:**

1. `yarn debug` will start a debug server
2. Open `about://inspect` in Chrome browser
3. Click on `Open dedicated DevTools for Node`
4. Start debugging in Chrome Dev Tools

**Debugging local function invokations:**

1. `yarn debug:invoke -f resolve -p test/resolve.json` will debug
   `reolve` function by sending the SNS event resolve.json to the function.
2. Open `about://inspect` in Chrome browser
3. Click on `Open dedicated DevTools for Node`
4. Start debugging in Chrome Dev Tools

#### Logs

To display the latest log stream just run:

```bash
yarn logs
```

## Enrichment config format

Description of the aggregation format needed to process an aggregation.
All available aggregations deployed within the same region as the aggregate
function of this service.

```json
{
  "name": "Geo IP",
  "functionName": "aa-data-enrichment-geoip-production-index",
  "endpoint": "https://myenrichment.apigateway.awsamazon.com/v1/",
  "options": {
    "config_key_1": "abcdefg",
    "config_key_2": true,
    "config_key_3": 123
  },
  "filters": [
    ["appId", 12345], // key | value
    ["event", "=",  "user_register"], // key | operator | value
    ["context.ip"], // existence
    ["customRegistrationData.newsletterOptin", "=", true], // key | operator | value
    ["customRegistrationData.gender", "<>", "male"] // key | operator | value
  ]
}
```

| Parameter    | Description                                                                                                                                                            |
|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name         | name of the service                                                                                                                                                    |
| functionName | Optional Lambda function name of this service. When used, the function needs to be deployed into the same region and account than the App-Arena infrastructure cluster |
| endpoint     | Public internet facing HTTP endpoint of the service, which will be called                                                                                              |
| options      | JSON object containing the whole configuration for the service call                                                                                                    |
| filters      | Array of arrays, containing filters the payload will be matched against. Enrichment service will only be invoked, when all filters are true                            |
