import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, TextField, Typography, makeStyles } from '@ellucian/react-design-system/core';
import { spacing20 } from '@ellucian/react-design-system/core/styles/tokens';

import { useCardInfo, useData } from '@ellucian/experience-extension-utils';


const useStyles = makeStyles(() => ({
	userLookupSearch: {
		margin: spacing20
	},
	flexRow: {
		display: 'flex',
		alignItems: 'center',
		gap: '16px', // or use spacing20 if you want consistency
	},
	userLookupCircularProgress: {
		size: '2rem',
	},
	userLookupResultDiv: {
		padding: spacing20,
		minHeight: '1.5rem',
		minWidth: '40rem'
	}
}), { index: 2 });

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
		return (<CircularProgress className={classes.userLookupCircularProgress} />);
	} else if (!userSearchKey || userSearchKey < 4) {
		return (<Typography className={classes.userLookupText}></Typography>);
	} else if (userArray && Array.isArray(userArray)) {
		if (userArray.length === 1) {
			const user = userArray[0];
			return (<Typography className={classes.userLookupText}>{user.userfirstname} {user.userlastname}</Typography>);
		} else {
			return (<Typography className={classes.userLookupText}></Typography>);
		}
	} else {
		return (<Typography className={classes.userLookupText}></Typography>);
	}
}

DisplayUserResult.propTypes = {
	userArray: PropTypes.array,
	busy: PropTypes.bool,
	userSearchKey: PropTypes.string
};

const UserLookup = forwardRef(function UserLookup(
	{ userGuid, setUserId, setUserFirstName, setUserLastName, onCleared },
	ref
) {
	const classes = useStyles();

	const {
		cardConfiguration: {
			PIPELINE_GET_USER_MAP
		} = {}
	} = useCardInfo();

	const { authenticatedEthosFetch } = useData();
	const { serverConfigContext: { cardPrefix }, cardId } = useCardInfo();

	const [busy, setBusy] = useState(false);
	const [busyUntilRefresh, setBusyUntilRefresh] = useState(false);

	useEffect(() => {
		if (busy && !busyUntilRefresh) {
			setBusy(false);
		}
	}, [busy, busyUntilRefresh]);

	const [search, setSearch] = useState('');
	const [userArray, setUserArray] = useState([]);
	const userSearchKey = search.toLowerCase().trim().replace(/@eou\.edu/i, '');

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
		if (userGuid) {
			if (userArray.length === 1) {
				const user = userArray[0];
				setUserId(userGuid, user.userid);
				setUserFirstName(userGuid, user.userfirstname);
				setUserLastName(userGuid, user.userlastname);
			} else {
				setUserId(userGuid, '');
				setUserFirstName(userGuid, '');
				setUserLastName(userGuid, '');
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
				inputProps={{ 'aria-label': 'Search for a user' }}
				id={`userSearch${userGuid}`}
				name={`userSearch${userGuid}`}
				onChange={(e) => handleUserSearchChange(e.target.value)}
				placeholder="mmonty or 910000000"
				value={search}
				className={classes.userLookupSearch}
			/>
			<div className={classes.userLookupResultDiv}>
				<DisplayUserResult userArray={userArray} busy={busy} userSearchKey={userSearchKey} />
			</div>
		</div>
	)
});

UserLookup.propTypes = {
	userGuid: PropTypes.string,
	setUserId: PropTypes.func,
	setUserFirstName: PropTypes.func,
	setUserLastName: PropTypes.func,
	onCleareed: PropTypes.func
};

UserLookup.defaultProps = {
	setUserId: () => { },
	setUserFirstName: () => { },
	setUserLastName: () => { },
	onCleareed: () => { }
};

export default UserLookup;