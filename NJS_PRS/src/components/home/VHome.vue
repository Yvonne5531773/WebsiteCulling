<template>
	<div class="home">
		<VHeader v-if="info&&info.length>0||store&&store.length>0"></VHeader>
		<keep-alive>
			<component :is="current"></component>
		</keep-alive>
	</div>
</template>
<script>
	import VHeader from 'components/common/VHeader'
	import VDiscover from 'components/home/VDiscover'
	import VMy from 'components/home/VMy'
	import { mapState, mapMutations } from 'vuex'
	import { service } from 'components/common/mixin'
	import { getStore } from '../../config/utils'

	export default {
		data() {
			return {
				current: '',
				scrollTop: 0,
				store: [],
				info: []
			}
		},
		mixins: [service],
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
				'position'
			])
		},
		methods: {
			...mapMutations(['SAVE_POSITION']),
			async init () {
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
		},
		components: {
			VHeader,
			VDiscover,
			VMy
		},
		beforeRouteLeave(to, from, next) {
			this.SAVE_POSITION({scrolly: window.scrollY, name: this.current})
			next()
		}
	}
</script>

<style lang="stylus" scoped>
	.home
		zoom 1
		display flex
		-webkit-box-orient vertical
		-webkit-box-direction normal
		-ms-flex-direction column
		flex-direction column
		-webkit-box-align stretch
		-ms-flex-align stretch
		align-items stretch
		-ms-flex-negative 0
		flex-shrink 0
		width 100%
		height 100%
		top 0
		bottom 0
		position absolute
</style>