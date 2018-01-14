<template>
	<div class="item">
		<router-link :to="{ path: 'favorite', query: {categoryid: category.id}}">
			<div class="avatar" :title="category.name" @click="open(1, 1)">
				<img v-lazy="addHttp(category.avatar)" :style="category.id===`0099`&&`position:relative;bottom:4px`"/>
				<span>{{category.name}}</span>
				<div class="mask"></div>
			</div>
		</router-link>
		<p class="title">
			<router-link :to="{ path: 'favorite', query: {categoryid: category.id}}">
				<a target="_blank" :title="category.name" @click="open(1, 1)">{{category.name | clip(1)}}</a>
			</router-link>
			<span class="by">{{by}}</span>
		</p>
		<div class="site-list">
			<p v-if="index<=2" v-for="(site, index) in category.sites">
				<a :href="site.href_url" class="site-n" :title="site.name" target="_blank"  @click="open(2, 2, site)">{{site.name | clip(1)}}</a>
				<a :href="site.href_url" class="site-u" :title="site.url" target="_blank"  @click="open(2, 2, site)">{{site.url | clip(2)}}</a>
			</p>
		</div>
		<router-link :to="{ path: 'favorite', query: {categoryid: category.id}}">
			<div class="more" @click="open(1, 3)">
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
	import { mapMutations } from 'vuex'
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
			},
			sort: {
				type: Number
			}
		},
		methods: {
			...mapMutations(['SAVE_POSITION']),
			async open(flag, type, site) {
				if(flag === 1) {
					if(this.category.id==='0099') {
						websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:7,url:'',value:0})
						return
					}
					let categories = await this.getForm(),
						category = _.find(categories, {id: this.category.id + ''})
					category = _.isEmpty(category)? this.category:category
					this.saveForm(category)
					!this.sort&&websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:2,value:type,hotsite:0,url:'',name:this.category.id + ''})
					this.sort&&this.sort===3&&websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:5,url:'',value:this.category.id})
					this.sort&&this.sort===5&&type===1&&websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:9,url:'',value:this.category.id})
				} else if(flag === 2 && site) {
					let sites = await this.getSite(),
						s = _.find(sites, {id: site.id + ''})
					s = _.isEmpty(s)? site:s
					s.views = s.views? s.views+1 : 1
					this.saveSite(s, this.category.id)
					!this.sort&&websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:2,value:type,hotsite:0,url:site.url,name:this.category.id + ''})
				}
			},
		},
		filters: {
			clip(str, type) {
				return type===1? clipstring(str, 13) : clipstring(str, 16)
			},
		},
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