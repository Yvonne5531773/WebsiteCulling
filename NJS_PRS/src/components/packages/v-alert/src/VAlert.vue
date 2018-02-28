<template>
	<!--<transition name="a-fade">-->
	<div class="alert-frame">
		<div class="a-c">
			<img src="../../../../assets/img/alert/alert.png" />
			<div class="txt">
				<p class="content-tip">{{tiptxt}}</p>
			</div>
		</div>
	</div>
	<!--</transition>-->
</template>

<script>
	export default {
		name: 'VAlert',
		data() {
			return {
				tiptxt: this.$txt.TXT_5,
			}
		}
	}
</script>

<style lang="stylus">
	.alert-frame
		position fixed
		top 0
		bottom 60px
		left 0
		right 0
		margin auto
		background #49479d
		height 88px
		width 210px
		z-index 999
		opacity .9
		.a-c
			position absolute
			top 0
			bottom 0
			left 0
			right 0
			margin auto
			width 122px
			height 40px
			text-align center
			img
				float left
			.txt
				position relative
				top 7px
				right 10px
				float right
				font-size 16px
				color #ffffff
				.content-tip
					font-weight 100
</style>
