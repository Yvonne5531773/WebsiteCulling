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
			width 1100px
			margin auto
			height 140px
			font-size 30px
			color #fff
			position relative
			z-index 2
			.name
				position absolute
				bottom 20px
			.collect-btn
				right -16px
				top 57px
				margin auto
				position absolute
				text-align center
				.add
					line-height 1.7
</style>
