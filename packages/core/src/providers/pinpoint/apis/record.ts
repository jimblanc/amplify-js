// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { v4 as uuid } from 'uuid';
import { PinpointRecordParameters, PinpointSession } from '../types';
import { 
	putEvents,
	PutEventsInput
} from '../../../AwsClients/Pinpoint';
import {
	hasEndpointId
} from '../utils/hasEndpointId';
import {
	getEndpointId
} from '../utils/getEndpointId';
import {
	identifyUser
} from './identifyUser';

// TODO(v6) Refactor when we add support for session tracking & `autoTrack`
let session: PinpointSession; 

/**
 * @internal
 */
export const record = async ({
	appId,
	category,
	credentials,
	event,
	identityId,
	region,
	sendImmediately,
	userAgentValue
}: PinpointRecordParameters): Promise<void> => {
	const timestampISOString = new Date().toISOString();
	const eventId = uuid();
	const endpointContext = {};
	let endpointId: string | undefined;

	// TODO Prepare event buffer if required

	// Generate endpoint if required
	if (!hasEndpointId(appId, category)) {
		console.log('+ Does not have endpoint ID', {
			appId,
			category,
			credentials,
			identityId,
			region,
			userAgentValue
		});

		await identifyUser({
			appId,
			category,
			credentials,
			identityId,
			region,
			userAgentValue
		})

		endpointId = await getEndpointId(appId, category, false);
		console.log('+ Fetched endpoint ID', endpointId);
	}

	if (!endpointId) {
		throw new Error('Endpoint was not created.');
	}

	// Generate session if required
	if (!session) {
		const sessionId = uuid();

		session = {
			Id: sessionId,
			StartTimestamp: timestampISOString
		};
	}

	if (sendImmediately) {
		// Immediately send the event to Pinpoint
		const input: PutEventsInput = {
			ApplicationId: appId,
			EventsRequest: {
				BatchItem: {
					[endpointId]: {
						Endpoint: endpointContext,
						Events: {
							[eventId]: {
								EventType: event.name,
								Timestamp: timestampISOString,
								Attributes: event.attributes,
								Metrics: event.metrics,
								Session: session,
							},
						},
					},
				},
			}
		};

		await putEvents({ credentials, region, userAgentValue }, input);
	} else {
		// TODO(v6) Append the event to the Pinpoint event buffer
	}
};
