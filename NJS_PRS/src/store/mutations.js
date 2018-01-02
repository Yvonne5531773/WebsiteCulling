
import {
	SET_COMPONENT,
	SET_LIKED,
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
}
