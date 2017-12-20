<template>
	<div class="favorite-page">
		<VHeader></VHeader>
		<section class="detail">

		</section>
	</div>
</template>

<script>
	import VHeader from 'components/common/VHeader'

	export default {
		data () {
			return {
				defaultImg: '',
			}
		},
		props: {
			item: {
				type: Object
			}
		},
		mounted () {
			console.log('id', decodeURIComponent(this.$route.query.id))
		},
		components: {
			VHeader,
		}
	}
</script>

<style lang="stylus" scoped>

</style>