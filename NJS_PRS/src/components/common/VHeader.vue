<template>
	<div class="h-center">
		<img class="top" src="../../../static/img/head/top.png" />
		<div class="head">
			<div class="title">
				<i class="img"></i>
				<div class="txt">
					<p class="txt1">{{txt1}}</p>
					<p class="txt2">{{txt2}}</p>
				</div>
			</div>
			<div class="component">
				<a v-for="(component, index) in components" :style="!favoritePage && component.selected&&`color:#ffffff;borderBottom:5px solid #a4a4ff`" @click="change(component.name)">{{component.txt}}</a>
				<b v-if="!favoritePage" class="back-guide" @click="$router.push({path: '/'})"></b>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import _ from 'lodash'
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
			favoritePage: {
				type: Boolean
			}
		},
		mounted(){
			const cname = this.component? this.component:_.find(this.components, {selected: true}).name
			!this.favoritePage && this.change(cname)
		},
		watch: {

		},
		methods: {
			...mapMutations(['SET_COMPONENT']),
			change (name) {
				if (this.favoritePage) {
					this.$router.push({path: 'home'})
				}
				this.components.forEach((c)=>{
					c.selected = false
					name===c.name && (c.selected = true)
				})
				this.SET_COMPONENT({component: name})
			},
		},
		computed:{
			...mapState([
				'component'
			])
		},
	}
</script>

<style lang="stylus">
	.h-center
		z-index 199
		width 100%
		height 85px
		left 0
		position fixed
		transition .2s height
		background-size 100% 110%
		transform translateZ(0)
		background #5454a6
		.top
			position absolute
		.head
			position relative
			margin 0 auto
			max-width 1120px
			min-width 1060px
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
					margin 33px 30px 0 28px
					height 47px
					color #a4a4ff
					display inline-block
				.back-guide
					background url("../../../static/img/head/back-guide.png") no-repeat
					width 84px
					height 34px
					position absolute
					cursor pointer
					right 0
					margin 30px 0 0 0
					&:hover
						background-position -84px
					&:active
						background-position -168px
</style>
