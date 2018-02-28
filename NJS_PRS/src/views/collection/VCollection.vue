<template>
	<div class="collection">
		<VHeader :isCollection="isCollection"></VHeader>
		<keep-alive>
			<component :is="collectionTemplate"></component>
		</keep-alive>
	</div>
</template>
<script>
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
		display -ms-flexbox
		display flex
		position absolute
		width 100%
		height 100%
		top 0
		bottom 0
		-ms-flex-direction column
		flex-direction column
		-ms-flex-align stretch
		align-items stretch
		-ms-flex-negative 0
		flex-shrink 0
</style>