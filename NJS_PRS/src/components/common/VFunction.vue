<template>
	<transition
		name="funcTran"
		:duration="duration"
		enter-active-class="animated fadeIn"
		leave-active-class="animated fadeOut">
		<div ref="function" :class="[type===1?'f-flow function':'f-list function']" v-if="show">
			<!--<a class="btn refresh" title="刷新" @click="refresh"></a>-->
			<a class="btn collect" :title="collectTxt" @click="collect"></a>
			<a class="btn back-to-top" @click="backToTop" :title="bttTxt"></a>
		</div>
	</transition>
</template>

<script>
	import { websiteApi } from 'api'
	import { getOperationFullTime } from '../../config/utils'
	export default {
		data() {
			return {
				bttTxt: '返回顶部',
				collectTxt: '加入收藏',
				duration: 300,
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
			categoryId: {},
			scrollEle: {},
		},
		methods: {
			backToTop() {
				this.scrollEle.scrollTop = 0
				websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:11,name:this.categoryId+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
			},
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
