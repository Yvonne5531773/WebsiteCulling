<template>
	<div class="v-resource-box" @click="destory">
		<section class="box-content">
			<VBack></VBack>
			<div class="f-l">
				<VCategoryFrame :category="category"></VCategoryFrame>
			</div>
			<div class="f-r">
				<div class="search">
					<input type="text" class="input" placeholder="" v-model='inputText'>
					<!--<input type="text" class="input" placeholder="" v-model='inputText' @keyup='show($event)' @keydown.down='down()' @keydown.up.prevent='up()' @focus="focusInput" @blur="blurInput">-->
					<span class="btn" @click="goto()">
						<input type="submit" :value="btnTxt">
			    </span>
				</div>
				<!--<ul class="search-tips" v-show="focus">-->
					<!--<li v-for="(item, index) in result" :class='{bgcolor: index==nowIndex}' @click="goItem(item)">-->
						<!--{{item}}-->
					<!--</li>-->
				<!--</ul>-->
				<keep-alive>
					<component ref="resource" :is="resourceTemplate" :resources="resources" :inputText="inputText" :tpid="tpid" :mThunderEncode="mThunderEncode"></component>
				</keep-alive>
				<!--<VHotresource ref="rHotresource" :resources="resources"></VHotresource>-->
			</div>
		</section>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { thunderPid } from 'config/index'
	import { resourceMock } from 'mock/resource'
	export default {
		name: 'VResourcebox',
		data() {
			return {
				category: {},
				resources: [],
				inputText: '',
				btnTxt: this.$txt.TXT_44,
				text: '',
				nowIndex: -1,
				result: [],
				focus: false,
			}
		},
		computed: {
			...mapState([
				'resourceTemplate'
			]),
			categoryid() {
				return this.$route.query.categoryid || ''
			},
			tpid() {
				return thunderPid
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			async init() {
				this.category = await this.constructCategory(this.categoryid)
				this.resources = resourceMock[0].resources
				_.forEach(this.resources, item => {
					item.actors = item.actors.join(' & ')
				})
//				this.$api.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte', {
//					action: 1,
//					name: this.category.name,
//					url: ''
//				})
			},
			destory() {
				if(this.resourceTemplate !== 'VHotresource') return
				const hrEl = this.$refs.resource
				hrEl.destoryMenu()
			},
			goto() {
				this.inputText==='' && this.setResourceTemplate('VHotresource')
				this.inputText!=='' && this.setResourceTemplate('VSearchresult')
			},
			mThunderEncode(src) {
				return ThunderEncode(src)
			}
//			show(ev) {
//				if (ev.keyCode === 38 || ev.keyCode === 40) {
//					if (this.nowIndex < -1) {
//						return
//					}
//					if (this.nowIndex !== this.result.length && this.nowIndex !== -1) {
//						this.inputText = this.result[this.nowIndex];
//					}
//					return
//				}
//				if(ev.keyCode === 13) {
//					console.log('ev.keyCode === 13')
//					this.inputText = ''
//				}
//				this.text = this.inputText;
//				this.result = []
//			},
//			goItem(item) {
//				console.log('goItem item', item)
//			},
//			down() {
//				this.nowIndex++;
//				if (this.nowIndex === this.result.length) {
//					this.nowIndex = -1;
//					this.inputText = this.text;
//				}
//			},
//			up() {
//				this.nowIndex--;
//				if (this.nowIndex < -1) {
//					this.nowIndex = -1;
//					return;
//				}
//				if (this.nowIndex === -1) {
//					this.nowIndex = this.result.length;
//					this.inputText = this.text;
//				}
//			},
//			focusInput() {
//				this.focus = true
//			},
//			blurInput() {
//				setTimeout(() => {
//					this.focus = false
//				}, 100)
//			}
		},
	}
</script>

<style lang="stylus" scoped>
	.box-content
		display flex
		position relative
		margin 142px auto
		width 1040px
		.back
			position absolute
			top -54px
			left -12px
		.f-l
			position relative
			width 240px
		.f-r
			width 761px
			float left
			left 40px
			position relative
			h2
				border-bottom 2px solid #e1e0e8
				font-size 18px
				color #5454a6
				height 36px
			.search
				display flex
				.input
					border 1px solid #6345de
					padding-left 5px
					padding-right 10px
					width 622px
					height 38px
					text-indent 4px
				.btn
					input
						border none
						height 40px
						width 140px
						letter-spacing 1px
						color #fff
						background #6345de
						font-size 14px
						cursor pointer
						&:hover
							background #8368f9
						&:active
							background #4f33c7
			.search-tips
				position absolute
				left 273px
				margin auto
				margin-top 1px
				z-index 100
				width 497px
				background #fff
				li
					margin-top 5px
					padding 8px
					cursor pointer
					list-style none
					&:hover
						background #ccc
				.bgcolor
					background #ccc
</style>