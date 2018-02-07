<template>
	<div class="header">
		<div class="top"></div>
		<div class="head">
			<div class="title">
				<div class="txt">
					<p class="txt1">{{txt1}}</p>
					<p class="txt2">{{txt2}}</p>
				</div>
			</div>
			<div class="component">
				<a class="option" v-for="(component, index) in components" :style="!favoritePage && component.selected&&`color:#ffffff;borderBottom:5px solid #f7ea53`" @click="change(component.name, 1) ">{{component.txt}}
					<span v-if="component.name===`VMy` && liked" class="dot">●</span>
				</a>
				<a class="fb" :href="href" target="_blank">{{feedback}}</a>
				<b v-if="!favoritePage" class="back-guide" @click="backGuide">
					<span>{{txt3}}</span>
				</b>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { getOperationFullTime } from '../../config/utils'
	import { websiteApi } from 'api'
	import { service } from 'components/common/mixin'
	import { fbHref } from '../../config/config'
	import txt from '../../config/txt'

	export default {
		data() {
			return {
				txt1: txt.TXT_1,
				txt2: txt.TXT_2,
				txt3: txt.TXT_3,
				feedback: txt.TXT_4,
				components:
					[
						{name:'VMy',txt:'我的网站',selected:false},
						{name:'VDiscover', txt:'发现网站',selected:false},
					],
			}
		},
		props: {
			favoritePage: {
				type: Boolean
			}
		},
		computed:{
			...mapState([
				'component',
				'liked'
			]),
			href() {
				return fbHref
			}
		},
		mixins: [service],
		mounted(){
			const cname = this.component? this.component: 'VMy'
			!this.favoritePage && this.change(cname)
		},
		watch: {
			component() {
				this.components.forEach((c)=>{
					c.selected = false
					this.component===c.name && (c.selected = true)
				})
			},
		},
		methods: {
			change(name, type) {
				if (this.favoritePage) {
					this.$router.push({path: 'home'})
				}
				this.components.forEach((c)=>{
					c.selected = false
					name===c.name && (c.selected = true)
				})
				this.setComponent(name)
				this.liked && name==='VMy' && this.setLike(false)
				type===1&&this.component==='VMy'&&!this.favoritePage&&websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:6,value:0,hotsite:0,url:'',name:''})
				type===1&&this.component==='VMy'&&this.favoritePage&&websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:5,name:'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
				type===1&&this.component==='VDiscover'&&this.favoritePage&&websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:6,name:'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
			},
			backGuide() {
				this.component==='VDiscover'&&websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:5,value:0,hotsite:0,url:'',name:''})
				this.component==='VMy'&&websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:10,url:'',value:0})
				this.$router.push({path: '/guide'})
			}
		},
	}
</script>

<style lang="stylus">
	.header
		z-index 199
		width 100%
		height 85px
		position fixed
		transition .2s height
		background-size 100% 110%
		transform translateZ(0)
		background #6346de
		.top
			position absolute
			width 100%
			height 100%
		.head
			position relative
			margin 0 auto
			max-width 1100px
			min-width 1040px
			height 85px
			.title
				top 14px
				position absolute
				.img
					position absolute
					width 60px
					height 60px
					background url("../../../static/img/head/logo.png") no-repeat
				.txt
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
				.option
					font-size 18px
					margin 33px 30px 0 28px
					height 47px
					color #a4a4ff
					display inline-block
				.fb
					height 18px
					position absolute
					right 140px
					top 33px
					border-bottom 1px solid #fff
					font-size 14px
					color #fff
				.back-guide
					background url("../../../static/img/head/back-guide.png") no-repeat
					width 146px
					height 66px
					font-size 14px
					position absolute
					cursor pointer
					right 0
					color #000
					line-height 4.2
					margin-right -12px
					top 16px
					&:hover
						background-position -146px
					&:active
						background-position -292px
				.dot
					font-size 20px
					line-heigth 16px
					color rgba(255, 0, 0, 0.64)
					position relative
					bottom 13px
					float right
</style>
