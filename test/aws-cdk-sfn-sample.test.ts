import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AwsCdkSfnSampleStack } from '../lib/stack/aws-cdk-sfn-sample-stack';

test('Unit Test', () => {
  const app = new cdk.App();
  const stack = new AwsCdkSfnSampleStack(app, 'AwsCdkSfnSampleStack', {});
  // Snapshot Test
  expect(Template.fromStack(stack)).toMatchSnapshot();

  // Fine-grained assertions
  const template = Template.fromStack(stack);
});
