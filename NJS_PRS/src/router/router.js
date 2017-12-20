import App from '../App'

const guide = r => require.ensure([], () => r(require('../components/guide/VGuide')), 'guide')
const home = r => require.ensure([], () => r(require('../components/home/VHome')), 'home')
const favorite = r => require.ensure([], () => r(require('../components/favorite/VFavorite')), 'favorite')

export default [{
	path: '/',
	component: App,
	children: [
		{
			path: '',
			redirect: '/guide'
		},
		{
			path: '/guide',
			component: guide,
			meta: { keepAlive: true },
		},
		{
			path: '/home',
			component: home,
			// children: [{
			// 	path: '/favorite',
			// 	component: favorite
			// }]
		},
		{
			path: '/favorite',
			component: favorite
		}
	]
}]