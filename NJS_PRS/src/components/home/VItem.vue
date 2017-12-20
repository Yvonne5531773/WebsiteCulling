<template>
	<div class="item">
		<router-link target="_blank" :to="{ path: 'favorite', query: {id: encodeURIComponent(category.id)}}">
			<div class="avatar">
				<img :src="category.avatar || defaultAvatar"/>
			</div>
		</router-link>
		<p class="title">
			<a target="_blank" :title="category.name">{{category.name | clip}}</a>
			<span class="by">{{by}}</span>
		</p>
		<div class="site-list">
			<p v-if="index<=2" v-for="(site, index) in category.sites">
				<span class="site-n" :title="site.name">{{site.name | clip}}</span>
				<a :href="site.url" class="site-u" :title="site.url" target="_blank">{{site.url | doUrl}}</a>
			</p>
		</div>
		<div class="more">
			<span>{{moreTxt}}</span>
			<img src="../../../static/img/home/more.png"/>
		</div>
	</div>
</template>

<script>
	import { clipstring } from '../../config/utils'
export default {
	data () {
		return {
			defaultAvatar: '',
			moreTxt: '更多',
			by: ''
		}
	},
	mounted () {
		this.by = 'by ' + this.category.by
	},
	props: {
		category: {
			type: Object
		}
	},
	filters: {
		doUrl (url) {
			if(!url) return ''
			url += ''
			let arrUrl = []
			arrUrl = !!~url.indexOf('//') && url.split("//");
			arrUrl = arrUrl.length > 1? arrUrl[1] : url
			let end = !!~arrUrl.indexOf("/")? arrUrl.indexOf("/") : arrUrl.length;
			let relUrl = arrUrl.substring(0, end)
			if(!!~relUrl.indexOf("?")){
				relUrl = relUrl.split("?")[0]
			}
			return relUrl
		},
		clip (str) {
			return clipstring(str, 13)
		}
	}
}
</script>

<style lang="stylus" scoped>
	.item
		height 100%
		width 100%
		.avatar
			height 50%
			-webkit-box-sizing border-box
			box-sizing border-box
			overflow hidden
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
				width 42%
				float left
				text-align left
			.site-u
				float right
				text-align right
				width 57%
				color #949494
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