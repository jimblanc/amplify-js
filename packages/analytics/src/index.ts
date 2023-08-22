// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// TODO(v6) Remove once all default provider functional APIs available
export { Analytics } from './Analytics';
export { AnalyticsProvider } from './types';
export { AWSPinpointProvider } from './providers';

// TODO(v6) Refactor as additional Analytics providers come online
/*
export {
	AWSKinesisProvider,
	AWSKinesisFirehoseProvider,
	AmazonPersonalizeProvider,
} from './providers';
*/

// Default provider APIs
export * from './apis';
