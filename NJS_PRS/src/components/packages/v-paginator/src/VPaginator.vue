<template>
  <div v-if="!isFullScreen" class="paginator" @mouseenter="enterAndLeave(1)" @mouseleave="enterAndLeave(0)">
    <section class="info" v-if="images[index]">
      <b>本页内容来自 </b>
      <a :href="images[index].host" target="_blank" class="from center-to-head" @click.stop="open(2)">{{images[index].from}}</a>
      <a :href="images[index].url" target="_blank" class="center-to-head" @click.stop="open(1)" style="margin-bottom:40px">{{images[index].title | clip(80)}}</a>
      <div class="button">
        <a v-if="!isFullScreen" class="btn full" @click.stop="full">
          <span>{{fullTxt}}</span>
        </a>
        <a class="btn like" :style="images[index].liked&&`backgroundPosition:-180px`" @click.stop="like(images[index])">
          <span v-if="images[index].liked" :style="">{{likedTxt}}</span>
          <span v-else>{{nolikedTxt}}</span>
        </a>
      </div>
      <div class="image">
        <div class="thumbnail-wrapper" v-for="(item, i) in activeImages" :key="item.index" @click.stop="setActive(item.index-1)">
          <div :class="{'thumbnail active': item&&item.isActive, 'thumbnail': item&&!item.isActive}" :style="{backgroundImage:'url('+item.src+')'}" v-if="!isMove && !gif"></div>
          <div v-else="!isMove" v-lazy:background-image="item.lazy" :class="{'thumbnail active': item&&item.isActive, 'thumbnail': item&&!item.isActive}"></div>
        </div>
      </div>
    </section>
    <div class="bottom">
      <span>{{tipTxt}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
	import { getOperationFullTime } from 'utils/index'
	export default {
		name: 'VPaginator',
		data() {
			return {
				index: 0,
				isMove: false,
//				showCount: 3,
				nolikedTxt: this.$txt.TXT_14,
				likedTxt: this.$txt.TXT_15,
				fullTxt: this.$txt.TXT_17,
				tipTxt: this.$txt.TXT_18,
				isFullScreen: document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen,
//				screenWidth: document.body.clientWidth
			}
		},
		created() {
			const that = this
			document.addEventListener('webkitfullscreenchange', () => {
				that.isFullScreen = !that.isFullScreen
				this.setFullScreen(that.isFullScreen)
			})
		},
		props: {
			images: Array,
			activeIndex: Number,
			category: Object,
			gif: Boolean
		},
		computed: {
			activeImages() {
				return this.images.slice(this.index, this.index + this.showCount)
			},
			showCount() {
				return this.gif ? 3 : 9
			}
		},
		mounted() {
			this.init()
		},
		watch: {
			activeIndex() {
				this.index = this.setIndex(this.activeIndex)
				this.setActive(this.activeIndex)
			},
//			screenWidth (val) {
//				this.screenWidth = val
//				this.showCount = this.doScreen()
//			},
			images() {
				this.init()
			},
			isFullScreen() {
				this.setFullScreen(this.isFullScreen)
			}
		},
		methods: {
			init() {
				this.index = this.setIndex(this.activeIndex)
				this.setActive(this.activeIndex)
//				const that = this
//				window.onresize = () => {
//					return (() => {
//						window.screenWidth = document.body.clientWidth
//						that.screenWidth = window.screenWidth
//					})()
//				}
//				this.showCount = this.doScreen()
			},
			setIndex(idx) {
				if ((idx <= this.images.length - (Math.floor(this.showCount / 2) + 1)) && (idx >= Math.floor(this.showCount / 2))) {
					return idx - Math.floor(this.showCount / 2)
				} else if (idx < Math.floor(this.showCount / 2)) {
					return 0
				} else {
					return this.images.length - this.showCount >= 0 ? this.images.length - this.showCount : 0
				}
			},
			setActive(idx) {
				if (_.isEmpty(this.images)) return
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
				arrowRight && this.$velocity(arrowRight, {opacity: opacity}, {duration: 200})
				arrowLeft && this.$velocity(arrowLeft, {opacity: opacity}, {duration: 200})
			},
			doScreen() {
				return this.screenWidth > 1687 ? 11 : (this.screenWidth > 1409 ? 9 : 7)
			},
			left() {
				this.index -= 1
				if (this.index < (this.images.length - this.showCount)) {
					const arrowRight = this.$refs.arrowRight
					arrowRight && this.$velocity(arrowRight, {opacity: 1}, {duration: 200})
				}
				this.$api.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string', {
					action: 13,
					name: this.category.id + '',
					url: '',
					action_time: getOperationFullTime(new Date())
				})
			},
			right() {
				this.index += 1
				if (this.index > 0) {
					const arrowLeft = this.$refs.arrowLeft
					arrowLeft && this.$velocity(arrowLeft, {opacity: 1}, {duration: 200})
				}
				this.$api.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string', {
					action: 12,
					name: this.category.id + '',
					url: '',
					action_time: getOperationFullTime(new Date())
				})
			},
			like(site) {
				this.$emit('addLike', site)
			},
			open(flag) {
				const action = flag === 1 ? 8 : 9,
					url = flag === 1 ? this.images[this.index].url : this.images[this.index].host
				this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int', {
					action: action,
					name: this.category.id + '',
					url: url,
					action_time: getOperationFullTime(new Date()),
					number1: 0,
					number2: 0
				})
			},
			full() {
				const launchFullscreen = element => {
					if (element.requestFullscreen) {
						element.requestFullscreen()
					} else if (element.mozRequestFullScreen) {
						element.mozRequestFullScreen()
					} else if (element.webkitRequestFullscreen) {
						element.webkitRequestFullscreen()
					} else if (element.msRequestFullscreen) {
						element.msRequestFullscreen()
					}
					this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int', {
						action: 16,
						name: this.category.id + '',
						url: '',
						action_time: getOperationFullTime(new Date()),
						number1: 0,
						number2: 0
					})
				}
				const exitFullscreen = () => {
					if (document.exitFullscreen) {
						document.exitFullscreen()
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen()
					} else if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen()
					}
				}
				this.isFullScreen && exitFullscreen()
				!this.isFullScreen && launchFullscreen(document.documentElement)
			},
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .paginator
    position relative
    right 0
    overflow hidden
    min-width 285px
    max-width 300px
    height 100%
    .info
      position relative
      margin-top 90px
      font-size 14px
      a
        display block
        color #fff
        &:link, &:visited, &:focus
          text-decoration none
          color #fff
      b
        color #949494
        margin-right 16px
      .from
        margin-bottom 30px
      .center-to-head
        display inline-block
        position relative
      .center-to-head::after
        content ''
        display block
        position absolute
        bottom -5px
        width 100%
        height 2px
        background #6346de
        transition all 0.3s ease-in-out
        transform scale3d(0,1,1)
        transform-origin 50% 0
      .center-to-head
        &:hover
          &::after
            transform scale3d(1,1,1)
      .button
        display flex
        margin-bottom 45px
        font-size 14px
        .btn
          position relative
          width 90px
          height 40px
          &:hover
            background-position -90px
          &:active
            background-position -180px
        .full
          margin-right 20px
          background url("../../../../assets/img/collection/full.png") no-repeat
          color #000000
          line-height 2.8
        .like
          background url("../../../../assets/img/collection/like.png") no-repeat
        span
          position relative
          left 39px
          line-height 2.7
      .image
        .arrow
          display inline-block
          position absolute
          top 14px
          vertical-align top
          height 24px
          width 24px
          cursor pointer
          opacity 0
        .thumbnail-wrapper
          display inline-block
          .thumbnail
            display inline-block
            overflow hidden
            margin-right 10px
            margin-bottom 10px
            height 85px
            width 85px
            background-position bottom
            background-size cover
            box-shadow inset 0 0 0 1px hsla(0,0%,100%,.2)
            opacity 0.6
            cursor pointer
            object-fit cover
            &.active
              opacity 1
              box-shadow inset 0 0 0 2px #f4e763
    .bottom
      position absolute
      bottom 30px
      color #4d4d4d
      font-size 12px
</style>
