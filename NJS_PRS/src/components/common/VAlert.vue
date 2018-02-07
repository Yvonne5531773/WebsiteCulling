<template>
	<transition name="a-fade">
		<div style="z-index: 999">
			<div class="alert-frame">
				<div class="a-c">
					<img src="../../../static/img/alert/alert.png" />
					<div class="txt">
						<p class="content-tip">{{tiptxt}}</p>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import txt from '../../config/txt'
	export default {
		data() {
			return {
				tiptxt: txt.TXT_5,
			}
		},
		mounted(){

		},
	}
</script>

<style lang="stylus">
	.a-fade-enter-active, .a-fade-leave-active
		transition all .3s ease-in
	.a-fade-enter, .a-fade-leave-to
		opacity 0
	.alert-frame
		top 0
		bottom 60px
		left 0
		right 0
		margin auto
		background #49479d
		z-index 999
		position fixed
		height 88px
		width 210px
		opacity .9
		border-radius 4px
		.a-c
			top 0
			bottom 0
			left 0
			right 0
			margin auto
			position absolute
			height 40px
			text-align center
			width 122px
			img
				float left
			.txt
				float right
				font-size 16px
				color #ffffff
				top 6px
				position relative
</style>
