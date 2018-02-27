<template>
	<div class="home">
		<VHeader v-if="info&&info.length>0||store&&store.length>0"></VHeader>
		<keep-alive>
			<component :is="current"></component>
		</keep-alive>
	</div>
</template>
<script>
	import { mapState } from 'vuex'
	import { prePage } from 'config/index'
	import { getStore, removeStore } from 'utils/index'
	export default {
		data() {
			return {
				current: '',
				scrollTop: 0,
				store: [],
				info: []
			}
		},
		watch: {
			component () {
				this.init()
			},
		},
		mounted () {
			this.init()
		},
		computed:{
			...mapState([
				'component',
			])
		},
		methods: {
			async init () {
//				if(this.toPrePage()) return
				this.info = await this.getSelectedInfo()
				this.store = getStore('THEME_IDS')&&getStore('THEME_IDS').split(',')
				if(_.isEmpty(this.info) && _.isEmpty(this.store))
					this.$router.push({path: '/guide'})
				else {
					this.current = this.component
					window.addEventListener('scroll', () => {
						if(document.compatMode === "CSS1Compat") {
							this.scrollTop = document.documentElement.scrollTop
						} else {
							this.scrollTop = document.body.scrollTop
						}
					}, false);
				}
			},
			toPrePage() {
				if(this.$api.getWebsiteFlag()!='1' && this.$api.getWebsiteNewTab()!='1' && getStore('WEBSITE')=='0'){
					window.location.href = prePage
					return true
				}else {
					removeStore('WEBSITE')
				}
				return false
			}
		},
		beforeRouteLeave(to, from, next) {
			this.setPosition({scrolly: window.scrollY, name: this.current})
			next()
		}
	}
</script>

<style lang="stylus" scoped>
	.home
		display flex
		position absolute
		width 100%
		height 100%
		top 0
		bottom 0
		-webkit-box-orient vertical
		-webkit-box-direction normal
		-ms-flex-direction column
		flex-direction column
		-webkit-box-align stretch
		-ms-flex-align stretch
		align-items stretch
		-ms-flex-negative 0
		flex-shrink 0
</style>