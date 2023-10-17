// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { loadAppState } from '@aws-amplify/react-native';
import { isBrowser } from '../isBrowser';
import {
	SessionStateChangeListener,
	SessionState,
	SessionListenerInterface,
} from './types';

const stateChangeListeners = new Set<SessionStateChangeListener>();
const isActive = (appState?: string) => appState === 'active';
const isInactive = (appState?: string) =>
	appState === 'inactive' || appState === 'background';

export class SessionListenerClass implements SessionListenerInterface {
	private currentAppState?: string;

	constructor() {
		this.handleStateChange = this.handleStateChange.bind(this);

		// Setup state listeners
		loadAppState().addEventListener('change', this.handleStateChange, false);
	}

	public addStateChangeListener(
		listener: SessionStateChangeListener,
		notifyOnAdd: boolean = false
	) {
		stateChangeListeners.add(listener);

		// Notify new handlers of the current state on add if the current state has been determined
		if (notifyOnAdd && this.currentAppState !== undefined) {
			listener(this.getSessionState());
		}
	}

	public removeStateChangeHandler(handler: SessionStateChangeListener) {
		stateChangeListeners.delete(handler);
	}

	private handleStateChange(nextAppState: string) {
		if (
			(this.currentAppState === undefined ||
				isInactive(this.currentAppState)) &&
			isActive(nextAppState)
		) {
			this.notifyHandlers('started');
		} else if (isActive(this.currentAppState) && isInactive(nextAppState)) {
			this.notifyHandlers('ended');
		}

		this.currentAppState = nextAppState;
	}

	private notifyHandlers(state: SessionState) {
		stateChangeListeners.forEach(listener => {
			listener(state);
		});
	}

	private getSessionState = (): SessionState => {
		if (isActive(this.currentAppState)) {
			return 'started';
		}

		// Consider any other app state as ended
		return 'ended';
	};
}