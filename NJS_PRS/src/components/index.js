import VAlert from './packages/v-alert/index.js'
import VBaidu from './packages/v-baidu/index.js'
import VBanner from './packages/v-banner/index.js'
import VFunction from './packages/v-function/index.js'
import VHeader from './packages/v-header/index.js'
import VLoading from './packages/v-loading/index.js'
import VItem from './packages/v-item/index.js'
import VRecommend from './packages/v-recommend/index.js'
import VRelation from './packages/v-relation/index.js'
import VFancybox from './packages/v-fancybox/index.js'
import VPaginator from './packages/v-paginator/index.js'
import VWaterfall from './packages/v-waterfall/index.js'
import VOriginlist from './packages/v-originlist/index.js'
import VRecyclist from './packages/v-recyclist/index.js'
import VMy from './packages/v-my/index.js'
import VDiscover from './packages/v-discover/index.js'
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
	Vue.component(VRecommend.name, VRecommend)
	Vue.component(VRelation.name, VRelation)
	Vue.component(VFancybox.name, VFancybox)
	Vue.component(VPaginator.name, VPaginator)
	Vue.component(VWaterfall.name, VWaterfall)
	Vue.component(VOriginlist.name, VOriginlist)
	Vue.component(VRecyclist.name, VRecyclist)
	Vue.component(VMy.name, VMy)
	Vue.component(VDiscover.name, VDiscover)

	Vue.$txt = Vue.prototype.$txt = txt;
};

export default {
	install
}