<template>
	<div>
		<transition
			name="funcTran"
			:duration="duration"
			enter-active-class="animated fadeIn"
			leave-active-class="animated fadeOut">
			<div :class="[type===1?'f-flow function':'f-list function']" v-if="show">
				<!--<a class="btn refresh" title="刷新" @click="refresh"></a>-->
				<a v-if="!category.collected" class="btn collect" :title="collectTxt" @click="collect"></a>
				<a class="btn back-to-top" @click="backToTop" :title="bttTxt"></a>
			</div>
		</transition>
		<VAlert v-if="showAlert"></VAlert>
	</div>
</template>

<script>
	import { getOperationFullTime } from 'utils/index'
	export default {
		name: 'VFunction',
		data() {
			return {
				bttTxt: this.$txt.TXT_11,
				collectTxt: this.$txt.TXT_8,
				duration: 300,
				collectAlertSTO: {},
				showAlert: false,
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
			category: {
				type: Object
			},
			scrollEle: {},
		},
		created() {
			window.onscroll = () => {
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
				this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:7,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
			},
			collect() {
				!this.category.collected && (this.showAlert = true,
					this.collectAlertSTO = setTimeout( () => {
						this.showAlert = false
					}, 1200))
				this.category.collected && this.collectAlertSTO && (this.showAlert = false, clearTimeout(this.collectAlertSTO))
				this.category.collected = !this.category.collected
				this.saveForm(this.category)
				this.category.collected && this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:4,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
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
			background url("../../../../assets/img/common/refresh.png") no-repeat
		.collect
			background url("../../../../assets/img/common/collect.png") no-repeat
		.back-to-top
			background url("../../../../assets/img/common/backToTop.png") no-repeat
			margin-top 10px
	.f-flow
		right 4.2%
	.f-list
		left 47.2%
		@media screen and (max-width 1165px)
			left 40.2%
</style>
