<template lang="pug">
.waterfall(
  :style="isMobile? '':{width:colWidth*columnCount+'px',left:'50%',height:'100%',top:'10px',marginLeft: -1*colWidth*columnCount/2 +'px'}"
)
  div.img-box(
    v-for="(v, i) in imgsArrC",
    :style="{padding:'10px',width: isMobile ? '' : colWidth+'px'}"
  )
    .img-inner-box
      div.img-wrapper(
      @click="setActive(v)", @mouseenter="enterAndLeave(1, i)", @mouseleave="enterAndLeave(0, i)",
      :style="{width:imgWidthC+'px',height:v.height?v.height+'px':'',position:'relative',cursor:'pointer'}"
      )
        span.title(ref="title") {{v.title}}
        b.mask(ref="mask")
        img(:src="v.image")

  .loading(v-show="isPreloadingC", :class="{'first-loading':isFirstTime}")
    div.double-bounce1
    div.double-bounce2
</template>

<script>
export default {
	name: 'VWaterfall',
	props: {
		gap: {
			type: Number,
			default: 27
		},
		maxCols: {
			type: Number,
			default: 20
		},
		imgsArr: {
			type: Array,
			required: true
		},
		imgWidth: {
			type: Number,
			default: 240
		},
		//加载时间大于该值才出现加载图
		timeOut: {
			type: Number,
			default: 8000
		},
		fetchImgsData: {
			type: Function
		}
	},
	data() {
		return {
			columnCount: NaN,
			isMobile: navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i),
			beginIndex: NaN,
			colsHeightArr: [],
			imgBoxEls: null,
			isPreloading: true,
			isPreloadingC: true,
			imgsArrC: [],
			loadedCount: 0,
			isFirstTime: true,
			failImgs: [],
		}
	},
	computed: {
		colWidth() {
			return this.imgWidth + this.gap
		},
		imgWidthC() {
			return this.isMobile ? window.innerWidth / 2 - this.gap : this.imgWidth
		}
	},
	mounted() {
		this.initColumnCount()
		this.beginIndex = this.columnCount
		this.preload()
		this.$on('preloaded', () => {
			if (this.colsHeightArr.length === 0)
				this.initColsHeightArr()
			this.waterfall()
			this.isFirstTime && this.fetchImgsData()
			this.isFirstTime = false
		})
		window.addEventListener('resize', () => {
			let old = this.columnCount
			this.initColumnCount()
			if (old === this.columnCount) return
			this.beginIndex = this.columnCount
			this.initColsHeightArr()
			this.waterfall()
		})
		this.$el.parentNode.addEventListener('scroll', () => {
			const listTop = this.$el.parentNode.scrollTop
			if (listTop >= 200) {
				this.$emit('response', {show: true, el: this.$el.parentNode})
			} else {
				this.$emit('response', {show: false, el: this.$el.parentNode})
			}
			if (this.isPreloading) return
			const lastImgHeight = this.imgsArr[this.imgsArr.length - 1].height || 0
			if (this.$el.parentNode.scrollTop + this.$el.parentNode.offsetHeight >= this.$el.parentNode.scrollHeight - lastImgHeight * 3) {
				this.fetchImgsData()
			}
		})
	},
	watch: {
		imgsArr(newV, oldV) {
			if (newV.length === oldV.length) return
			this.isPreloading = true
			this.preload()
		},
		isPreloading(v) {
			if (v) {
				if (this.isFirstTime) {
					this.isPreloadingC = true
				} else {
					setTimeout(() => {
						if (!this.isPreloading) return
						this.isPreloadingC = true
					}, this.timeOut)
				}
			} else {
				this.isPreloadingC = false
			}
		}
	},
	methods: {
		waterfall() {
			for (let i = this.beginIndex; i < this.imgsArrC.length; i++) {
				if (this.imgBoxEls[i]) {
					let minHeight = Math.min.apply(null, this.colsHeightArr)
					let minIndex = this.colsHeightArr.indexOf(minHeight)
					let width = this.imgBoxEls[0].offsetWidth
					this.imgBoxEls[i].style.position = 'absolute'
					this.imgBoxEls[i].style.left = minIndex * width + 'px'
					this.imgBoxEls[i].style.top = minHeight + 'px'
					this.$set(this.colsHeightArr, minIndex, minHeight + this.imgBoxEls[i].offsetHeight)
				}
			}
			this.beginIndex = this.imgsArrC.length
		},
		loadFn(e, oImg, i) {
			if (e === 'error') {
				this.failImgs.push(oImg)
			} else if (e === 'success') {
				this.loadedCount++
				if (this.imgsArr[i]) {
					this.$set(this.imgsArr[i], 'height', Math.round(this.imgWidthC / (oImg.width / oImg.height)))
				}
			}
			if (this.loadedCount === this.imgsArr.length - this.failImgs.length) {
				this.imgsArrC = _.filter(_.cloneDeep(this.imgsArr), img => {
					return img && img.height
				})
				this.isPreloading = false
				this.$nextTick(() => {
					this.initImgBoxEls()
					this.$emit('preloaded')
				})
			}
		},
		preload() {
			this.imgsArr.forEach((v, i) => {
				if (i < this.loadedCount + this.failImgs.length) {
					return
				}
				this.loadImage(v.image, i, this.loadFn)
			})
		},
		loadImage(src, i, callback) {
			let img = new Image();
			img.onload = function () {
				typeof callback === 'function' && callback('success', img, i);
			}
			img.onerror = function () {
				typeof callback === 'function' && callback('error', img, i);
			}
			img.src = src;
		},
		initColsHeightArr() {
			this.colsHeightArr = []
			for (let i = 0; i < this.columnCount; i++) {
				if (this.imgBoxEls[i]) {
					this.imgBoxEls[i].style.position = 'static'
					let height = this.imgBoxEls[i].offsetHeight
					this.colsHeightArr.push(height)
				}
			}
		},
		initImgBoxEls() {
			this.imgBoxEls = document.getElementsByClassName('img-box')
		},
		initColumnCount() {
			let winWidth = window.innerWidth
			let columnCount = parseInt(winWidth / this.colWidth)
			columnCount = columnCount === 0 ? 1 : columnCount
			this.columnCount = this.isMobile
				? 2
				: (columnCount > this.maxCols ? this.maxCols : columnCount)
		},
		setActive(img) {
			const idx = this.imgsArr.map(img => img.image).indexOf(img.image)
			this.$emit('changeIndex', idx)
		},
		enterAndLeave(opacity, index) {
			const title = this.$refs.title[index],
				mask = this.$refs.mask[index],
				duration = 150
			title && this.$velocity(title, {opacity: opacity}, {duration: duration})
			mask && this.$velocity(mask, {opacity: opacity}, {duration: duration})
		},
	},
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.waterfall
		position relative
		width 100%
		.img-box
			display inline-block
			float left
			width 50%
			box-sizing border-box
			transition left 1s, top 1s
			.img-inner-box
				.img-wrapper
					width 100%
				img
					vertical-align bottom
					width 100%
					cursor pointer
				.title
					position absolute
					bottom 0
					overflow hidden
					padding-left 5px
					color #fff
					height 30px
					line-height 2.3
					cursor pointer
					font-size 14px
					opacity 0
					z-index 1
				.mask
					position absolute
					bottom 0
					opacity 0
					height 30px
					width 100%
					background linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))
		.loading
			position fixed
			bottom 10px
			left 50%
			margin-left -15px
			text-align center
			width 30px
			height 30px
		.first-loading
			top 50%
			margin-top -15px
		.double-bounce1,
		.double-bounce2
			position absolute
			top 0
			left 0
			width 100%
			height 100%
			border-radius 50%
			background-color #6248db
			opacity 0.6
			animation bounce 2.0s infinite ease-in-out
		.double-bounce2
			animation-delay -1.0s
		@keyframes bounce
			0%,
			100%
				transform scale(0.0)
			50%
				transform scale(1.0)
</style>
