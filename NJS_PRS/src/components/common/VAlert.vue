<template>
	<transition name="fade">
		<div style="z-index: 999">
			<div class="alert-frame">
				<div class="content">
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
	export default {
		data() {
			return {
				tiptxt: '添加成功',
			}
		},
		mounted(){

		},
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
		background #49479d
		z-index 999
		position fixed
		height 88px
		width 210px
		opacity .9
		border-radius 4px
		.content
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			position: absolute;
			height: 40px;
			text-align: center;
			width 122px
			img
				/*padding 16px 24px 0 16px*/
				float left
			.txt
				float right
				font-size 16px
				color #ffffff
				top 6px
				position relative
</style>
