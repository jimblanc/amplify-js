// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { UserProfile } from '@aws-amplify/core';
import { AnalyticsEvent } from './Analytics';

export type IdentifyUserParameters<T extends UserProfile = UserProfile> = {
	/**
	 * A User ID associated to the current user/endpoint
	 */
	userId: string;

	/**
	 * A User Profile containing information about the user device as well as custom attributes
	 */
	userProfile: T;
};

export type RecordParameters = {
	/**
	 * An event to send to the default Analytics provider.
	 */
	event: AnalyticsEvent;

	/**
	 * Flag that indicates the event should be transmitted immediately (i.e not buffered).
	 */
	sendImmediately?: boolean;
};
