<template>
	<div class="v-banner">
		<img class="banner-i" src="../../../static/img/flow/banner-65.png"/>
		<div class="title">
			<a class="back" @click="$emit('back')">
				{{backTxt}}
			</a>
			<span class="name">{{category.name}}</span>
			<div class="add" :style="category.collected&&`backgroundPosition:-540px`" @click="$emit('collect')" v-if="category.id!==`0099`">
				<img src="../../../static/img/favorite/start.png" />
				<span v-if="category.collected">{{collectTxt}}</span>
				<span v-else>{{noCollectTxt}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				noCollectTxt: '加入收藏',
				collectTxt: '取消收藏',
				backTxt: '返回',
			}
		},
		props: {
			category: {
				type: Object
			}
		},
	}
</script>

<style lang="stylus">
	.v-banner
		position relative
		top 85px
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
			.back
				background url("../../../static/img/flow/back.png") no-repeat
				width 96px
				height 56px
				top 23px
				left -13px
				position absolute
				font-size 12px
				color #fff
				line-height 3.6
				text-align center
				padding-left 3px
				&:hover
					background-position -96px
				&:active
					background-position -192px
			.name
				position absolute
				bottom 20px
			.add
				background url("../../../static/img/favorite/add.png") no-repeat
				width 270px
				height 77px
				cursor pointer
				right -10px
				top 48px
				margin auto
				position absolute
				text-align center
				line-height 1.8
				&:hover
					background-position -270px
				&:active
					background-position -540px
				img
					position relative
					top 4px
				span
					font-size 16px
					padding-right 7px
</style>
