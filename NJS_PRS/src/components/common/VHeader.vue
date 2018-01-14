<template>
	<div class="h-center">
		<div class="top"></div>
		<!--<img class="top" src="../../../static/img/head/top.png" />-->
		<div class="head">
			<div class="title">
				<i class="img"></i>
				<div class="txt">
					<p class="txt1">{{txt1}}</p>
					<p class="txt2">{{txt2}}</p>
				</div>
			</div>
			<div class="component">
				<a v-for="(component, index) in components" :style="!favoritePage && component.selected&&`color:#ffffff;borderBottom:5px solid #a4a4ff`" @click="change(component.name, 1)">{{component.txt}}
					<span v-if="component.name===`VMy` && liked" class="dot">●</span>
				</a>
				<b v-if="!favoritePage" class="back-guide" @click="backGuide">
					<span>{{txt3}}</span>
				</b>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import _ from 'lodash'
	import { getStore, setStore } from '../../config/utils'
	import { websiteApi } from 'api'
	export default {
		data() {
			return {
				txt1: '猎豹网址精选',
				txt2: '新一代智能网址导航',
				txt3: '重选兴趣',
				components:
					[
						{name: 'VMy',txt:'我的网站', selected: false},
						{name: 'VDiscover', txt: '发现网站', selected: false},
					],
			}
		},
		props: {
			favoritePage: {
				type: Boolean
			}
		},
		mounted(){
			const storeComponent = getStore('COMPONENT_NAME')
			const cname = this.component? this.component: (storeComponent? storeComponent:'VDiscover')
			!this.favoritePage && this.change(cname)
		},
		watch: {
			component () {
				this.components.forEach((c)=>{
					c.selected = false
					this.component===c.name && (c.selected = true)
				})
			},
		},
		methods: {
			...mapMutations(['SET_COMPONENT', 'SET_LIKED']),
			change(name, type) {
				if (this.favoritePage) {
					this.$router.push({path: 'home'})
				}
				this.components.forEach((c)=>{
					c.selected = false
					name===c.name && (c.selected = true)
				})
				this.SET_COMPONENT({component: name})
				setStore('COMPONENT_NAME', name)
				this.liked && name==='VMy' && this.SET_LIKED({liked: false})
				type===1&&this.component==='VMy'&&!this.favoritePage&&websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:6,value:0,hotsite:0,url:'',name:''})
				type===1&&this.component==='VMy'&&this.favoritePage&&websiteApi.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte',{action:5,name:'',url:''})
			},
			backGuide() {
				this.component==='VDiscover'&&websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:5,value:0,hotsite:0,url:'',name:''})
				this.component==='VMy'&&websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:10,url:'',value:0})
				this.$router.push({path: '/guide'})
			}
		},
		computed:{
			...mapState([
				'component',
				'liked'
			])
		},
	}
</script>

<style lang="stylus">
	.h-center
		z-index 199
		width 100%
		height 85px
		position fixed
		transition .2s height
		background-size 100% 110%
		transform translateZ(0)
		background url("../../../static/img/head/top-bkg.png") no-repeat
		background #5454a6
		.top
			position absolute
			width 100%
			height 100%
			background url("../../../static/img/head/top.png") no-repeat
		.head
			position relative
			margin 0 auto
			max-width 1108px
			min-width 1060px
			height 85px
			.title
				top 14px
				position relative
				.img
					position absolute
					width 60px
					height 60px
					background url("../../../static/img/head/logo.png") no-repeat
				.txt
					position absolute
					left 80px
					.txt1
						font-size 24px
						color #ffffff
					.txt2
						font-size 14px
						color #a4a4ff
			.component
				text-align center
				left 0
				right 0
				top 0
				bottom 0
				margin auto
				position absolute
				a
					font-size 18px
					margin 33px 30px 0 28px
					height 47px
					color #a4a4ff
					display inline-block
				.back-guide
					background url("../../../static/img/head/back-guide.png") no-repeat
					width 84px
					height 34px
					position absolute
					cursor pointer
					right 0
					margin 30px 133px 0 0
					color #a4a4ff
					line-height 2.8
					&:hover
						background-position -84px
						color white
					&:active
						background-position -168px
						color white
				.dot
					font-size 20px
					line-heigth 16px
					color rgba(255, 0, 0, 0.64)
					position relative
					bottom 13px
					float right
</style>
