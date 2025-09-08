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