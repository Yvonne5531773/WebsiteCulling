<template>
	<transition
		name="funcTran"
		:duration="duration"
		enter-active-class="animated fadeIn"
		leave-active-class="animated fadeOut">
		<div ref="function" :class="[type===1?'f-flow function':'f-list function']" v-if="show">
			<!--<a class="btn refresh" title="刷新" @click="refresh"></a>-->
			<a v-if="!category.collected" class="btn collect" :title="collectTxt" @click="collect"></a>
			<a class="btn back-to-top" @click="backToTop" :title="bttTxt"></a>
		</div>
	</transition>
</template>

<script>
	import { websiteApi } from 'api'
	import { getOperationFullTime } from '../../config/utils'
	import txt from '../../config/txt'
	export default {
		data() {
			return {
				bttTxt: txt.TXT_11,
				collectTxt: txt.TXT_8,
				duration: 300,
//				scrollVal: 0,
			}
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			type: {
				type: Number
			},
			collect: {
				type: Function
			},
			category: {
				type: Object
			},
			scrollEle: {},
		},
		created() {
			window.onscroll = ()=>{
				return (() => {
					this.scrollVal = this.getScrollTop() + this.getWindowHeight()
				})()
			};
		},
		watch: {
			scrollVal(val) {
//				this.scrollVal = val
//				console.log('in watch scrollVal', this.scrollVal)
//				if(this.scrollVal === this.getScrollHeight()){
//					setTimeout(()=>{
//						this.show = true
//					}, 200)
//				}
//				if(this.scrollVal < this.getScrollHeight()){
//					this.show = false
//				}
			}
		},
		methods: {
			backToTop() {
				this.scrollEle.scrollTop = 0
				websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:7,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
			},
			getScrollTop(){
				let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
				if(document.body){
					bodyScrollTop = document.body.scrollTop;
				}
				if(document.documentElement){
					documentScrollTop = document.documentElement.scrollTop;
				}
				scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
				return scrollTop;
			},
			getScrollHeight(){
				let scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
				if(document.body){
					bodyScrollHeight = document.body.scrollHeight;
				}
				if(document.documentElement){
					documentScrollHeight = document.documentElement.scrollHeight;
				}
				scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
				return scrollHeight;
			},
			getWindowHeight(){
				let windowHeight = 0;
				if(document.compatMode === "CSS1Compat"){
					windowHeight = document.documentElement.clientHeight;
				}else{
					windowHeight = document.body.clientHeight;
				}
				return windowHeight;
			}
		}
	}
</script>

<style lang="stylus">
	.function
		display flex
		flex-direction column
		position fixed
		bottom 36px
		margin-left 588px
		.btn
			width 48px
			height 48px
		.refresh
			background url("../../../static/img/common/refresh.png") no-repeat
		.collect
			background url("../../../static/img/common/collect.png") no-repeat
		.back-to-top
			background url("../../../static/img/common/backToTop.png") no-repeat
			margin-top 10px
	.f-flow
		right 4.2%
	.f-list
		left 47.2%
		@media screen and (max-width 1165px)
			left 40.2%
</style>
