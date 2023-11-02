// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { resendSignUpCode } from '../../../src/providers/cognito';
import { authAPITestParams } from './testUtils/authApiTestParams';
import { AuthValidationErrorCode } from '../../../src/errors/types/validation';
import { AuthError } from '../../../src/errors/AuthError';
import { ResendConfirmationException } from '../../../src/providers/cognito/types/errors';
import * as resendSignUpConfirmationCodeClient from '../../../src/providers/cognito/utils/clients/CognitoIdentityProvider';
import { ResendConfirmationCodeCommandOutput } from '../../../src/providers/cognito/utils/clients/CognitoIdentityProvider/types';
import { Amplify } from 'aws-amplify';
import { fetchTransferHandler } from '@aws-amplify/core/internals/aws-client-utils';
import { buildMockErrorResponse, mockJsonResponse } from './testUtils/data';
jest.mock('@aws-amplify/core/dist/cjs/clients/handlers/fetch');

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolClientId: '111111-aaaaa-42d8-891d-ee81a1549398',
			userPoolId: 'us-west-2_zzzzz',
		},
	},
});
describe('ResendSignUp API Happy Path Cases:', () => {
	let resendSignUpSpy;
	const { user1 } = authAPITestParams;
	beforeEach(() => {
		resendSignUpSpy = jest
			.spyOn(resendSignUpConfirmationCodeClient, 'resendConfirmationCode')
			.mockImplementationOnce(async () => {
				return authAPITestParams.resendSignUpClientResult as ResendConfirmationCodeCommandOutput;
			});
	});
	afterEach(() => {
		resendSignUpSpy.mockClear();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});
	test('ResendSignUp API should call the UserPoolClient and should return a ResendSignUpCodeResult', async () => {
		const result = await resendSignUpCode({
			username: user1.username,
		});
		expect(result).toEqual(authAPITestParams.resendSignUpAPIResult);
		expect(resendSignUpSpy).toHaveBeenCalledWith(
			{
				region: 'us-west-2',
				userAgentValue: expect.any(String),
			},
			{
				ClientMetadata: undefined,
				Username: user1.username,
				ClientId: '111111-aaaaa-42d8-891d-ee81a1549398',
			}
		);
		expect(resendSignUpSpy).toBeCalledTimes(1);
	});
});

describe('ResendSignUp API Error Path Cases:', () => {
	const { user1 } = authAPITestParams;
	afterAll(() => {
		jest.restoreAllMocks();
	});
	test('ResendSignUp API should throw a validation AuthError when username is empty', async () => {
		expect.assertions(2);
		try {
			await resendSignUpCode({ username: '' });
		} catch (error) {
			expect(error).toBeInstanceOf(AuthError);
			expect(error.name).toBe(AuthValidationErrorCode.EmptySignUpUsername);
		}
	});

	test('ResendSignUp API should expect a service error', async () => {
		expect.assertions(2);
		expect.assertions(2);
		(fetchTransferHandler as jest.Mock).mockResolvedValue(
			mockJsonResponse(
				buildMockErrorResponse(
					ResendConfirmationException.InvalidParameterException
				)
			)
		);
		try {
			await resendSignUpCode({ username: user1.username });
		} catch (error) {
			expect(error).toBeInstanceOf(AuthError);
			expect(error.name).toBe(
				ResendConfirmationException.InvalidParameterException
			);
		}
	});
});

describe('ResendSignUp API Edge Cases:', () => {});

describe('Cognito ASF', () => {
	let resendSignUpSpy;
	const { user1 } = authAPITestParams;
	beforeEach(() => {
		resendSignUpSpy = jest
			.spyOn(resendSignUpConfirmationCodeClient, 'resendConfirmationCode')
			.mockImplementationOnce(async () => {
				return authAPITestParams.resendSignUpClientResult as ResendConfirmationCodeCommandOutput;
			});

		// load Cognito ASF polyfill
		window['AmazonCognitoAdvancedSecurityData'] = {
			getData() {
				return 'abcd';
			},
		};
	});

	afterEach(() => {
		resendSignUpSpy.mockClear();
		window['AmazonCognitoAdvancedSecurityData'] = undefined;
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});
	test('ResendSignUp API should send UserContextData', async () => {
		const result = await resendSignUpCode({
			username: user1.username,
		});
		expect(result).toEqual(authAPITestParams.resendSignUpAPIResult);
		expect(resendSignUpSpy).toHaveBeenCalledWith(
			{
				region: 'us-west-2',
				userAgentValue: expect.any(String),
			},
			{
				ClientMetadata: undefined,
				Username: user1.username,
				ClientId: '111111-aaaaa-42d8-891d-ee81a1549398',
				UserContextData: { EncodedData: 'abcd' },
			}
		);
		expect(resendSignUpSpy).toBeCalledTimes(1);
	});
});
