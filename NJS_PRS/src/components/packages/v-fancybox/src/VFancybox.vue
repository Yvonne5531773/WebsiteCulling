<template>
  <div class="fancybox" :style="isFullScreen&&`width:100%;marginRight:0px`">
    <div class="image-wrapper">
      <!--<transition-group external="white-space:nowrap" :duration="800" :enter-active-class="'animated ' + transition.enterClass" :leave-active-class="'animated ' + transition.leaveClass">-->
      <img class="image" v-for="item in images" :key="item.index" :src="item.src" v-if="item.index===index+1" @click.stop="addIndex(1)">
      <!--</transition-group>-->
    </div>
    <div v-if="index > 0" class="arrow left" @click.stop="decIndex"></div>
    <div v-if="images[index] && index < images[index].total-1" class="arrow right" @click.stop="addIndex"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getOperationFullTime } from 'utils/index'
  export default {
	  name: 'VFancybox',
	  props: {
		  index: Number,
		  images: Array,
		  animate: {
			  type: Boolean,
			  default: false
		  },
		  category: Object,
		  isFullScreen: Boolean
	  },
	  data() {
		  return {
			  nolikedTxt: this.$txt.TXT_14,
			  likedTxt: this.$txt.TXT_15,
//        next: true,
//        animation: false,
		  }
	  },
	  computed: {
//      transition () {
//        return {
//          mode: '',
//          enterClass: this.next ? 'zoomIn' : 'zoomIn',
//          leaveClass: this.next ? 'slideOutRight' : 'slideOutLeft'
//        }
//      }
	  },
	  methods: {
		  decIndex() {
			  this.$emit('decIndex')
			  this.next = true
			  this.animation = true
			  const action = this.isFullScreen ? 18 : 11
			  this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int', {
				  action: action,
				  name: this.category.id + '',
				  url: '',
				  action_time: getOperationFullTime(new Date()),
				  number1: 0,
				  number2: 0
			  })
		  },
		  addIndex(flag) {
			  if (this.index < this.images[this.index].total - 1) {
				  this.$emit('addIndex')
				  this.next = false
				  this.animation = true
			  }
			  const action = flag === 1 ? (this.isFullScreen ? 19 : 14) : (this.isFullScreen ? 17 : 10)
			  this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int', {
				  action: action,
				  name: this.category.id + '',
				  url: '',
				  action_time: getOperationFullTime(new Date()),
				  number1: 0,
				  number2: 0
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
	  },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .fancybox
    display flex
    position relative
    width 75vw
    height 100%
    margin-right 20px
    align-items center
    .image-wrapper
      display flex
      position relative
      margin 0 auto
      .image
        margin 0 auto
        vertical-align middle
        object-fit contain
        max-height 100vh
        min-height 200px
        max-width 69vw
        cursor pointer
        user-select none
      .footer
        position relative
        padding 5px
        text-align left
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
          right 0
          font-size 12px
      .i-l
        display flex
        position relative
        margin-right 100px
        width 46vw
        text-align center
        .header
          position relative
          text-align left
          height 40px
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
          display inline-block
          margin-bottom 15px
         .add
           position absolute
           right 0
           top 48px
           margin auto
           background url("../../../../assets/img/collection/add.png") no-repeat
           width 270px
           height 77px
           text-align center
           line-height 1.8
           cursor pointer
           &:hover
             background-position -270px
           &:active
             background-position -540px
           img
             position relative
             top 4px
           span
             padding-right 7px
             font-size 16px
    .arrow
      display inline-block
      position absolute
      cursor pointer
      @media screen and (min-width 849px)
        height 50px
        width 32px
        top calc(50% - 48px)
      @media screen and (max-width 849px)
        height 50px
        width 32px
        top calc(50% - 45px)
      &.left
        background url("../../../../assets/img/collection/arrow-left.png") no-repeat
        left 0
        &:hover
          background-position -32px
        &:active
          background-position -64px
      &.right
        background url("../../../../assets/img/collection/arrow-right.png") no-repeat
        right 0
        &:hover
          background-position -32px
        &:active
          background-position -64px
</style>
