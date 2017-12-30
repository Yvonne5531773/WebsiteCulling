<template>
	<div class="item">
		<router-link :to="{ path: 'favorite', query: {themeid: category.parentId, categoryid: category.id}}">
			<div class="avatar" :title="category.name" @click="open(1)">
				<img v-lazy="addHttp(category.avatar)" :style="category.parentId&&category.parentId===`0099`&&`position:relative;bottom:4px`"/>
				<span>{{category.name}}</span>
				<div class="mask"></div>
			</div>
		</router-link>
		<p class="title">
			<router-link :to="{ path: 'favorite', query: {themeid: category.parentId, categoryid: category.id}}">
				<a target="_blank" :title="category.name" @click="open(1)">{{category.name | clip}}</a>
			</router-link>
			<span class="by">{{by}}</span>
		</p>
		<div class="site-list">
			<p v-if="index<=2" v-for="(site, index) in category.sites">
				<a :href="site.url" class="site-n" :title="site.name" target="_blank"  @click="open(2, site)">{{site.name | clip}}</a>
				<a :href="site.url" class="site-u" :title="site.url" target="_blank"  @click="open(2, site)">{{site.url | doUrl}}</a>
			</p>
		</div>
		<router-link :to="{ path: 'favorite', query: {themeid: category.parentId, categoryid: category.id}}">
			<div class="more" @click="open(1)">
				<span>{{moreTxt}}</span>
				<img src="../../../static/img/home/more.png"/>
			</div>
		</router-link>
	</div>
</template>

<script>
	import { websiteApi } from 'api'
	import { clipstring, getOperationFullTime } from '../../config/utils'
	import { jsonp } from 'components/common/mixin'
	export default {
		data() {
			return {
				moreTxt: '更多',
				by: ''
			}
		},
		mixins: [jsonp],
		mounted() {
			this.by = this.category.by ? 'by ' + this.category.by : ''
		},
		props: {
			category: {
				type: Object
			}
		},
		methods: {
			async open(flag, site) {
				if(flag === 1) {
					websiteApi.getFormSelectedInfo()
					let categories = await websiteApi.getGlobalTopForm()
					categories = !_.isEmpty(categories)? JSON.parse(categories):[]
					console.log('open categories', categories)
					let category = _.find(categories, {id: this.category.id + ''})
					category = _.isEmpty(category)? this.category:category
					console.log('open category', category)
					this.saveForm(category)
				} else if(flag === 2 && site) {
					websiteApi.getURLSelectedInfo()
					let sites = await websiteApi.getGlobalTopUrl()
					sites = !_.isEmpty(sites)? JSON.parse(sites):[]
					console.log('open sites', sites)
					let s = _.find(sites, {id: site.id + ''})
					site = _.isEmpty(s)? site:s
					site.views = site.views? site.views+1 : 1
					this.saveSite(site, this.category.id)
				}
			},
			addHttp(url) {
				if(url){
					return !~url.indexOf('http') && (url = 'http://' + url)
				}
			}
		},
		filters: {
			doUrl(url) {
				if (!url) return ''
				url += ''
				let arrUrl = []
				arrUrl = !!~url.indexOf('//') && url.split("//");
				arrUrl = arrUrl.length > 1 ? arrUrl[1] : url
				let end = !!~arrUrl.indexOf("/") ? arrUrl.indexOf("/") : arrUrl.length;
				let relUrl = arrUrl.substring(0, end)
				if (!!~relUrl.indexOf("?")) {
					relUrl = relUrl.split("?")[0]
				}
				return relUrl
			},
			clip(str) {
				return clipstring(str, 13)
			},
		}
	}
</script>

<style lang="stylus" scoped>
	.item
		height 100%
		width 100%
		.avatar
			height 51%
			-webkit-box-sizing border-box
			box-sizing border-box
			overflow hidden
			position relative
			font-size 24px
			color white
			letter-spacing 7px
			border-radius 4px
			span
				overflow hidden
				position absolute
				top 0
				right 0
				left 0
				bottom 0
				margin auto
				height 40px
				z-index 99
			.mask
				background-color black
				width 240px
				height 156px
				position absolute
				left 0
				top 0
				opacity 0.2
				z-index 9
		.title
			margin 16px 16px 7px
			color #333
			font-size 16px
			font-weight 600
			font-synthesis style
			overflow hidden
			text-overflow ellipsis
			white-space nowrap
			border-bottom 1px solid #949494
			height 30px
			.by
				float right
				font-size 12px
				color #949494
				line-height 2
			a
				color #333
				position relative
				float left
				width 102px
				overflow hidden
				text-align left
		.site-list
			margin 16px 16px 7px
			p
				height 20px
				font-size 12px
				overflow hidden
				color #333333
			.site-n
				float left
				text-align left
				color #333333
				&:hover
					color #5454a6
					border-bottom 1px solid #5454a6
			.site-u
				float right
				text-align right
				color #949494
				&:hover
					color #5454a6
					border-bottom 1px solid #5454a6
		.more
			font-size 12px
			color #5454a6
			float right
			bottom 0
			margin 6px 16px
			right 0
			height 20px
			position absolute
			cursor pointer
			span
				float right
</style>