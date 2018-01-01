<template>
	<div class="recommend">
		<h2>热门推荐</h2>
		<section class="content">
			<div class="r-data" v-for="(data, index) in list">
				<a class="avatar" target="_blank" :href="data.href_url" :title="data.name">
					<img v-lazy="data.avatar"/>
				</a>
				<p class="title">
					<a target="_blank" :href="data.href_url" :title="data.href_url">{{data.name}}</a>
					<a target="_blank" class="description" :href="data.href_url" :title="data.description">{{data.description}}</a>
				</p>
			</div>
		</section>
	</div>
</template>

<script>
	import { jsonp } from 'components/common/mixin'
	import { mockRecommend } from '../../mock/recommend'
export default {
	data () {
		return {
			defaultAvatar: '/static/img/home/recommend/default.png',
			list: [],
			path: '/v1/recommend'
		}
	},
	mixins: [jsonp],
	mounted () {
		this.init()
	},
	props: {

	},
	methods: {
		async init () {
			let res = {}
			try {
				res = await this.jsonp(this.path)
			}catch (e) {
				console.log('error:', e)
			}
			this.list = !_.isEmpty(res) && res.bottoms? res.bottoms:mockRecommend
		}
	}
}
</script>

<style lang="stylus" scoped>
	.recommend
		float right
		width 210px
		h2
			font-size 18px
			position relative
			top 2px
			color #5454a6
		.content
			position relative
			bottom 7px
			.r-data
				height 45px
				font-size 12px
				.avatar
					-webkit-box-sizing border-box
					box-sizing border-box
					overflow hidden
					float left
					img
						height 40px
						width 40px
				.title
					margin 25px 0
					text-overflow ellipsis
					white-space pre-wrap
					word-wrap break-word
					overflow hidden
					height 55px
					position relative
					left 22px
					a
						color #333333
					.description
						display block
						color #888888
</style>