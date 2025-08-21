import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, TextField, Typography, makeStyles } from '@ellucian/react-design-system/core';
import { spacing20 } from '@ellucian/react-design-system/core/styles/tokens';

import { useCardInfo, useData } from '@ellucian/experience-extension-utils';


const useStyles = makeStyles(() => ({
	userLookupSearch: {
		margin: spacing20
	},
	userLookupText: {
		margin: spacing20,
		minHeight: '1.5rem',
		minWidth: '50rem'
	},
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px', // or use spacing20 if you want consistency
  },
	userLookupCircularProgress: {
		size: '2rem'
	}
}), { index: 2});

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

function DisplayUserResult({ userArray, busy, userSearchKey }) {
  const classes = useStyles();

	if (busy) {
		return (<CircularProgress className={classes.userLookupCircularProgress}/>);
	} else if (userSearchKey < 4 ) {
		return(<Typography className={classes.userLookupText}></Typography>);
	} else if (userArray && Array.isArray(userArray)) {
		if (userArray.length === 1) {
			const user = userArray[0];
			return(<Typography className={classes.userLookupText}>{user.userfirstname} {user.userlastname}</Typography>);
		} else {
			return(<Typography className={classes.userLookupText}></Typography>);
		}
	} else {
		return(<Typography className={classes.userLookupText}></Typography>);
	}
}

DisplayUserResult.propTypes = {
	userArray: PropTypes.array,
	busy: PropTypes.bool,
	userSearchKey: PropTypes.string
};

export default function UserLookup({ userGuid, setUserId, setUserFirstName, setUserLastName }) {
  const classes = useStyles();

	const {
			cardConfiguration: {
					PIPELINE_GET_USER_MAP
			} = {}
	} = useCardInfo();

	const { authenticatedEthosFetch } = useData();
	const { serverConfigContext: { cardPrefix }, cardId } = useCardInfo();
	
	const [ busy, setBusy ] = useState(false);
	const [ busyUntilRefresh, setBusyUntilRefresh ] = useState(false);

	useEffect(() => {
		if (busy && !busyUntilRefresh) {
			setBusy(false);
		}
	}, [busy, busyUntilRefresh]);
	
	const [ search, setSearch ] = useState('');
	const [ userArray, setUserArray ] = useState([]);
	const userSearchKey = search.toLowerCase().trim().replace(/@eou\.edu/i, '');

	function handleUserSearchChange(searchValue) {
		setSearch(searchValue);
	}

	useEffect(() => {
		if (userSearchKey.length < 4) return;

		const controller = new AbortController();

		const getData = async () => {
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
				setBusy(false);
			}
		};

		getData();

		return () => {
			controller.abort(); // 🛑 cancel previous fetch on next run
		};
	}, [PIPELINE_GET_USER_MAP, authenticatedEthosFetch, cardId, cardPrefix, setBusy, setBusyUntilRefresh, userSearchKey]); // will trigger when search changes

	useEffect(() => {
		if (userGuid) {
			if (userArray.length === 1) {
				const user = userArray[0];
				setUserId(userGuid, user.userid);
				setUserFirstName(userGuid, user.userfirstname);
				setUserLastName(userGuid, user.userlastname);
			} else {
				setUserId(userGuid,'');
				setUserFirstName(userGuid,'');
				setUserLastName(userGuid,'');
			}
		} else {
			if (userArray.length === 1) {
				const user = userArray[0];
				setUserId(user.userid);
				setUserFirstName(user.userfirstname);
				setUserLastName(user.userlastname);
			} else {
				setUserId('');
				setUserFirstName('');
				setUserLastName('');
			}
		}
	}, [userArray, userGuid, setUserId, setUserFirstName, setUserLastName]);

	return (
		<div className={classes.flexRow}>
			<TextField
					inputProps={{'aria-label': 'Search for a user'}}
					id={`userSearch${userGuid}`}
					name={`userSearch${userGuid}`}
					onChange={(e) => handleUserSearchChange(e.target.value)}
					placeholder="mmonty or 910000000"
					value={search}
					className={classes.userLookupSearch}
			/>
			<DisplayUserResult userArray={userArray} busy={busy} userSearchKey={userSearchKey}/>
		</div>
	)
}

UserLookup.propTypes = {
	userGuid: PropTypes.string,
	setUserId: PropTypes.func,
	setUserFirstName: PropTypes.func,
	setUserLastName: PropTypes.func
};

UserLookup.defaultProps = {
	setUserId: () => {},
	setUserFirstName: () => {},
	setUserLastName: () => {}
};