// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
	StorageOptions,
	StorageListAllOptions,
	StorageListPaginateOptions,
} from './options';

export type StorageOperationInputKey = { key: string };
export type StorageOperationInputPath = {
	path:
		| string
		| (({
				identityId
		  }: {
				identityId?: string;
		  }) => string);
};
export type StorageOperationOptions<Options> = { options?: Options };

/** Download Data Input types */
export type StorageDownloadDataInputKey<Options extends StorageOptions> =
	StorageOperationInputKey & StorageOperationOptions<Options>;

export type StorageDownloadDataInputPath<Options> = StorageOperationInputPath &
	StorageOperationOptions<Options>;

// TODO: This needs to be removed after refactor of all storage APIs
export type StorageOperationInput<Options extends StorageOptions> = {
	key: string;
	options?: Options;
};

export type StorageGetPropertiesInput<Options extends StorageOptions> =
	StorageOperationInput<Options>;

export type StorageRemoveInput<Options extends StorageOptions> = {
	key: string;
	options?: Options;
};

export type StorageListInput<
	Options extends StorageListAllOptions | StorageListPaginateOptions,
> = {
	prefix?: string;
	options?: Options;
};

export type StorageGetUrlInput<Options extends StorageOptions> =
	StorageOperationInput<Options>;

export type StorageUploadDataInput<Options extends StorageOptions> =
	StorageOperationInput<Options> & {
		data: StorageUploadDataPayload;
	};

export type StorageCopyInput<
	SourceOptions extends StorageOptions,
	DestinationOptions extends StorageOptions,
> = {
	source: SourceOptions;
	destination: DestinationOptions;
};

/**
 * The data payload type for upload operation.
 */
export type StorageUploadDataPayload =
	| Blob
	| ArrayBufferView
	| ArrayBuffer
	| string;
