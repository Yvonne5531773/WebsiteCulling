import computed from './pluginComputed'
import directives from './pluginDirectives'
import filters from './pluginFilters'
import methods from './pluginMethods'

export default {
	install(Vue) {
		Vue.mixin({
			computed: computed,

			methods: methods,

			directives: directives,

			filters: filters
		})
	}
}