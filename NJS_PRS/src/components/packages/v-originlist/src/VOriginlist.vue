<template>
	<div :class="{'from':!isFixed, 'from fixed': isFixed}" :style="{right:isFixed?right+'px':0}" v-if="sites&&sites.length>0">
		<div class="head">
			<h2>{{title}}</h2>
		</div>
		<section class="list-content">
			<div class="r-data" v-for="(data, i) in sites" :key="data.id" v-if="data.name">
				<a class="avatar" target="_blank" :href="data.href_url" :title="data.name" @click="open(data)">
					<img v-lazy="data.iconLazyObj"/>
				</a>
				<p class="title">
					<a target="_blank" class="name" :href="data.href_url" :title="data.name" @click="open(data)">{{data.name | clip(24)}}</a>
					<a target="_blank" class="description" :href="data.href_url" :title="data.description" @click="open(data)">{{data.description | clip(60)}}</a>
					<span class="r-t" @click="like(data)">
							<a class="like" :style="data.liked&&`backgroundPosition:-30px`"></a>
							<span>{{txt}}</span>
						</span>
				</p>
			</div>
		</section>
	</div>
</template>

<script>
	import { websiteApi } from 'api'
	import { getHost, clipstring, getOperationFullTime } from '../../../../config/utils'
	import { mockRelation } from '../../../../mock/relation'
	export default {
		name: 'VOriginlist',
		data () {
			return {
				list: [],
				vm: [],
				title: this.$txt.TXT_34,
				txt: this.$txt.TXT_14,
				index: 0,
				screenWidth: document.body.clientWidth,
				right: document.body.clientWidth>=1066?document.body.clientWidth-((document.body.clientWidth-1100)/2+820+25+214):document.body.clientWidth-(820+214)
			}
		},
		props: {
			isFixed: {
				type: Boolean,
				default: false
			},
			sites: {
				type: Array
			},
			categoryid: {

			}
		},
		watch: {
			screenWidth (val) {
				this.screenWidth = val
				this.right = this.screenWidth>=1066?this.screenWidth-((this.screenWidth-1100)/2+820+25+214):this.screenWidth-(820+214)
			},
		},
		mounted() {
			const that = this
			window.onresize = () => {
				return (() => {
					window.screenWidth = document.body.clientWidth
					that.screenWidth = window.screenWidth
				})()
			}
		},
		methods: {
			open(data) {
				websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:2,name:this.categoryid+'',url:data.href_url,action_time:getOperationFullTime(new Date()),number1:0,number2:0})
			},
			like(data) {
				const store = {}
				store.id = data.id
				store.name = data.name
				store.url = data.url
				store.href_url = data.href_url
				store.description = data.description
				store.icon = data.icon
				store.liked = data.liked = !data.liked
				this.saveSite(store)
				store.liked && websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:3,name:this.categoryid+'',url:data.href_url,action_time:getOperationFullTime(new Date()),number1:0,number2:0})
			},
		},
	}
</script>

<style lang="stylus" scoped>
	.from
		float left
		width 214px
		height 82.6%
		position relative
		padding-bottom 20px
		@media screen and (max-height 1800px)
			height 86.6%
		@media screen and (max-height 800px)
			height 84.6%
		@media screen and (max-height 687px)
			height 82.6%
		.head
			color #6346de
			border-bottom 1px solid #cdcdde
			h2
				font-size 14px
				position relative
				bottom 5px
		.list-content
			position relative
			top 20px
			height 100%
			overflow auto
			&::-webkit-scrollbar
				display none
			.r-data
				height 75px
				font-size 14px
				.avatar
					float left
					img
						height 16px
						width 16px
				.title
					padding-left 10px
					overflow hidden
					position relative
					bottom 3px
					.name
						overflow hidden
						text-overflow ellipsis
						white-space nowrap
						display block
						padding-bottom 3px
						&:hover
							color #6346de
					a
						color #333333
					.description
						font-size 12px
						height 20px
						display block
						color #5b5b5b !important
						&:hover
							color #6346de!important
			.r-t
				font-size 12px
				color #6346de
				position absolute
				top 0
				right 0
				display flex
				cursor pointer
				&:hover
					.like
						background-position -15px
				&:active
					.like
						background-position -30px
				.like
					background url("../../../../assets/img/relation/like.png") no-repeat
					margin 2px 5px
					width 15px
					height 15px
	.fixed
		position fixed
		/*right 395px*/
		bottom 0
</style>