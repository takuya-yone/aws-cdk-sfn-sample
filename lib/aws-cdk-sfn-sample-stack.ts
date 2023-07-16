import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as logs from 'aws-cdk-lib/aws-logs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_lambda_nodejs as node_lambda } from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as path from 'path';

export class AwsCdkSfnSampleStack extends cdk.Stack {
  public readonly AwsCdkSampleSfn: sfn.StateMachine;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const duration = cdk.Duration.minutes(1);
    const wait = new sfn.Wait(this, 'Wait 1min', {
      time: sfn.WaitTime.duration(duration),
    });

    const goodMorningFunction = new node_lambda.NodejsFunction(
      this,
      'goodMorningFunction',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '../src/lambda/good-morning/index.ts'),
        // handler: "getItem",
        memorySize: 256,
        timeout: cdk.Duration.seconds(30),
        tracing: lambda.Tracing.ACTIVE,
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
        logRetention: logs.RetentionDays.THREE_MONTHS,
      }
    );
    const goodEveningFunction = new node_lambda.NodejsFunction(
      this,
      'goodEveningFunction',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '../src/lambda/good-evening/index.ts'),
        // handler: "getItem",
        memorySize: 256,
        timeout: cdk.Duration.seconds(30),
        tracing: lambda.Tracing.ACTIVE,
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
        logRetention: logs.RetentionDays.THREE_MONTHS,
      }
    );
    const goodNightFunction = new node_lambda.NodejsFunction(
      this,
      'goodNightFunction',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '../src/lambda/good-night/index.ts'),
        // handler: "getItem",
        memorySize: 256,
        timeout: cdk.Duration.seconds(30),
        tracing: lambda.Tracing.ACTIVE,
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
        logRetention: logs.RetentionDays.THREE_MONTHS,
      }
    );

    const AwsCdkSampleSfnLogGroup = new logs.LogGroup(
      this,
      'AwsCdkSampleSfnLogGroup',
      {
        retention: logs.RetentionDays.ONE_YEAR,
      }
    );

    const goodMorningFunctionTask = new tasks.LambdaInvoke(
      this,
      'goodMorningFunctionTask',
      {
        lambdaFunction: goodMorningFunction,
        payload: sfn.TaskInput.fromJsonPathAt('$'),
        payloadResponseOnly: false, //未指定なら既定でfalseとなる
      }
    );

    const goodEveningFunctionTask = new tasks.LambdaInvoke(
      this,
      'goodEveningFunctionTask',
      {
        lambdaFunction: goodEveningFunction,
        payload: sfn.TaskInput.fromJsonPathAt('$'),
        payloadResponseOnly: false, //未指定なら既定でfalseとなる
      }
    );

    const goodNightFunctionTask = new tasks.LambdaInvoke(
      this,
      'goodNightFunctionTask',
      {
        lambdaFunction: goodNightFunction,
        payload: sfn.TaskInput.fromJsonPathAt('$'),
        payloadResponseOnly: false, //未指定なら既定でfalseとなる
      }
    );

    this.AwsCdkSampleSfn = new sfn.StateMachine(this, 'AwsCdkSampleSfn', {
      definitionBody: sfn.DefinitionBody.fromChainable(
        wait
          .next(goodMorningFunctionTask)
          .next(goodEveningFunctionTask)
          .next(goodNightFunctionTask)
      ),
      stateMachineName: 'AwsCdkSampleSfn',
      tracingEnabled: true,
      logs: {
        destination: AwsCdkSampleSfnLogGroup,
        level: sfn.LogLevel.ALL,
      },
    });
  }
}
