import Loadable from 'react-loadable';
import Loading from './Loading';

export default function Lazy(opts) {
	return Loadable({
		LoadingComponent: Loading,
		...opts,
	});
}
