import log from 'loglevel';
const logger = log.getLogger('default');

export async function submitGetRequest({ PIPELINE_POST_API, authenticatedEthosFetch, urlSearchParameters }) {
	logger.setLevel('debug');
	const resource = PIPELINE_POST_API;
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

export async function submitPostRequest({ PIPELINE_POST_API, authenticatedEthosFetch, urlSearchParameters, request }) {
	logger.setLevel('debug');
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

export async function submitPutRequest({ PIPELINE_PUT_API, authenticatedEthosFetch, urlSearchParameters, request }) {
	logger.setLevel('debug');
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


export async function submitDeleteRequest({ PIPELINE_DELETE_API, authenticatedEthosFetch, urlSearchParameters, request }) {
	logger.setLevel('debug');
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

