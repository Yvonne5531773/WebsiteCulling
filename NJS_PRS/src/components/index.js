import VAlert from './packages/v-alert/index.js'
import VBaidu from './packages/v-baidu/index.js'
import VBanner from './packages/v-banner/index.js'
import VFunction from './packages/v-function/index.js'
import VHeader from './packages/v-header/index.js'
import VLoading from './packages/v-loading/index.js'
import VItem from './packages/v-item/index.js'
import txt from '../config/txt'

const install = function (Vue, config = {}) {
	if (install.installed) return

	Vue.component(VAlert.name, VAlert)
	Vue.component(VBaidu.name, VBaidu)
	Vue.component(VBanner.name, VBanner)
	Vue.component(VFunction.name, VFunction)
	Vue.component(VHeader.name, VHeader)
	Vue.component(VLoading.name, VLoading)
	Vue.component(VItem.name, VItem)

	Vue.$txt = Vue.prototype.$txt = txt;
};

export default {
	install
}