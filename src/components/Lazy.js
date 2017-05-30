import Loadable from 'react-loadable';
import * as React from 'react';

function Loading({ isLoading, error, pastDelay }) {
	if (isLoading) {
		return pastDelay ? <div>Loading...</div> : null; // Don't flash "Loading..." when we don't need to.
	} else if (error) {
		return <div>Error! Component failed to load</div>;
	} else {
		return null;
	}
}

export default function Lazy(opts) {
	return Loadable({
		LoadingComponent: Loading,
		...opts,
	});
}
