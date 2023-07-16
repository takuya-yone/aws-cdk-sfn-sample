import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as logs from 'aws-cdk-lib/aws-logs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_lambda_nodejs as node_lambda } from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as path from 'path';
import { LambdaConstruct } from './lambda-construct';

export interface SfnConstructProps extends cdk.StackProps {
  goodMorningFunction: lambda.IFunction;
  goodEveningFunction: lambda.IFunction;
  goodNightFunction: lambda.IFunction;
}

export class SfnConstruct extends Construct {
  public readonly AwsCdkSampleSfn: sfn.StateMachine;
  constructor(scope: Construct, id: string, props: SfnConstructProps) {
    super(scope, id);

    const duration = cdk.Duration.minutes(1);
    const wait = new sfn.Wait(this, 'Wait 1min', {
      time: sfn.WaitTime.duration(duration),
    });

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
        lambdaFunction: props.goodMorningFunction,
        payload: sfn.TaskInput.fromJsonPathAt('$'),
        payloadResponseOnly: false, //未指定なら既定でfalseとなる
      }
    );

    const goodEveningFunctionTask = new tasks.LambdaInvoke(
      this,
      'goodEveningFunctionTask',
      {
        lambdaFunction: props.goodEveningFunction,
        payload: sfn.TaskInput.fromJsonPathAt('$'),
        payloadResponseOnly: false, //未指定なら既定でfalseとなる
      }
    );

    const goodNightFunctionTask = new tasks.LambdaInvoke(
      this,
      'goodNightFunctionTask',
      {
        lambdaFunction: props.goodNightFunction,
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
