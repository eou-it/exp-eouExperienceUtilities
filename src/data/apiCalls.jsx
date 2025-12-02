import { useEffect, useState, useCallback, useRef } from 'react';
import { useData } from '@ellucian/experience-extension-utils';
import log from 'loglevel';
const logger = log.getLogger('default');

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function submitGetRequest--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export async function submitGetRequest({ PIPELINE_GET_API, authenticatedEthosFetch, urlSearchParameters }) {
	const resource = PIPELINE_GET_API;
	try {
		const start = new Date();

		const resourcePath = `${resource}?${urlSearchParameters}`;

		const response = await authenticatedEthosFetch(resourcePath, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		const end = new Date();
		logger.debug(`get ${resource} time: ${end.getTime() - start.getTime()}`);

		let result;
		if (response) {
			switch (response.status) {
				case 200:
					try {
						const data = await response.json();

						result = {
							data,
							status: 'success'
						};
					} catch (error) {
						result = {
							error: {
								message: 'unable to parse response',
								statusCode: 500
							}
						};
					}
					break;
				default:
					result = {
						error: {
							message: 'server error',
							statusCode: response.status
						}
					};
			}
		}

		return result;
	} catch (error) {
		logger.error('unable to search for persons: ', error);
		throw error;
	}
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function useGetRequest--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export function useGetRequest({ PIPELINE_GET_API, urlSearchParameters, enabled = true }) { // set false to disable when key is empty
	const { authenticatedEthosFetch } = useData();
	const mounted = useRef(true);
	const [data, setData] = useState(undefined);
	const [dataError, setDataError] = useState(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const refreshTickRef = useRef(0);

	const doFetch = useCallback(async (isManualRefresh = false) => {
		if (!enabled) return;
		if (!PIPELINE_GET_API || !authenticatedEthosFetch) return;

		try {
			if (isManualRefresh) setIsRefreshing(true); else setIsLoading(true);

			const result = await submitGetRequest({
				PIPELINE_GET_API,
				authenticatedEthosFetch,
				urlSearchParameters
			});

			if (!mounted.current) return;

			if (result?.status === 'success') {
				setData(result.data);
				setDataError(undefined);
			} else {
				setData(undefined);
				setDataError(result?.error ?? { message: 'unknown error' });
			}
		} catch (err) {
			if (!mounted.current) return;
			setData(undefined);
			setDataError({ message: String(err?.message ?? err), statusCode: err?.statusCode });
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, [
		enabled,
		PIPELINE_GET_API,
		authenticatedEthosFetch,
		urlSearchParameters,
	]);

	// Auto fire on first mount & when inputs change
	useEffect(() => {
		mounted.current = true;
		doFetch(false);
		return () => { mounted.current = false; };
	}, [doFetch]);

	// Public manual refresh
	const refresh = useCallback(() => {
		refreshTickRef.current += 1;
		void doFetch(true);
	}, [doFetch]);

	return {
		data,
		dataError,
		isError: Boolean(dataError),
		isLoading,
		isRefreshing,
		refresh
	};
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function submitPostRequest--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export async function submitPostRequest({ PIPELINE_POST_API, authenticatedEthosFetch, urlSearchParameters, request }) {
	const resource = PIPELINE_POST_API;
	try {
		const start = new Date();

		const resourcePath = `${resource}?${urlSearchParameters}`;

		const response = await authenticatedEthosFetch(resourcePath, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(request)
		});

		const end = new Date();
		logger.debug(`post ${resource} time: ${end.getTime() - start.getTime()}`);

		let result;
		if (response) {
			switch (response.status) {
				case 200:
					try {
						const data = await response.json();

						result = {
							data,
							status: 'success'
						};
					} catch (error) {
						result = {
							error: {
								message: 'unable to parse response',
								statusCode: 500
							}
						};
					}
					break;
				default:
					result = {
						error: {
							message: 'server error',
							statusCode: response.status
						}
					};
			}
		}

		return result;
	} catch (error) {
		logger.error('unable to search for persons: ', error);
		throw error;
	}
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function submitPutRequest--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export async function submitPutRequest({ PIPELINE_PUT_API, authenticatedEthosFetch, urlSearchParameters, request }) {
	const resource = PIPELINE_PUT_API;
	try {
		const start = new Date();

		const resourcePath = `${resource}?${urlSearchParameters}`;

		const response = await authenticatedEthosFetch(resourcePath, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(request)
		});

		const end = new Date();
		logger.debug(`put ${resource} time: ${end.getTime() - start.getTime()}`);

		let result;
		if (response) {
			switch (response.status) {
				case 200:
					try {
						const data = await response.json();

						result = {
							data,
							status: 'success'
						};
					} catch (error) {
						result = {
							error: {
								message: 'unable to parse response',
								statusCode: 500
							}
						};
					}
					break;
				default:
					result = {
						error: {
							message: 'server error',
							statusCode: response.status
						}
					};
			}
		}

		return result;
	} catch (error) {
		logger.error('unable to search for persons: ', error);
		throw error;
	}
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function submitDeleteRequest--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
export async function submitDeleteRequest({ PIPELINE_DELETE_API, authenticatedEthosFetch, urlSearchParameters, request }) {
	const resource = PIPELINE_DELETE_API;
	try {
		const start = new Date();

		const resourcePath = `${resource}?${urlSearchParameters}`;

		const response = await authenticatedEthosFetch(resourcePath, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(request)
		});

		const end = new Date();
		logger.debug(`delete ${resource} time: ${end.getTime() - start.getTime()}`);

		let result;
		if (response) {
			switch (response.status) {
				case 200:
					try {
						const data = await response.json();

						result = {
							data,
							status: 'success'
						};
					} catch (error) {
						result = {
							error: {
								message: 'unable to parse response',
								statusCode: 500
							}
						};
					}
					break;
				default:
					result = {
						error: {
							message: 'server error',
							statusCode: response.status
						}
					};
			}
		}

		return result;
	} catch (error) {
		logger.error('unable to search for persons: ', error);
		throw error;
	}
}

