import App from '../App'

const guide = r => require.ensure([], () => r(require('../views/guide/VGuide')), 'guide')
const home = r => require.ensure([], () => r(require('../views/home/VHome')), 'home')
const collection = r => require.ensure([], () => r(require('../views/collection/VCollection')), 'collection')

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
			path: '/collection',
			component: collection,
		}
	]
}]