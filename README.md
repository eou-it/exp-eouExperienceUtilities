 EOU Extension Utilities

This repository is a collection of Experience Components to aid in the creation of Experience Extensions.

- [Install](#install)
- [Components and Hooks](#components-and-hooks)
- [Data Query Functions](#data-query-functions)

## Install

```
npm install git+https://github.com/eou-it/exp-eouExperienceUtilities.git
```

## Build & Publish
- npm install  # install dependencies (first time only, or if new dependencies are added/chanaged)
- npm run build
- To test locally, use `npm pack` then in another project `npm install ../exp-eouExperienceUtilities/eou-experience-utilities-1.0.6.tgz`
- npm login (Password is in Password book under NPM)
- npm publish


## Notes
- When adding a new component be sure to update dest/index.d.ts


## SDK Security
Below are the instructions on how to use the SDK Security page
1. Follow the Install instructions above to install this utility package into your package.
2. In your package extension.js add a key for `PIPELINE_GET_SDK_SECURITY` and make it required. This will need to be configured as part of your card configuration. You can review existing packages to get pipeline name.
3. On your page include the `useInvalidUserAccess` function with `import { useInvalidUserAccess } from 'eou-experience-utilities';`
4. Build out your pages primary exported function so it contains the following code:
```jsx
export default function EouSdkSecurity() {
	const { setErrorMessage } = useExtensionControl();
	const { accessIsLoading, accessIsInvalid, accessError } = useInvalidUserAccess('EouSdkSecurityPage');

	useEffect(() => {
		if (accessError) {
			setErrorMessage({
				headerMessage: "Contact Your Administrator",
				textMessage: "There was an error retrieving the SDK Security Authorized Access",
				iconName: 'warning',
				iconColor: colorFillAlertError
			});
		}
	}, [accessError, setErrorMessage]);if (accessIsLoading) {
		return (
			<div className={classes.root}>
				<div className={classes.spinnerBox}>
					<CircularProgress />
				</div>
			</div>
		);
	} else if (accessIsInvalid) {
		return (
			<div className={classes.root}>
				<div style={{ display: 'flex', justifyContent: 'center', marginTop: '10rem' }}>
					<div style={{ textAlign: 'center' }}>
						<Typography variant="h2">You are not authorized to access this page</Typography>
						<Typography variant="body1">If you believe this is incorrect please submit a ticket to EOU IT by emailing infosys@eou.edu</Typography>
					</div>
				</div>
			</div>
		);
	} else {
		return ();//whatever you want here to build out your page.
	}
}
```
5. Go to the SDK Security Management card/page.
6. Click `Add Module` and added your module, the *Module Name* should match you module name in your extensions.js file, usually line 2.
7. Click `Add Page` add your page, this shoudl match the name you pass when you call `useInvalidUserAccess`. 
8. Add the roles that should have access to your page.
9. Repeated steps 7 and 8 for each of your pages.