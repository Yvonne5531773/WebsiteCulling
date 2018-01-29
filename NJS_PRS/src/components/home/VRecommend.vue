<template>
	<div class="recommend">
		<h2>热门推荐</h2>
		<section class="content">
			<div class="r-data" v-for="(data, index) in list">
				<a class="avatar" target="_blank" :href="data.href_url" :title="data.name" @click="open(data)">
					<img v-lazy="addHttp(data.avatar)"/>
				</a>
				<p class="title">
					<a target="_blank" :href="data.href_url" :title="data.href_url" @click="open(data)">{{data.name}}</a>
					<a target="_blank" class="description" :href="data.href_url" :title="data.description" @click="open(data)">{{data.description}}</a>
				</p>
			</div>
		</section>
	</div>
</template>

<script>
	import { websiteApi } from 'api'
	import { service } from 'components/common/mixin'
	import { mockRecommend } from '../../mock/recommend'
export default {
	data () {
		return {
			list: [],
			path: '/v1/recommend'
		}
	},
	mixins: [service],
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
		},
		open(data) {
			websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:3,value:0,hotsite:data.id,url:'',name:''})
		}
	}
}
</script>

<style lang="stylus" scoped>
	.recommend
		float right
		width 223px
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
					left 15px
					a
						color #333333
					.description
						display block
						color #5b5b5b
</style>