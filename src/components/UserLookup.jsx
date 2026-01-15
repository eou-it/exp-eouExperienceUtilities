import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, TextField, Typography, makeStyles, Grid } from '@ellucian/react-design-system/core';
import { spacing20 } from '@ellucian/react-design-system/core/styles/tokens';

import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

const useStyles = makeStyles(() => ({
	userLookupSearch: {
		marginRight: spacing20,
		width: '100%'
	},
	userLookupResultDiv: {
		display: "flex",
		padding: spacing20,
		minHeight: '3rem',
		width: '100%',
		alignItems: "center"
	}
}), { index: 2 });

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function submitGetRequest--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
async function submitGetRequest({ PIPELINE_GET_API, authenticatedEthosFetch, cardId, cardPrefix, userSearchKey, signal }) {
	const resource = PIPELINE_GET_API;

	const urlSearchParameters = new URLSearchParams({
		cardId,
		cardPrefix,
		userSearchKey
	}).toString();

	const resourcePath = `${resource}?${urlSearchParameters}`;

	try {
		const response = await authenticatedEthosFetch(resourcePath, {
			method: 'GET',
			signal, // <- 🛑 support for cancellation
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		if (response.status === 200) {
			const data = await response.json();
			return { data, status: 'success' };
		} else {
			return { error: { message: 'server error', statusCode: response.status } };
		}
	} catch (error) {
		if (error.name === 'AbortError') {
			return { aborted: true };
		}
		return { error: { message: 'fetch failed', statusCode: 500 } };
	}
}

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function DisplayUserResult--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
function DisplayUserResult({ userArray, busy, userSearchKey }) {
	if (busy) {
		return (<CircularProgress size='2rem' />);
	} else if (!userSearchKey || userSearchKey.length < 4) {
		return null;
	} else if (userArray && Array.isArray(userArray)) {
		if (userArray.length === 1) {
			const user = userArray[0];
			return (<Typography variant="body1">{user.userfirstname} {user.userlastname}</Typography>);
		} else {
			return null;
		}
	} else {
		return null;
	}
}

DisplayUserResult.propTypes = {
	userArray: PropTypes.array,
	busy: PropTypes.bool,
	userSearchKey: PropTypes.string
};

/* *****************************************************************************************************************************************************************************/
/*------------------------------------------------------------------ function UserLookup--------------------------------------------------------------------------------*/
/* *****************************************************************************************************************************************************************************/
const UserLookup = forwardRef(function UserLookup(
	{ initialSearchValue, userGuid, setUserId, setUserFirstName, setUserLastName, label, onCleared, required, id },
	ref
) {
	const classes = useStyles();

	const { configuration, cardConfiguration } = useCardInfo() ?? {};
	const config = configuration || cardConfiguration || {};

	const isCard = (configuration) ? true : false;

	const {
		PIPELINE_GET_USER_MAP
	} = config;

	const { authenticatedEthosFetch } = useData();
	const { serverConfigContext: { cardPrefix }, cardId } = useCardInfo();

	const [busy, setBusy] = useState(false);
	const [busyUntilRefresh, setBusyUntilRefresh] = useState(false);

	useEffect(() => {
		if (busy && !busyUntilRefresh) {
			setBusy(false);
		}
	}, [busy, busyUntilRefresh]);

	const [search, setSearch] = useState(initialSearchValue || '');
	const [userArray, setUserArray] = useState([]);
	const userSearchKey = search.toLowerCase().trim().replace(/@eou\.edu/i, '');
	const lastEmitted = useRef({ guid: undefined, id: undefined, first: undefined, last: undefined });

	useImperativeHandle(ref, () => ({
		clear: () => {
			setSearch('');
			setUserArray([]);
			// ensure parent mirrors cleared state
			if (userGuid) {
				setUserId(userGuid, '');
				setUserFirstName(userGuid, '');
				setUserLastName(userGuid, '');
			} else {
				setUserId('');
				setUserFirstName('');
				setUserLastName('');
			}
			if (typeof onCleared === 'function') onCleared();
		},
		setSearchValue: (value) => {
			setSearch(value ?? '');
		}
	}), [setUserFirstName, setUserId, setUserLastName, userGuid, onCleared]);

	const emitToParentIfChanged = useCallback((guid, id, first, last) => {
		const prev = lastEmitted.current;
		// if nothing changed, do nothing
		if (prev.guid === guid && prev.id === id && prev.first === first && prev.last === last) return;
		lastEmitted.current = { guid, id, first, last };
		if (guid) {
			setUserId(guid, id);
			setUserFirstName(guid, first);
			setUserLastName(guid, last);
		} else {
			setUserId(id);
			setUserFirstName(first);
			setUserLastName(last);
		}
	}, [setUserId, setUserFirstName, setUserLastName]);

	function handleUserSearchChange(searchValue) {
		//clear all previous values
		setUserArray([]);
		if (userGuid) {
			setUserId(userGuid, '');
			setUserFirstName(userGuid, '');
			setUserLastName(userGuid, '');
		} else {
			setUserId('');
			setUserFirstName('');
			setUserLastName('');
		}
		//set the new value so it triggers the search
		setSearch(searchValue);
	}

	useEffect(() => {
		if (userSearchKey.length < 4) return;

		const controller = new AbortController();

		const getData = async () => {
			setBusyUntilRefresh(true);
			setBusy(true);
			const result = await submitGetRequest({
				PIPELINE_GET_API: PIPELINE_GET_USER_MAP,
				authenticatedEthosFetch,
				cardId,
				cardPrefix,
				userSearchKey,
				signal: controller.signal
			});

			if (!result.aborted) {
				if (result.status === 'success') {
					setUserArray(result.data);
				} else {
					console.error('Fetch failed or server error');
				}
				setBusyUntilRefresh(false);
			}
		};

		getData();

		return () => {
			controller.abort(); // 🛑 cancel previous fetch on next run
		};
	}, [PIPELINE_GET_USER_MAP, authenticatedEthosFetch, cardId, cardPrefix, setBusy, setBusyUntilRefresh, userSearchKey]); // will trigger when search changes

	useEffect(() => {
		const user = userArray.length === 1 ? userArray[0] : null;
		const id = user ? user.userid : '';
		const first = user ? user.userfirstname : '';
		const last = user ? user.userlastname : '';
		emitToParentIfChanged(userGuid, id, first, last);
	}, [userArray, userGuid, emitToParentIfChanged]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} lg={isCard ? 12 : 5}>
				<TextField
					inputProps={{ 'aria-label': 'Search for a user' }}
					id={`userSearch${userGuid}${id}`}
					name={`userSearch${userGuid}${id}`}
					label={label || ''}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="mmonty or 910000000"
					value={search}
					className={classes.userLookupSearch}
					required={required}
				/>
			</Grid>
			<Grid item xs={12} lg={isCard ? 12 : 7}>
				<div className={classes.userLookupResultDiv}>
					<DisplayUserResult userArray={userArray} busy={busy} userSearchKey={userSearchKey} />
				</div>
			</Grid>
		</Grid>
	)
});

UserLookup.propTypes = {
	userGuid: PropTypes.string,
	setUserId: PropTypes.func,
	setUserFirstName: PropTypes.func,
	setUserLastName: PropTypes.func,
	label: PropTypes.string,
	onCleared: PropTypes.func,
	required: PropTypes.bool
};

UserLookup.defaultProps = {
	setUserId: () => { },
	setUserFirstName: () => { },
	setUserLastName: () => { },
	onCleared: () => { },
	required: false
};

export default UserLookup;