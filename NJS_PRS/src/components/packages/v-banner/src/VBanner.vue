<template>
	<div class="v-banner">
		<img class="banner-i" :src="category.banner"/>
		<div class="title">
			<VBack></VBack>
			<span class="name">{{category.name}}</span>
			<div class="collect-btn">
				<VCollect :category="category"></VCollect>
			</div>
		</div>
	</div>
</template>

<script>
	import { getOperationFullTime } from 'utils/index'
	export default {
		name: 'VBanner',
		props: {
			category: {
				type: Object
			}
		}
	}
</script>

<style lang="stylus">
	.v-banner
		position relative
		background-color black
		.banner-i
			position absolute
			opacity 0.5
			z-index 1
		.title
			position relative
			margin auto
			width 1100px
			height 140px
			font-size 30px
			color #fff
			z-index 2
			.name
				position absolute
				bottom 20px
			.collect-btn
				position absolute
				right -16px
				top 57px
				margin auto
				text-align center
				.add
					line-height 1.7
</style>
