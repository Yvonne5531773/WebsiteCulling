<template>
	<div class="my">
		<section class="container">
			<div class="containerRow">

			</div>
		</section>
	</div>
</template>
<script>
	import {  } from 'service'
	import { mockData } from '../../mock/data'

	export default {
		data() {
			return {

			}
		},
		mounted() {

		},
		watch: {

		},
		computed: {

		},
		methods: {


		},
		components: {

		}
	}
</script>

<style lang="stylus" scoped>
	.my
		zoom 1
		display flex
		.container
			margin 112px auto
			width 1098px
			.containerRow
				margin 0 auto
				width 882px
				float left
				.head
					position relative
					height 24px
					white-space nowrap
					.left
						float left
						.circle
							background url("../../../static/img/home/circle.png") no-repeat
							width 20px
							height 20px
							float left
							margin 3px 5px 0 0
						.head-t
							float left
							vertical-align middle
							display inline-block
							font-size 18px
							line-height 24px
							color #5454a6
							a
								color #5454a6
							h2
								font-size 18px!important
								line-height 24px
								font-weight normal
					.right
						float right
						position relative
						right 70px
						top 8px
						cursor pointer
						span
							position relative
							font-size 12px
							color #333333
							bottom .5em
							right 5px
						.pull
							float right
							width 13px
							height 15px
							position relative
							cursor pointer
							background url("../../../static/img/home/pull.png") no-repeat
				.body
					max-height 365px
					overflow hidden
					&:after
						content ''
						display block
						visibility hidden
						height 0
						clear both
						font-size 0
					.list
						padding-top 26px
						overflow hidden
						li
							float left
							list-style none
							margin 20px 28px 26px 10px
							width 242px
							height 314px
							text-align center
							color gray
							-webkit-box-sizing border-box
							box-sizing border-box
							-webkit-box-shadow 0 8px 18px rgba(0,0,0,.06)
							box-shadow 0 8px 18px rgba(0,0,0,.06)
							background #fff
							font-size 14px
							position relative
							border-radius 4px
							margin-top 0
							&:nth-child(4n - 3)
								/*margin-left 18px*/
							&:nth-child(-n + 4)
								margin-top 0
</style>