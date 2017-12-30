<template>
	<div class="recommend">
		<h2>热门推荐</h2>
		<section class="content">
			<div class="r-data" v-for="(data, index) in list">
				<a class="avatar" target="_blank" :href="data.url" :title="data.name">
					<img v-lazy="data.avatar"/>
				</a>
				<p class="title">
					<a target="_blank" :href="data.url" :title="data.url">{{data.name}}</a>
					<a target="_blank" class="description" :href="data.url" :title="data.description">{{data.description}}</a>
				</p>
			</div>
		</section>
	</div>
</template>

<script>
	import { mockRecommend } from '../../mock/recommend'
export default {
	data () {
		return {
			defaultAvatar: '/static/img/home/recommend/default.png',
			list: [],
		}
	},
	mounted () {
		this.init()
	},
	props: {
//		category: {
//			type: Object
//		}
	},
	methods: {
		init () {
			this.list = _.cloneDeep(_.sortBy(mockRecommend, ['sort']))
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