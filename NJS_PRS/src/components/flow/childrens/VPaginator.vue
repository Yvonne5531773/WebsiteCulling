<template>
  <div class="paginator" @mouseenter="enterAndLeave(1)" @mouseleave="enterAndLeave(0)">
    <div v-show="index > 0" ref="arrowLeft" class="arrow left" @click.stop="left"></div>
    <div class="thumbnail-wrapper" v-for="(item, i) in activeImages" :key="item.index" @click.stop="setActive(item.index-1)">
      <div :class="{'thumbnail active': item&&item.isActive, 'thumbnail': item&&!item.isActive}" :style="{backgroundImage:'url('+item.src+')'}" v-if="!isMove"></div>
    </div>
    <div v-show="index < (images.length - showCount)" ref="arrowRight" class="arrow right" @click.stop="right"></div>
  </div>
</template>

<script type="text/ecmascript-6">
	import Velocity from 'velocity-animate/velocity.min'
	import { websiteApi } from 'api'
	import { getOperationFullTime } from '../../../config/utils'
	export default {
		data () {
			return {
				index: 0,
				isMove: false,
				showCount: 7,
				screenWidth: document.body.clientWidth
			}
		},
		props: {
			images: Array,
			activeIndex: Number,
			category: Object
		},
		computed: {
			activeImages () {
				return this.images.slice(this.index, this.index + this.showCount)
			}
		},
		mounted () {
			this.init()
		},
		watch: {
			activeIndex () {
				this.index = this.setIndex(this.activeIndex)
				this.setActive(this.activeIndex)
			},
			screenWidth (val) {
				this.screenWidth = val
				this.showCount = this.doScreen()
			},
			images() {
				this.init()
      }
		},
		methods: {
			init () {
				this.index = this.setIndex(this.activeIndex)
				this.setActive(this.activeIndex)
				const that = this
				window.onresize = () => {
					return (() => {
						window.screenWidth = document.body.clientWidth
						that.screenWidth = window.screenWidth
					})()
				}
				this.showCount = this.doScreen()
			},
			setIndex (idx) {
				if ((idx <= this.images.length - (Math.floor(this.showCount/2)+1)) && (idx >= Math.floor(this.showCount/2))) {
					return idx - Math.floor(this.showCount/2)
				} else if (idx < Math.floor(this.showCount/2)) {
					return 0
				} else {
					return this.images.length - this.showCount
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
      doScreen() {
	      return this.screenWidth>1687? 11:(this.screenWidth>1409? 9:7)
      },
      left() {
	      this.index -= 1
	      if(this.index < (this.images.length - this.showCount)) {
		      const arrowRight = this.$refs.arrowRight
		      arrowRight && Velocity(arrowRight,{opacity: 1},{duration:200})
	      }
	      websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:13,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
      },
			right() {
				this.index += 1
        if(this.index > 0) {
	        const arrowLeft = this.$refs.arrowLeft
	        arrowLeft && Velocity(arrowLeft,{opacity: 1},{duration:200})
        }
				websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:12,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
			}
		},
		components: {

		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .paginator
    width 520px
    overflow hidden
    position relative
    left 0
    top 10px
    text-align center
    margin 0 auto
    @media screen and (min-width:1409px)
      width 640px
    @media screen and (min-width:1687px)
      width 770px
    .arrow
      display inline-block
      position absolute
      vertical-align top
      height 24px
      width 24px
      top 14px
      cursor pointer
      opacity 0
      &.left
        background url("../../../../static/img/flow/arrow-left-small.png") no-repeat
        left 0
        &:hover
          background-position -24px
        &:active
          background-position -48px
      &.right
        background url("../../../../static/img/flow/arrow-right-small.png") no-repeat
        right 10px
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
