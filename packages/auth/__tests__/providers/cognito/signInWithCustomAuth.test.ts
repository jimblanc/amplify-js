// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Amplify, AmplifyErrorString } from '@aws-amplify/core';
import { InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { AuthError } from '../../../src/errors/AuthError';
import { AuthValidationErrorCode } from '../../../src/errors/types/validation';
import { authAPITestParams } from './testUtils/authApiTestParams';
import { signIn } from '../../../src/providers/cognito/apis/signIn';
import { signInWithCustomAuth } from '../../../src/providers/cognito/apis/signInWithCustomAuth';
import { InitiateAuthException } from '../../../src/providers/cognito/types/errors/service';
import * as initiateAuthHelpers from '../../../src/providers/cognito/utils/signInHelpers';

Amplify.configure({
	aws_cognito_region: 'us-west-2',
	aws_user_pools_web_client_id: '4a93aeb3-01af-42d8-891d-ee8aa1549398',
	aws_user_pools_id: 'us-west-2_80ede80b',
});

describe('signIn API happy path cases', () => {
	let handleCustomAuthFlowWithoutSRPSpy;

	beforeEach(() => {
		handleCustomAuthFlowWithoutSRPSpy = jest
			.spyOn(initiateAuthHelpers, 'handleCustomAuthFlowWithoutSRP')
			.mockImplementationOnce(
				async (): Promise<InitiateAuthCommandOutput> =>
					authAPITestParams.CustomChallengeResponse
			);
	});

	afterEach(() => {
		handleCustomAuthFlowWithoutSRPSpy.mockClear();
	});

	test('signIn API invoked with authFlowType should return a SignInResult', async () => {
		const result = await signIn({
			username: authAPITestParams.user1.username,
			options: {
				serviceOptions: {
					authFlowType: 'CUSTOM_WITHOUT_SRP',
				},
			},
		});
		expect(result).toEqual(authAPITestParams.signInResultWithCustomAuth());
		expect(handleCustomAuthFlowWithoutSRPSpy).toBeCalledTimes(1);
	});

	test('signInWithCustomAuth API should return a SignInResult', async () => {
		const result = await signInWithCustomAuth({
			username: authAPITestParams.user1.username,
		});
		expect(result).toEqual(authAPITestParams.signInResultWithCustomAuth());
		expect(handleCustomAuthFlowWithoutSRPSpy).toBeCalledTimes(1);
	});
	test('handleCustomAuthFlowWithoutSRP should be called with clientMetada from request', async () => {
		const username = authAPITestParams.user1.username;
		await signInWithCustomAuth({
			username,
			options: {
				serviceOptions: authAPITestParams.configWithClientMetadata,
			},
		});
		expect(handleCustomAuthFlowWithoutSRPSpy).toBeCalledWith(
			username,
			authAPITestParams.configWithClientMetadata.clientMetadata
		);
	});

	test('handleCustomAuthFlowWithoutSRP should be called with clientMetada from config', async () => {
		Amplify.configure(authAPITestParams.configWithClientMetadata);
		const username = authAPITestParams.user1.username;
		await signInWithCustomAuth({
			username,
		});
		expect(handleCustomAuthFlowWithoutSRPSpy).toBeCalledWith(
			username,
			authAPITestParams.configWithClientMetadata.clientMetadata
		);
	});
});

describe('signIn API error path cases:', () => {
	const globalMock = global as any;

	test('signIn API should throw a validation AuthError when username is empty', async () => {
		expect.assertions(2);
		try {
			await signIn({
				username: '',
				options: {
					serviceOptions: {
						authFlowType: 'CUSTOM_WITHOUT_SRP',
					},
				},
			});
		} catch (error) {
			expect(error).toBeInstanceOf(AuthError);
			expect(error.name).toBe(AuthValidationErrorCode.EmptySignInUsername);
		}
	});

	test('signIn API should throw a validation AuthError when password is not empty and when authFlow is CUSTOM_WITHOUT_SRP', async () => {
		expect.assertions(2);
		try {
			await signIn({
				username: authAPITestParams.user1.username,
				password: authAPITestParams.user1.password,
				options: {
					serviceOptions: {
						authFlowType: 'CUSTOM_WITHOUT_SRP',
					},
				},
			});
		} catch (error) {
			expect(error).toBeInstanceOf(AuthError);
			expect(error.name).toBe(AuthValidationErrorCode.CustomAuthSignInPassword);
		}
	});

	test('signIn API should raise service error', async () => {
		const serviceError = new Error('service error');
		serviceError.name = InitiateAuthException.InvalidParameterException;
		globalMock.fetch = jest.fn(() => Promise.reject(serviceError));
		expect.assertions(3);
		try {
			await signIn({
				username: authAPITestParams.user1.username,
				options: {
					serviceOptions: {
						authFlowType: 'CUSTOM_WITHOUT_SRP',
					},
				},
			});
		} catch (error) {
			expect(fetch).toBeCalled();
			expect(error).toBeInstanceOf(AuthError);
			expect(error.name).toBe(InitiateAuthException.InvalidParameterException);
		}
	});

	test(`signIn API should raise an unknown error when underlying error is' 
			not coming from the service`, async () => {
		expect.assertions(3);
		globalMock.fetch = jest.fn(() =>
			Promise.reject(new Error('unknown error'))
		);
		try {
			await signIn({
				username: authAPITestParams.user1.username,
				options: {
					serviceOptions: {
						authFlowType: 'CUSTOM_WITHOUT_SRP',
					},
				},
			});
		} catch (error) {
			expect(error).toBeInstanceOf(AuthError);
			expect(error.name).toBe(AmplifyErrorString.UNKNOWN);
			expect(error.underlyingError).toBeInstanceOf(Error);
		}
	});

	test('signIn API should raise an unknown error when the underlying error is null', async () => {
		expect.assertions(3);
		globalMock.fetch = jest.fn(() => Promise.reject(null));
		try {
			await signIn({
				username: authAPITestParams.user1.username,
				options: {
					serviceOptions: {
						authFlowType: 'CUSTOM_WITHOUT_SRP',
					},
				},
			});
		} catch (error) {
			expect(error).toBeInstanceOf(AuthError);
			expect(error.name).toBe(AmplifyErrorString.UNKNOWN);
			expect(error.underlyingError).toBe(null);
		}
	});
});