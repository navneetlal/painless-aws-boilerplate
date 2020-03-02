# AWS Lambda Serverless BoilerPlate

Serverless has gained popularity due to ease of development. It also eliminates infrastructure management tasks such as server or cluster provisioning, patching, operating system maintenance, and capacity provisioning. But person who is new to this may face problem in managing code and that leads to difficult in refactoring and scaling APIs.

Find out more --> https://aws.amazon.com/serverless/

Here i have tried to use **microservice** concept in serverless. We have collection of loosely coupled services (say first-service, second-service, etc) which uses asynchronous messaging for inter-service communication. In **AWS** we can make use of **SNS(Simple Notification Service)** and **SQS(Simple Queue Service)** to achieve that.

## Prerequisite Knowledge
- NodeJS
- TypeScript
- AWS Resources (Lambda function, DynamoDB, SNS, SQS, API Gateway)
- Basic of CloudFormation
- Serverless Framework

## Structuring serverless configuration
In the root directory we have `serverless.yml` where we have all the configuration for the provider. Separate environment variables for dev and prod in `dev.env.yml` and `prod.env.yml` respectively. And configuration for the services are in there respective directory.

To start a service
```bash
$ npx serverless offline start --stage dev --service first-service --port 3000
```
OR
```bash
$ npm start -- --service first-service --port 3004
```

OR to start all the service at once for local testing you can make use of `lambda-serverless.ts`. This uses reverse proxy to route to different service based on the routes.

```bash
$ npm run offline
```

>Note: This project is build on typescript so do not forget to start typescript compiler before starting any services.
>```bash
>$ npm run watch
>```

## Issues
In case of any problem in the assignment open an issue here at https://github.com/navneetlal/painless-aws-boilerplate/issues