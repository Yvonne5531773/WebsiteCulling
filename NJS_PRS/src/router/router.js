import App from '../App'

const guide = r => require.ensure([], () => r(require('../components/guide/VGuide')), 'guide')
const home = r => require.ensure([], () => r(require('../components/home/VHome')), 'home')
const favorite = r => require.ensure([], () => r(require('../components/favorite/VFavorite')), 'favorite')
const flow = r => require.ensure([], () => r(require('../components/flow/VLightbox')), 'flow')

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
		}
	]
}]