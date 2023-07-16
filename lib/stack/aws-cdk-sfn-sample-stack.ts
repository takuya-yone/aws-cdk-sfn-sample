import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as logs from 'aws-cdk-lib/aws-logs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_lambda_nodejs as node_lambda } from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as path from 'path';
import { LambdaConstruct } from '../construct/lambda-construct';
import { SfnConstruct } from '../construct/sfn-construct';

export class AwsCdkSfnSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const lambda_construct = new LambdaConstruct(this, 'LambdaConstruct', {});
    const sfn_construct = new SfnConstruct(this, 'SfnConstruct', {
      goodMorningFunction: lambda_construct.goodMorningFunction,
      goodEveningFunction: lambda_construct.goodEveningFunction,
      goodNightFunction: lambda_construct.goodNightFunction,
    });
  }
}
