<template>
  <div class="fancybox">
    <div class="image-wrapper">
      <!--<div class="i-l">-->
        <!--<div class="header">-->
        <!--<div class="full" @click.stop="full" v-if="showFullScreen">-->
        <!--<icon v-if="!isFullScreen" :type="'full'" :color="'#ccc'"></icon>-->
        <!--<icon v-else :type="'exitfull'" :color="'#ccc'"></icon>-->
        <!--</div>-->
        <!--<div class="close" @click.stop="close" v-show="showclosebutton">-->
        <!--<icon :type="'close'" :color="'#ccc'"></icon>-->
        <!--</div>-->
        <!--</div>-->
        <!--<transition-group style="white-space:nowrap" :duration="800" :enter-active-class="'animated ' + transition.enterClass" :leave-active-class="'animated ' + transition.leaveClass">-->
        <img ref="images" class="image" v-for="item in images" :key="item.index" :src="item.src" v-show="item.index===index+1 && !reset" @click.stop="addIndex">
        <!--</transition-group>-->
        <!--<div class="footer">-->
        <!--<span class="caption" @click.stop v-show="showcaption" v-html="images[index].caption"></span>-->
        <!--<span class="count" @click.stop v-show="showimagecount">{{ index+1 }} {{imagecountseparator}} {{ images[index].total }}</span>-->
        <!--</div>-->
      <!--</div>-->
    </div>
    <div v-if="images[index]" class="bottom">
      <a :href="images[index].url" target="_blank" class="b-t center-to-head" @click.stop="">{{images[index].title}}</a>
      <a :href="images[index].host" target="_blank" class="b-f center-to-head" @click.stop="">{{images[index].from}}</a>
      <!--<div class="add" :style="category.collected&&`backgroundPosition:-540px`" @click="collect">&ndash;&gt;-->
        <!--<img src="../../../../static/img/favorite/start.png" />-->
        <!--<span v-if="category.collected">{{collectTxt}}</span>-->
        <!--<span v-else>{{noCollectTxt}}</span>-->
      <!--</div>-->
    </div>
    <div v-if="index > 0" class="arrow left" @click.stop="decIndex"></div>
    <div v-if="images[index] && index < images[index].total-1" class="arrow right" @click.stop="addIndex"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import icon from 'components/common/icon'

  export default {
    props: {
      index: Number,
      images: Array,
      reset: Boolean,
      animate: {
        type: Boolean,
        default: false
      },
      showclosebutton: Boolean,
      showcaption: Boolean,
      imagecountseparator: String,
      showimagecount: Boolean,
	    showFullScreen: Boolean,
	    noCollectTxt: '加入收藏',
	    collectTxt: '取消收藏',
    },
    data () {
      return {
        next: true,
        animation: false,
        isPlay: false
      }
    },
    computed: {
      transition () {
        return {
          mode: '',
          enterClass: this.next ? 'zoomIn' : 'zoomIn',
          leaveClass: this.next ? 'slideOutRight' : 'slideOutLeft'
        }
      }
    },
    methods: {
      decIndex () {
	      this.$emit('decIndex')
	      this.next = true
	      this.animation = true
      },
      addIndex () {
        if (this.index < this.images[this.index].total - 1) {
	        this.$emit('addIndex')
	        this.next = false
	        this.animation = true
        }
      },
      close () {
        this.isPlay = false
        this.$emit('pause')
        this.$emit('close')
        this.animation = false
      },
    },
    watch: {
      index () {
        this.$nextTick(() => {
          if (!this.isPlay) {
            this.animation = false
          }
        })
      },
      reset () {
        if (this.reset) {
          this.isPlay = false
          this.animation = false
        }
      }
    },
    components: {
      icon
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .fancybox
    position: relative
    display: flex
    height calc(100% - 70px)
    align-items center
    .image-wrapper
      display flex
      position relative
      margin 0 auto
      bottom 20px
      /*width 71vw*/
      /*height 78%*/
      /*min-width 964px*/
      .image
        vertical-align middle
        object-fit contain
        max-height calc(100vh - 150px)
        min-height 200px
        max-width 69vw
        /*@media screen and (max-width 1366px)
					max-width: calc(42vw)
				@media screen and (max-width 1920px)
					max-width: calc(98vw)*/
        margin 0 auto
        cursor pointer
        user-select none
      .footer
        position: relative
        padding: 5px
        text-align: left
        span
          display inline-block
          font-size 14px
          color #fff
          a
            color #fff
            &:hover
              color #888
        .count
          position absolute
          font-size 12px
          right 0
      .i-l
        width 46vw
        position relative
        text-align center
        display flex
        margin-right 100px
        .header
          height 40px
          position relative
          text-align left
          .full, .close
            display inline-block
            width 20px
            height 20px
            cursor pointer
          .full
            margin-top 10px
            margin-right 10px
          .close
            position absolute
            right 0
            top 10px
       .i-r
         position relative
         max-width 20vw
         font-size 14px
         color #fff
         h2
          margin-bottom 15px
         .i-r-t
          margin-bottom 15px
          display inline-block
         .add
           background url("../../../../static/img/favorite/add.png") no-repeat
           width 270px
           height 77px
           cursor pointer
           right 0
           top 48px
           margin auto
           position absolute
           text-align center
           line-height 1.8
           &:hover
             background-position -270px
           &:active
             background-position -540px
           img
             position relative
             top 4px
           span
             font-size 16px
             padding-right 7px
    .arrow
      display inline-block
      position absolute
      cursor pointer
      @media screen and (min-width:849px)
        height 50px
        width 50px
        top calc(50% - 48px)
      @media screen and (max-width:849px)
        height 50px
        width 50px
        top calc(50% - 45px)
      &.left
        background url("../../../../static/img/flow/arrow-left.png") no-repeat
        left 25px
        &:hover
          background-position -50px
        &:active
          background-position -100px
      &.right
        background url("../../../../static/img/flow/arrow-right.png") no-repeat
        right 25px
        &:hover
          background-position -50px
        &:active
          background-position -100px
    .bottom
      position absolute
      bottom 0
      height 40px
      width 780px
      min-width 500px
      left 0
      right 0
      margin auto
      text-align center
      a
        font-size 14px
        color #fff
        &:link, &:visited, &:focus
          text-decoration none
          color #fff
      .center-to-head
        position absolute
      .center-to-head::after
        content ''
        display block
        width 100%
        height 3px
        position absolute
        bottom -10px
        background #fff
        transition all 0.3s ease-in-out
        transform scale3d(0,1,1)
        transform-origin 50% 0
      .center-to-head
        &:hover
          &::after
            transform scale3d(1,1,1)
      .b-t
        left 0
      /*.b-f*/
</style>
