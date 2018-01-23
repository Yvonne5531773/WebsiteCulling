<template>
  <div class="paginator">
    <div v-if="index > 0" class="arrow left" @click.stop="index -= 1">
      <icon :type="'arrowLeft'" :color="'#ccc'"></icon>
    </div>
    <div class="thumbnail-wrapper" v-for="(item, i) in activeImages" :key="item.index" @click.stop="setActive(item.index-1)">
      <img :class="{'thumbnail active': item.isActive, 'thumbnail': !item.isActive}" :style="i===4&&`marginRight:0px`" :src="item.src" v-if="!isMove" />
    </div>
    <div v-if="index < (images.length - 5)" class="arrow right" @click.stop="console.log('111'),index += 1">
      <icon :type="'arrowRight'" :color="'#ccc'"></icon>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import icon from 'components/common/icon'

  export default {
    props: {
      images: Array,
      activeIndex: Number
    },
    data () {
      return {
        index: 0,
        isMove: false
      }
    },
    computed: {
      activeImages () {
      	console.log('activeImages this.images', this.images)
        return this.images.slice(this.index, this.index + 5)
      }
    },
    mounted () {
      this.index = this.setIndex(this.activeIndex)
      this.setActive(this.activeIndex)
    },
    watch: {
      activeIndex () {
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
        if (idx !== this.activeIndex) {
          this.$emit('changeIndex', idx)
        }
        this.isMove = true
        this.images.forEach((item) => {
          item.isActive = false
        })
        this.images[idx].isActive = true
        this.isMove = false
      }
    },
    components: {
      icon,
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .paginator
    width 1065px
    height 120px
    overflow hidden
    position relative
    left 0
    top 10px
    text-align center
    margin 0 auto
    .arrow
      display inline-block
      position absolute
      vertical-align top
      height 20px
      width 20px
      top 55px
      cursor pointer
      &.left
        left 0
      &.right
        right 0
    .thumbnail-wrapper
      display inline-block
      img
        display inline-block
        margin-right 10px
        height 120px
        max-width 184px
        background-position bottom
        background-size cover
        /*box-shadow inset 0 0 0 1px hsla(0,0%,100%,.2)*/
        opacity 0.2
        cursor pointer
        overflow hidden
        object-fit contain
        &.active
          opacity 1
</style>
