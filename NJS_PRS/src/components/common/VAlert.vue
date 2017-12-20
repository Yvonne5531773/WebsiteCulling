<template>
	<transition name="fade">
		<div style="z-index: 999" v-show="show">
			<div class="alert-frame">
				<div class="alert">
					<div class="head">
						<img src="../../../static/img/alert/alert-logo.png"/>
						<span>{{headtxt}}</span>
						<div class="close" @click="cancel"></div>
					</div>
					<div class="content">
						<img src="../../../static/img/alert/alert-img.png" />
						<div class="txt">
							<p class="content-txt">{{contentxt}}</p>
							<p class="content-tip">( {{tiptxt}} )</p>
						</div>
					</div>
				</div>
				<div class="foot">
					<div class="confirm" @click="confirm">{{confirmtxt}}</div>
					<div class="cancel" @click="cancel">{{canceltxt}}</div>
				</div>
			</div>
			<div class="bkg" @click="cancel"></div>
		</div>
	</transition>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex'
	import {  } from 'service'

	export default {
		data() {
			return {
				headtxt: '猎豹快递管家温馨提示',
				contentxt: '确认移除吗？将不再提示您该快递的进度',
				tiptxt: '移除不会丢失您原网站的订单',
				confirmtxt: '确定',
				canceltxt: '取消',
				show: false,
				item: {},
			}
		},
		watch: {
			alertshow (val) {
				this.item = val.item
				this.show = val.show
			}
		},
		mounted(){
//			this.$store.dispatch('getAlertshow').then(() => {})
		},
		computed: {
			...mapGetters([
				'alertshow',
			]),
		},
		methods: {
			confirm () {
//				this.$store.dispatch('setAlertconfirm', {confirm: true, item: this.item }).then(() => {})
			},
			cancel () {
				this.show = false
//				this.$store.dispatch('setAlertshow', {show: false, item: this.item }).then(() => {})
			},
		}
	}
</script>

<style lang="stylus">
	.fade-enter-active, .fade-leave-active
		transition all .3s ease-in
	.fade-enter, .fade-leave-to
		opacity 0

	.bkg
		position fixed
		top 0
		bottom 0
		left 0
		right 0
		z-index 220
	.alert-frame
		top 0
		bottom 60px
		left 0
		right 0
		margin auto
		background white
		z-index 999
		position fixed
		height 176px
		width 386px
		box-shadow 0 0 45px rgba(0,0,0,0.5)
		.alert
			position relative
			.head
				position relative
				height 32px
				background #ffa002
				.close
					height 32px
					width 32px
					float right
					position relative
					cursor pointer
					background url("../../../static/img/alert/alert-close.png") no-repeat
					&:hover
						background-position -32px
					&:active
						background-position -64px
				img
					position relative
					padding 8px 0 0 8px
				span
					position absolute
					font-size 12px
					color white
					padding 7px
			.content
				img
					padding 16px 24px 0 16px
					float left
				.txt
					position relative
					top 32px
					font-size 14px
					color #a2a2a2
					.content-txt
						color #7d7d7d
		.foot
			margin auto
			left 0
			right 0
			bottom 18px
			width 333px
			position absolute
			font-size 12px
			text-align center
			.confirm
				height 30px
				width 89px
				float right
				position relative
				cursor pointer
				background url("../../../static/img/alert/alert-confirmbtn.png")
				color #ffffff
				line-height 2.4
				&:hover
					background-position -89px
				&:active
					background-position -178px
			.cancel
				height 32px
				width 89px
				right 12px
				float right
				position relative
				cursor pointer
				background url("../../../static/img/alert/alert-cancelbtn.png") no-repeat
				color #a2a2a2
				line-height 2.5
				&:hover
					background-position -89px
					color #ffffff
				&:active
					background-position -178px
					color #ffffff
</style>
