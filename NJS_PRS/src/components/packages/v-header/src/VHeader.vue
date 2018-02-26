<template>
	<div class="header">
		<div class="head">
			<div class="title">
				<div class="txt">
					<p class="txt1">{{txt1}}</p>
					<a class="back2Pre">
						<b class="btn" @click.stop="showTip=true">{{back2PreTxt}}</b>
					</a>
					<transition :duration="200" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
						<span class="tip" v-if="showTip">
							<a class="close" title="关闭" @click.stop="showTip=!showTip"></a>
							<span class="t-c">
									{{tipTxt1}}
									<b>{{txt1}}</b>
									{{tipTxt2}}
								</span>
							<a class="know" @click.stop="know">{{knowed}}</a>
						</span>
					</transition>
					<p class="txt2">{{txt2}}</p>
				</div>
			</div>
			<div class="component">
				<a class="option" v-for="(component, index) in components" :style="!isCollection && component.selected&&`color:#ffffff;borderBottom:5px solid #f7ea53`" @click="change(component.name, 1) ">{{component.txt}}
					<span v-if="component.name===`VMy` && liked" class="dot">●</span>
				</a>
				<a class="fb" :href="href" target="_blank">{{feedback}}</a>
				<b v-if="!isCollection" class="back-guide" @click="backGuide">
					<span>{{txt3}}</span>
				</b>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { getOperationFullTime, setStore } from 'utils/index'
	import { fbHref, prePage, restoreOnStartup } from 'config/index'
	export default {
		name: 'VHeader',
		data() {
			return {
				txt1: this.$txt.TXT_1,
				txt2: this.$txt.TXT_2,
				txt3: this.$txt.TXT_3,
				back2PreTxt: this.$txt.TXT_39,
				tipTxt1: this.$txt.TXT_40,
				tipTxt2: this.$txt.TXT_41,
				knowed: this.$txt.TXT_42,
				feedback: this.$txt.TXT_4,
				showTip: false,
				components:
					[
						{name:'VMy',txt:'我的网站',selected:false},
						{name:'VDiscover',txt:'发现网站',selected:false},
					],
			}
		},
		props: {
			isCollection: {
				type: Boolean,
				default: false
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
		mounted(){
			const cname = this.component? this.component: 'VMy'
			!this.isCollection && this.change(cname)
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
				if (this.isCollection) {
					this.$router.push({path: 'home'})
				}
				this.components.forEach((c)=>{
					c.selected = false
					name===c.name && (c.selected = true)
				})
				this.setComponent(name)
				this.liked && name==='VMy' && this.setLike(false)
				type===1&&this.component==='VMy'&&!this.isCollection&&this.$api.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:6,value:0,hotsite:0,url:'',name:''})
				type===1&&this.component==='VMy'&&this.isCollection&&this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:5,name:'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
				type===1&&this.component==='VDiscover'&&this.isCollection&&this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:6,name:'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
			},
			backGuide() {
				this.component==='VDiscover'&&this.$api.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:5,value:0,hotsite:0,url:'',name:''})
				this.component==='VMy'&&this.$api.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:10,url:'',value:0})
				this.$router.push({path: '/guide'})
			},
			know() {
				this.$api.removeWebsiteFlag()
				this.$api.setRestoreOnStartup(restoreOnStartup)
				this.showTip = false
				window.location.href = prePage
//				setStore('WEBSITE', 0)
				this.$api.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:14,url:'',value:0})
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
					background url("../../../../assets/img/head/logo.png") no-repeat
				.txt
					.txt1
						font-size 24px
						color #ffffff
					.txt2
						font-size 14px
						color #a4a4ff
					.back2Pre
						display flex
						position absolute
						top 8px
						right -70px
						text-align center
						font-size 12px
						color #a4a5ff
						z-index 9
						.btn
							width 58px
							height 20px
							box-sizing border-box
							border 1px solid #cdcdde
							&:hover
								background-color #8368f9
								border-color #8368f9
							&:active
								background-color #4f33c7
								border-color #4f33c7
					.tip
						background url("../../../../assets/img/head/tip.png") no-repeat
						position absolute
						top 40px
						left 155px
						width 240px
						height 130px
						font-size 14px
						text-align center
						.t-c
							text-align left
							color #333333
							display inline-block
							position relative
							padding 28px 20px 10px 20px
							b
								font-weight 600
								color #6346de
						.know
							position absolute
							right 25px
							line-height 2
							font-size 12px
							color #fff
							width 64px
							height 24px
							background-color #6346de
							&:hover
								background-color #8368f9
							&:active
								background-color #4f33c7
						.close
							position absolute
							right 0
							margin 15px 10px
							z-index 9
							background url("../../../../assets/img/guide/close.png") no-repeat
							width 10px
							height 10px
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
					background url("../../../../assets/img/head/back-guide.png") no-repeat
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
