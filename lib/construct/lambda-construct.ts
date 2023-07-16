import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as logs from 'aws-cdk-lib/aws-logs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_lambda_nodejs as node_lambda } from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as path from 'path';

export class LambdaConstruct extends Construct {
  public goodMorningFunction: lambda.IFunction;
  public goodEveningFunction: lambda.IFunction;
  public goodNightFunction: lambda.IFunction;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    this.goodMorningFunction = new node_lambda.NodejsFunction(
      this,
      'goodMorningFunction',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '../../src/lambda/good-morning/index.ts'),
        // handler: "getItem",
        memorySize: 256,
        timeout: cdk.Duration.seconds(30),
        tracing: lambda.Tracing.ACTIVE,
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
        logRetention: logs.RetentionDays.THREE_MONTHS,
      }
    );
    this.goodEveningFunction = new node_lambda.NodejsFunction(
      this,
      'goodEveningFunction',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '../../src/lambda/good-evening/index.ts'),
        // handler: "getItem",
        memorySize: 256,
        timeout: cdk.Duration.seconds(30),
        tracing: lambda.Tracing.ACTIVE,
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
        logRetention: logs.RetentionDays.THREE_MONTHS,
      }
    );
    this.goodNightFunction = new node_lambda.NodejsFunction(
      this,
      'goodNightFunction',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '../../src/lambda/good-night/index.ts'),
        // handler: "getItem",
        memorySize: 256,
        timeout: cdk.Duration.seconds(30),
        tracing: lambda.Tracing.ACTIVE,
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
        logRetention: logs.RetentionDays.THREE_MONTHS,
      }
    );
  }
}
