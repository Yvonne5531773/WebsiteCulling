
import {
	SET_COMPONENT,
} from './mutation-types.js'


export default {
	[SET_COMPONENT](state, {
		component,
	}) {
		state.component = component;
	},

}
