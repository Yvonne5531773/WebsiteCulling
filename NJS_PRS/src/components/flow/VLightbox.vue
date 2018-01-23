<template>
  <div class="v-images">
    <VHeader :favoritePage="true"></VHeader>
    <div class="content">
      <div class="top">
        <div class="title"></div>
      </div>
      <VWaterfall :imgsArr='images' :imgWidth="imgWidth" @scrollLoadImg="fetchImgsData" @changeIndex="changeImg($event)"></VWaterfall>
      <div ref="lightbox" class="lightbox" v-show="isShow" @click="isShow=!modalclose">
        <VFancybox ref="fancybox" :images="images" :index="index" :reset="!isShow" @play="playImg" @pause="pauseImg" @close="closeImg" @addIndex="nextImg" @decIndex="prevImg" :showclosebutton="showclosebutton" :showcaption="showcaption" :imagecountseparator="imagecountseparator" :showimagecount="showimagecount"></VFancybox>
        <VPaginator :images="images" :activeIndex="index" @changeIndex="changeImg($event)" v-show="showthumbnails"></VPaginator>
      </div>
    </div>
  </div>
</template>

<script>
	import VWaterfall from 'components/flow/childrens/VWaterfall'
	import VHeader from 'components/common/VHeader'
  import VFancybox from 'components/flow/childrens/VFancybox'
  import VPaginator from 'components/flow/childrens/VPaginator'
  import {images} from '../../mock/images'

  export default {
	  data () {
		  return {
			  imgsArr: [],
			  fetchImgsData: [],
			  imgWidth: 254,
			  isShow: false,
			  index: 0,
			  playTimer: null,
			  touchPoint: {
				  prev: 0,
				  now: 0
			  },
        modalclose: true,
			  keyinput: true,
			  mousescroll: true,
			  showclosebutton: false,
			  showcaption: false,
			  imagecountseparator: 'of',
			  showimagecount: false,
			  showthumbnails: true,
        showFullScreen: false,
		  }
	  },
    computed: {
      images () {
        let retArr = []
        let idx = 0
        images.forEach((item) => {
          if (item) {
            item['index'] = ++idx
            item['isActive'] = false
            item['caption'] = item.caption ? item.caption : ''
            retArr.push(item)
          }
        })
        for (let i = 0, len = retArr.length; i < len; i++) {
          retArr[i]['total'] = len
        }
        console.log('images retArr', retArr)
        return retArr
      }
    },
    created () {
      if (this.isShow) {
        window.addEventListener('keydown', this.keyFun)
        window.addEventListener('mousewheel', this.wheelFun)
        this.$refs.lightbox.addEventListener('touchstart', this.touchFun)
      }
    },
    methods: {
      openImg () {
        this.isShow = true
      },
      playImg () {
        let that = this
        this.playTimer = window.setInterval(that.nextImg, 2000)
      },
      pauseImg () {
        window.clearInterval(this.playTimer)
      },
      closeImg () {
        this.isShow = false
      },
      nextImg () {
        if (this.index < this.images.length - 1) {
          this.index++
        } else {
          this.index = 0
        }
      },
      prevImg () {
        if (this.index > 0) {
          this.index--
        }
      },
      changeImg (event) {
      	console.log('changeImg event', event)
        this.isShow = true
        this.$refs.fancybox.next = this.index > event
        this.index = event
      },
      keyFun (event) {
        event.preventDefault()
        if (this.keyinput) {
          switch (event.keyCode) {
            case 27:
              this.closeImg()
              break
            case 37:
              if (this.index > 0) {
                if (this.timeout) {
                  clearTimeout(this.timeout)
                } else {
                  this.$refs.fancybox.next = true
                  this.$refs.fancybox.animation = true
                  this.prevImg()
                }

                this.timeout = setTimeout(() => {
                  this.timeout = null
                }, 375)
              }
              break
            case 39:
              if (this.index < this.images[this.index].total - 1) {
                if (this.timeout) {
                  clearTimeout(this.timeout)
                } else {
                  this.$refs.fancybox.next = false
                  this.$refs.fancybox.animation = true
                  this.nextImg()
                }

                this.timeout = setTimeout(() => {
                  this.timeout = null
                }, 375)
              }
              break
            default:
              return
          }
        }
      },
      wheelFun (event) {
        if (this.mousescroll) {
          event.stopPropagation()
          if (event.deltaY > 0) {
            if (this.index < this.images[this.index].total - 1) {
              if (this.timeout) {
                clearTimeout(this.timeout)
              } else {
                this.$refs.fancybox.next = false
                this.$refs.fancybox.animation = true
                this.nextImg()
              }
              this.timeout = setTimeout(() => {
                this.timeout = null
              }, 375)
            }
          } else {
            if (this.index > 0) {
              if (this.timeout) {
                clearTimeout(this.timeout)
              } else {
                this.$refs.fancybox.next = true
                this.$refs.fancybox.animation = true
                this.prevImg()
              }

              this.timeout = setTimeout(() => {
                this.timeout = null
              }, 375)
            }
          }
        }
      },
    },
    watch: {
      isShow () {
        if (this.isShow) {
          window.addEventListener('keydown', this.keyFun)
          this.$refs.lightbox.addEventListener('mousewheel', this.wheelFun)
        } else {
          this.pauseImg()
          window.removeEventListener('keydown', this.keyFun)
          this.$refs.lightbox.removeEventListener('mousewheel', this.wheelFun)
        }
      }
    },
    components: {
	    VHeader,
	    VWaterfall,
	    VFancybox,
	    VPaginator,
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .v-images
    .content
      position relative
      top 85px
      .top
        background-color #9E9E9E
        height 140px
        .title
          width 1100px
          margin auto
  .lightbox
    position: fixed
    top: 0
    left: 0
    z-index: 9999
    width: 100%
    height: 100%
    padding: 2px
    background: rgba(0, 0, 0, 0.8)
    box-sizing: border-box
    font-size: 0
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif
</style>
