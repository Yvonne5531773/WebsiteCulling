<template>
  <div class="paginator" @mouseenter="enterAndLeave(1)" @mouseleave="enterAndLeave(0)">
    <div v-if="index > 0" ref="arrowLeft" class="arrow left" @click.stop="index -= 1"></div>
    <div class="thumbnail-wrapper" v-for="(item, i) in activeImages" :key="item.index" @click.stop="setActive(item.index-1)">
      <div :class="{'thumbnail active': item&&item.isActive, 'thumbnail': item&&!item.isActive}" :style="{backgroundImage:'url('+item.src+')'}" v-if="!isMove"></div>
    </div>
    <div v-if="index < (images.length - 5)" ref="arrowRight" class="arrow right" @click.stop="index += 1"></div>
  </div>
</template>

<script type="text/ecmascript-6">
	import icon from 'components/common/icon'
	import Velocity from 'velocity-animate/velocity.min'

	export default {
		props: {
			images: Array,
			activeIndex: Number
		},
		data () {
			return {
				index: 0,
				isMove: false,
			}
		},
		computed: {
			activeImages () {
				return this.images.slice(this.index, this.index + 5)
			}
		},
		mounted () {
			this.index = this.setIndex(this.activeIndex)
			this.setActive(this.activeIndex)
		},
		watch: {
			activeIndex () {
				console.log('watch activeIndex')
				this.index = this.setIndex(this.activeIndex)
				this.setActive(this.activeIndex)
			}
		},
		methods: {
			setIndex (idx) {
				if ((idx <= this.images.length - 3) && (idx >= 2)) {
					return idx - 2
				} else if (idx < 2) {
					return 0
				} else {
					return this.images.length - 5
				}
			},
			setActive (idx) {
				if(_.isEmpty(this.images)) return
				if (idx !== this.activeIndex) {
					this.$emit('changeIndex', idx)
				}
				this.isMove = true
				this.images.forEach((item) => {
					item.isActive = false
				})
				this.images[idx].isActive = true
				this.isMove = false
			},
			enterAndLeave(opacity) {
				const arrowRight = this.$refs.arrowRight,
					arrowLeft = this.$refs.arrowLeft
				arrowRight && Velocity(arrowRight,{opacity: opacity},{duration:200})
				arrowLeft && Velocity(arrowLeft,{opacity: opacity},{duration:200})
			},
		},
		components: {
			icon,
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .paginator
    /*width 964px*/
    overflow hidden
    position relative
    left 0
    top 10px
    text-align center
    margin 0 auto
    .arrow
      display inline-block
      position relative
      vertical-align top
      height 24px
      width 24px
      top 15px
      cursor pointer
      opacity 0
      &.left
        background url("../../../../static/img/flow/arrow-left-small.png") no-repeat
        right 30px
        &:hover
          background-position -24px
        &:active
          background-position -48px
      &.right
        background url("../../../../static/img/flow/arrow-right-small.png") no-repeat
        left 20px
        &:hover
          background-position -24px
        &:active
          background-position -48px
    .thumbnail-wrapper
      display inline-block
      .thumbnail
        display inline-block
        margin-right 10px
        height 50px
        width 50px
        background-position bottom
        background-size cover
        box-shadow inset 0 0 0 1px hsla(0,0%,100%,.2)
        opacity 0.2
        cursor pointer
        overflow hidden
        object-fit cover
        &.active
          opacity 1
          box-shadow inset 0 0 0 2px #fff
</style>
