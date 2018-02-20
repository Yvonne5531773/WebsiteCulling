<template>
    <div id="loading">
        <div class="loading-con">
            <img src="../../../../assets/svg/puff.svg" />
            <p>{{txt}}</p>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'VLoading',
		data() {
			return {
				txt: this.$txt.TXT_12,
			}
		},
	}
</script>

<style lang="stylus">
    #loading
        text-align center
        position absolute
        left 0
        right 0
        bottom 0
        z-index 1000
        top 120px
        .loading-con
            z-index 10000
            color #6346de
            font-size 14px
            p
                padding-top 30px
            img
                width 75px
        .loading-bg
            background-color #000
            position fixed
            top 0
            left 0
            bottom 0
            right 0
            opacity .2
</style>
