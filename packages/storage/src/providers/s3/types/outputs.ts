// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
	StorageDownloadDataOutput,
	StorageGetUrlOutput,
	StorageItem,
	StorageListOutput,
	DownloadTask,
	UploadTask,
	StorageItemKey,
	StorageItemPath,
} from '../../../types';

/**
 * type for S3 item.
 */
export interface Item extends StorageItemKey {
	/**
	 * VersionId used to reference a specific version of the object.
	 */
	versionId?: string;
	/**
	 * A standard MIME type describing the format of the object data.
	 */
	contentType?: string;
}

export interface ItemPath extends StorageItemPath {
	/**
	 * VersionId used to reference a specific version of the object.
	 */
	versionId?: string;
	/**
	 * A standard MIME type describing the format of the object data.
	 */
	contentType?: string;
}

export interface ItemPath extends StorageItemPath {
	/**
	 * VersionId used to reference a specific version of the object.
	 */
	versionId?: string;
	/**
	 * A standard MIME type describing the format of the object data.
	 */
	contentType?: string;
}

/**
 * type for S3 list item.
 */
export type ListOutputItem = Omit<Item, 'metadata'>;

/**
 * Output type for S3 downloadData API.
 */
export type DownloadDataOutputKey = DownloadTask<StorageDownloadDataOutput<Item>>;
export type DownloadDataOutputPath = DownloadTask<StorageDownloadDataOutput<ItemPath>>;
export type DownloadDataOutput = DownloadDataOutputKey | DownloadDataOutputPath

/**
 * Output type for S3 getUrl API.
 */
export type GetUrlOutput = StorageGetUrlOutput;

/**
 * Output type for S3 uploadData API.
 */
export type UploadDataOutput = UploadTask<Item>;

/**
 * Output type for S3 getProperties API.
 */
export type GetPropertiesOutput = Item;

/**
 * Output type for S3 list API. Lists all bucket objects.
 */
export type ListAllOutput = StorageListOutput<ListOutputItem>;

/**
 * Output type for S3 list API. Lists bucket objects with pagination.
 */
export type ListPaginateOutput = StorageListOutput<ListOutputItem> & {
	nextToken?: string;
};

/**
 * Output type for S3 copy API.
 */
export type CopyOutput = Pick<Item, 'key'>;

/**
 * Output type for S3 remove API.
 */
export type RemoveOutput = Pick<Item, 'key'>;
