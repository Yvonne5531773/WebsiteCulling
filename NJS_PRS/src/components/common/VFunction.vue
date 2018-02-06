<template>
	<transition
		name="funcTran"
		:duration="duration"
		enter-active-class="animated fadeIn"
		leave-active-class="animated fadeOut">
		<div ref="function" class="function" v-if="show">
			<!--<a class="btn refresh" title="刷新" @click="refresh"></a>-->
			<a :class="[type===1?'btn b-flow back-to-top':'btn b-list back-to-top']" @click="backToTop" :title="bttTxt"></a>
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
				duration: 300,
			}
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			categoryId: {
				type: Number
			},
			type: {
				type: Number
			},
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
		.btn
			width 48px
			height 48px
			position fixed
			bottom 36px
			margin-left 588px
		.b-flow
			right 4.2%
		.b-list
			left 47.2%
			@media screen and (max-width 1165px)
				left 40.2%
		.refresh
			background url("../../../static/img/list/refresh.png") no-repeat
		.back-to-top
			background url("../../../static/img/list/backToTop.png") no-repeat
			margin-top 58px
</style>
