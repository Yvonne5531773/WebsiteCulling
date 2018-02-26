<template>
	<div class="collection">
		<VHeader :isCollection="isCollection"></VHeader>
		<keep-alive>
			<component :is="collectionTemplate"></component>
		</keep-alive>
	</div>
</template>
<script>
	import { mapState } from 'vuex'
	import { prePage } from 'config/index'
	export default {
		data() {
			return {
				isCollection: true
			}
		},
		computed:{
			collectionTemplate() {
				return this.$route.query.component
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.collection
		zoom 1
		display -ms-flexbox
		display flex
		-ms-flex-direction column
		flex-direction column
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