// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { v4 as uuidv4 } from 'uuid';
import { Cache } from '../../..';
import { SupportedCategory } from '../types';
import { getCacheKey } from './helpers';

/**
 * Returns an endpoint id from cache or create a new one if not found.
 *
 * @internal
 */
export const getEndpointId = async (
	appId: string,
	category: SupportedCategory,
	createIfNotFound = true
): Promise<string | undefined> => {
	const cacheKey = getCacheKey(appId, category);
	// First, attempt to retrieve the ID from cache
	const cachedEndpointId = await Cache.getItem(cacheKey);
	// Found in cache, just return it
	if (cachedEndpointId) {
		return cachedEndpointId;
	}

	if (createIfNotFound) {
		// Otherwise, generate a new ID and store it in long-lived cache before returning it
		const endpointId = uuidv4();
		// Set a longer TTL to avoid endpoint id being deleted after the default TTL (3 days)
		// Also set its priority to the highest to reduce its chance of being deleted when cache is full
		const ttl = 1000 * 60 * 60 * 24 * 365 * 100; // 100 years
		const expiration = new Date().getTime() + ttl;
		Cache.setItem(cacheKey, endpointId, {
			expires: expiration,
			priority: 1,
		});
		return endpointId;
	}

	return undefined;
};
