// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AuthError } from '../../../src/errors/AuthError';
import { deleteUserAttributes } from '../../../src/providers/cognito';
import { DeleteUserAttributesException } from '../../../src/providers/cognito/types/errors';
import * as deleteUserAttributesClient from '../../../src/providers/cognito/utils/clients/CognitoIdentityProvider';
import { Amplify } from 'aws-amplify';
import { decodeJWT } from '@aws-amplify/core/internals/utils';
import * as authUtils from '../../../src';
import { fetchTransferHandler } from '@aws-amplify/core/internals/aws-client-utils';
import { buildMockErrorResponse, mockJsonResponse } from './testUtils/data';
jest.mock('@aws-amplify/core/dist/cjs/clients/handlers/fetch');

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolClientId: '111111-aaaaa-42d8-891d-ee81a1549398',
			userPoolId: 'us-west-2_zzzzz',
			identityPoolId: 'us-west-2:xxxxxx',
		},
	},
});
const mockedAccessToken =
	'test_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('deleteUserAttributes API happy path cases', () => {
	let fetchAuthSessionsSpy;
	let deleteUserAttributesClientSpy;
	beforeEach(() => {
		fetchAuthSessionsSpy = jest
			.spyOn(authUtils, 'fetchAuthSession')
			.mockImplementationOnce(
				async (): Promise<{ tokens: { accessToken: any } }> => {
					return {
						tokens: {
							accessToken: decodeJWT(mockedAccessToken),
						},
					};
				}
			);
		deleteUserAttributesClientSpy = jest
			.spyOn(deleteUserAttributesClient, 'deleteUserAttributes')
			.mockImplementation(async () => {
				return {
					$metadata: {},
				};
			});
	});

	afterEach(() => {
		fetchAuthSessionsSpy.mockClear();
		deleteUserAttributesClientSpy.mockClear();
	});

	afterAll(() => {
		fetchAuthSessionsSpy.mockRestore();
		deleteUserAttributesClientSpy.mockRestore();
	});

	it('Should delete user attributes', async () => {
		expect.assertions(2);
		await deleteUserAttributes({
			userAttributeKeys: ['given_name', 'address'],
		});
		expect(deleteUserAttributesClientSpy).toHaveBeenCalledWith(
			expect.objectContaining({ region: 'us-west-2' }),
			expect.objectContaining({
				AccessToken: mockedAccessToken,
				UserAttributeNames: ['given_name', 'address'],
			})
		);
		expect(deleteUserAttributesClientSpy).toBeCalledTimes(1);
	});
});

describe('deleteUserAttributes API error path cases', () => {
	it('should raise service error', async () => {
		expect.assertions(2);
		jest
			.spyOn(authUtils, 'fetchAuthSession')
			.mockImplementationOnce(
				async (): Promise<{ tokens: { accessToken: any } }> => {
					return {
						tokens: {
							accessToken: decodeJWT(mockedAccessToken),
						},
					};
				}
			);
		(fetchTransferHandler as jest.Mock).mockResolvedValue(
			mockJsonResponse(
				buildMockErrorResponse(
					DeleteUserAttributesException.InvalidParameterException
				)
			)
		);
		try {
			await deleteUserAttributes({
				userAttributeKeys: ['address', 'given_name'],
			});
		} catch (error) {
			expect(error).toBeInstanceOf(AuthError);
			expect(error.name).toBe(
				DeleteUserAttributesException.InvalidParameterException
			);
		}
	});
});
