// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AuthConfig, UserPoolConfig } from '@aws-amplify/core';

export function isTypeUserPoolConfig(
	authConfig?: AuthConfig
): authConfig is UserPoolConfig {
	if (authConfig && authConfig.userPoolId && authConfig.userPoolWebClientId) {
		return true;
	}

	return false;
}