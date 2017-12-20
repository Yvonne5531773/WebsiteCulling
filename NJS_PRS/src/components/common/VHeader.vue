<template>
	<div class="h-center">
		<div class="head">
			<div class="title">
				<i class="img"></i>
				<div class="txt">
					<p class="txt1">{{txt1}}</p>
					<p class="txt2">{{txt2}}</p>
				</div>
			</div>
			<div class="component">
				<a v-for="(component, index) in components" :style="component.selected&&`color:#ffffff;borderBottom:5px solid #a4a4ff`" @click="change(component.name)">{{component.txt}}</a>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex'
	import {  } from 'service'
	export default {
		data() {
			return {
				txt1: '猎豹网址精选',
				txt2: '新一代智能网址导航',
				components:
					[
						{name: 'VMy',txt:'我的网站', selected: false},
						{name: 'VDiscover', txt: '发现网站', selected: true},
					],
			}
		},
		props: {

		},
		mounted(){
			console.log('head mount')
			this.change(_.find(this.components, {selected: true}).name)
		},
		watch: {

		},
		methods: {
			...mapMutations(['SET_COMPONENT']),
			change (name) {
				this.components.forEach((c)=>{
					c.selected = false
					name===c.name && (c.selected = true)
				})
				console.log('head change name', name)
				this.SET_COMPONENT({component: name})
			}
		},
	}
</script>

<style lang="stylus">
	.h-center
		z-index 99
		width 100%
		height 85px
		left 0
		position fixed
		transition .2s height
		background-size 100% 110%
		transform translateZ(0)
		background #5454a6
		.head
			position relative
			margin 0 auto
			max-width 1105px
			min-width 700px
			height 85px
			.title
				top 14px
				position relative
				.img
					position absolute
					width 60px
					height 60px
					background url("../../../static/img/head/logo.png") no-repeat
				.txt
					position absolute
					left 80px
					.txt1
						font-size 24px
						color #ffffff
					.txt2
						font-size 14px
						color #a4a4ff
			.component
				text-align center
				left 0
				right 0
				top 0
				bottom 0
				margin auto
				position absolute
				a
					font-size 18px
					margin 28px
					height 52px
					color #a4a4ff
					display inline-block
					/*border-bottom 5px solid #a4a4ff*/
</style>
