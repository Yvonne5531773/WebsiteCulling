import App from '../App'

const guide = r => require.ensure([], () => r(require('../views/guide/VGuide')), 'guide')
const home = r => require.ensure([], () => r(require('../views/home/VHome')), 'home')
const favorite = r => require.ensure([], () => r(require('../views/favorite/VFavorite')), 'favorite')
const flow = r => require.ensure([], () => r(require('../views/flow/VLightbox')), 'flow')
const list = r => require.ensure([], () => r(require('../views/list/VListbox')), 'list')

export default [{
	path: '/',
	component: App,
	children: [
		{
			path: '',
			redirect: '/home'
		},
		{
			path: '/guide',
			component: guide,
			// meta: { keepAlive: true },
		},
		{
			path: '/home',
			component: home,
		},
		{
			path: '/favorite',
			component: favorite,
		},
		{
			path: '/flow',
			component: flow,
		},
		{
			path: '/list',
			component: list,
		}
	]
}]