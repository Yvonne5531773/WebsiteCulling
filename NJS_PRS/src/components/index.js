import VAlert from './packages/v-alert/index.js'
import VBaidu from './packages/v-baidu/index.js'
import VBanner from './packages/v-banner/index.js'
import VBack from './packages/v-back/index.js'
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
import VOwn from '../views/home/childrens/v-own/index.js'
import VPublic from '../views/home/childrens/v-public/index.js'
import VCollect from './packages/v-collect/index.js'

import VLightbox from '../views/collection/templates/v-lightbox/index.js'
import VListbox from '../views/collection/templates/v-listbox/index.js'
import VBox from '../views/collection/templates/v-box/index.js'
import VResourcebox from '../views/collection/templates/v-resourcebox/index.js'
import VHotresource from './packages/v-hotresource/index.js'

import txt from '../txt/index'
import velocity from 'velocity-animate/velocity.min'
import { websiteApi } from 'api'

const install = function (Vue, config = {}) {
	if (install.installed) return

	Vue.component(VAlert.name, VAlert)
	Vue.component(VBaidu.name, VBaidu)
	Vue.component(VBanner.name, VBanner)
	Vue.component(VBack.name, VBack)
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
	Vue.component(VOwn.name, VOwn)
	Vue.component(VPublic.name, VPublic)
	Vue.component(VCollect.name, VCollect)

	Vue.component(VLightbox.name, VLightbox)
	Vue.component(VListbox.name, VListbox)
	Vue.component(VBox.name, VBox)
	Vue.component(VResourcebox.name, VResourcebox)
	Vue.component(VHotresource.name, VHotresource)

	Vue.$txt = Vue.prototype.$txt = txt
	Vue.$api = Vue.prototype.$api = websiteApi
	Vue.$velocity = Vue.prototype.$velocity = velocity;
};

export default {
	install
}