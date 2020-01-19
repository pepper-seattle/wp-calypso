/**
 * External dependencies
 */
import { Action } from 'redux';

/**
 * Internal dependencies
 */
import * as Actions from './actions';
import { ActionsDefinedInModule } from '../mapped-types';

export const enum ActionType {
	CREATE_ACCOUNT = 'CREATE_ACCOUNT',
	RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER',
	RECEIVE_CURRENT_USER_FAILED = 'RECEIVE_CURRENT_USER_FAILED',
	RECEIVE_NEW_USER = 'RECEIVE_NEW_USER',
	RECEIVE_NEW_USER_FAILED = 'RECEIVE_NEW_USER_FAILED',
}

export type UserAction = ActionsDefinedInModule< typeof Actions >;

export interface CurrentUser {
	ID: number;
	display_name: string;
	username: string;
}

export interface NewUser {
	userId: string | number | undefined;
	username: string | undefined;
	bearerToken: string | null | undefined;
}

export interface NewUserResponse {
	success: boolean;
	is_signup_sandbox: boolean;
	username?: string;
	signup_sandbox_username?: string;
	user_id?: number;
	signup_sandbox_user_id?: string;
	bearer_token?: string | null;
}

export interface CreateAccountParams {
	email: string;
}

export interface CreateAccountAction extends Action {
	params?: CreateAccountParams;
}
