
import {
	SET_COMPONENT,
	SET_LIKED,
	SAVE_POSITION,
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

	[SAVE_POSITION](state, position) {
		state.position = position;
	},
}
