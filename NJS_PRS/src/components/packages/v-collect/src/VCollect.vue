<template>
	<div class="add" :style="category.collected&&`backgroundPosition:-540px`" @click="collect" v-if="category.id!==`0099`">
		<img class="a-i" src="../../../../assets/img/collection/start.png" />
		<span v-if="category.collected">{{collectTxt}}</span>
		<span v-else>{{noCollectTxt}}</span>
		<VAlert v-if="showAlert"></VAlert>
	</div>
</template>

<script>
	import { getOperationFullTime } from 'utils/index'
	export default {
		name: 'VCollect',
		data() {
			return {
				noCollectTxt: this.$txt.TXT_8,
				collectTxt: this.$txt.TXT_9,
				collectAlertSTO: {},
				showAlert: false,
			}
		},
		props: {
			category: {
				type: Object
			}
		},
		methods: {
			collect() {
				!this.category.collected && (this.showAlert = true,
					this.collectAlertSTO = setTimeout(() => {
						this.showAlert = false
					}, 1200))
				this.category.collected && this.collectAlertSTO && (this.showAlert = false, clearTimeout(this.collectAlertSTO))
				this.category.collected = !this.category.collected
				this.saveForm(this.category)
				this.category.collected && this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int', {
					action: 4,
					name: this.category.id + '',
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
	.add
		position relative
		background url("../../../../assets/img/collection/add.png") no-repeat
		line-height 4.6
		width 270px
		height 77px
		color #fff
		cursor pointer
		&:hover
			background-position -270px
		&:active
			background-position -540px
		.a-i
			position relative
			top 4px
		span
			padding-right 7px
			font-size 16px
			font-weight 100
</style>
