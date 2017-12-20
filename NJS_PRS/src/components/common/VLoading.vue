<template>
    <div id="loading">
        <div class="loading-con">
            <img src="../../assets/puff.svg" />
            <p>{{txt}}</p>
        </div>
        <div class="loading-bg"></div>
    </div>
</template>

<script>
	export default {

		data() {
			return {
				txt: '搜索中，请稍后',
			}
		},

		components: {

		}
	}
</script>

<style lang="stylus">
    #loading
        text-align center
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        z-index 1000
        display none
        .loading-con
            z-index 10000
            position fixed
            top 50%
            margin-top -60px
            color #fff
            font-size 14px
            left 50%
            margin-left -50px
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
