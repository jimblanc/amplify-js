// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PinpointUserProfile } from '@aws-amplify/core/internals/providers/pinpoint';
import { IdentifyUserParameters, RecordParameters } from '../../../types';

export type PinpointIdentifyUserParameters =
	IdentifyUserParameters<PinpointUserProfile>;

export type PinpointRecordParameters = RecordParameters;
