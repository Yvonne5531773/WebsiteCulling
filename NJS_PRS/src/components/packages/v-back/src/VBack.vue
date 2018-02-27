<template>
	<a class="back" @click="back">
		{{backTxt}}
	</a>
</template>

<script>
	import { getOperationFullTime } from 'utils/index'
	export default {
		name: 'VBack',
		data() {
			return {
				backTxt: this.$txt.TXT_10,
			}
		},
		methods: {
			back() {
				const cname = 'VPublic',
					path = 'home'
				this.$router.push({path: path})
				this.setComponent(cname)
				this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int', {
					action: 6,
					name: '',
					url: '',
					action_time: getOperationFullTime(new Date()),
					number1: 0,
					number2: 0
				})
			}
		}
	}
</script>

<style lang="stylus">
	.back
		position absolute
		top 23px
		left -13px
		padding-left 3px
		background url("../../../../assets/img/collection/back.png") no-repeat
		width 96px
		height 56px
		color #fff
		text-align center
		font-size 12px
		line-height 3.6
		&:hover
			background-position -96px
		&:active
			background-position -192px
</style>
