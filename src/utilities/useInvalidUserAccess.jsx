import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCardInfo, useUserInfo, useData } from '@ellucian/experience-extension-utils';

import { submitGetRequest } from '../data/apiCalls';

export function useInvalidUserAccess(pageName) {
	const { cardId, cardConfiguration: { PIPELINE_GET_SDK_SECURITY } = {}, serverConfigContext: { cardPrefix } } = useCardInfo();
	const packageName = cardId.split('|')[2] ?? '';
	const { authenticatedEthosFetch } = useData();
	const userRoles = useUserInfo().roles;

	const [state, setState] = useState({ accessIsLoading: true, accessIsInvalid: true, accessError: null });

	const urlSearchParameters = new URLSearchParams({
		cardId,
		cardPrefix,
		packageName,
		pageName
	}).toString();

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				const result = await submitGetRequest({
					PIPELINE_GET_API: PIPELINE_GET_SDK_SECURITY,
					authenticatedEthosFetch,
					urlSearchParameters
				});

				if (cancelled) return;

				if (result.status === 'success' && Array.isArray(result.data)) {
					// Normalize authorized role codes (supporting multiple shapes)
					const authorized = result.data
						.map(r => r.xsdkroleRole ?? r.roleCode ?? r) // string fallback
						.filter(Boolean);

					// Policy: if no ACL is configured (authorized.length === 0), treat as invalid (block).
					const hasRequiredRole =
						authorized.length > 0 && userRoles?.some(code => authorized.includes(code));

					setState({
						accessIsLoading: false,
						accessIsInvalid: authorized.length === 0 ? true : !hasRequiredRole,
						accessError: null
					});
				} else {
					setState({ accessIsLoading: false, accessIsInvalid: true, accessError: result.error ?? new Error('Fetch failed') });
				}
			} catch (err) {
				if (!cancelled) setState({ accessIsLoading: false, accessIsInvalid: true, accessError: err });
			}
		})();

		return () => { cancelled = true; };
	}, [PIPELINE_GET_SDK_SECURITY, authenticatedEthosFetch, cardId, cardPrefix, urlSearchParameters, userRoles]);

	return state; // { accessIsLoading, accessIsInvalid, accessError }
}