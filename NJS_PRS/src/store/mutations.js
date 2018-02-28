
import {
	SET_COMPONENT,
	SET_LIKED,
	SET_POSITION,
	SET_FULL_SCREEN,
	SET_RESOURCE_TEMPLATE,
} from './mutation-types.js'

export default {
	[SET_COMPONENT](state, {
		component,
	}) {
		state.component = component;
	},

	[SET_LIKED](state, {
		liked,
	}) {
		state.liked = liked;
	},

	[SET_POSITION](state, {
		position,
	}) {
		state.position = position;
	},

	[SET_FULL_SCREEN](state, {
		isFullScreen,
	}) {
		state.isFullScreen = isFullScreen;
	},

	[SET_RESOURCE_TEMPLATE](state, {
		resourceTemplate,
	}) {
		state.resourceTemplate = resourceTemplate;
	},
}
