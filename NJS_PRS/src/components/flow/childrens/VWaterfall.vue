<template lang="pug">
.vue-waterfall-easy(
  :style="isMobile? '':{width:colWidth*columnCount+'px',left:'50%',top:'95px',marginLeft: -1*colWidth*columnCount/2 +'px'}"
)
  div.img-box(
    v-for="(v,i) in imgsArrC",
    @click="setActive(i)",
    :style="{padding:'10px',width: isMobile ? '' : colWidth+'px'}"
  )
    .img-inner-box
      div.img-wraper(:style="{width:imgWidthC+'px',height:v.height?v.height+'px':''}")
        img(:src="v.image")

  .loading(v-if="isPreloadingC", :class="{'first-loading':isFirstTIme}")
    div.double-bounce1
    div.double-bounce2
</template>

<script>
export default {
	name: 'vue-waterfall-easy',
	props: {
		gap: {
			type: Number,
			default: 27
		},
		maxCols: {
			type: Number,
			default: 6
		},
		imgsArr: {
			type: Array,
			required: true
		},
		imgWidth: {
			type: Number,
			default: 240
		},
		timeOut: {
			type: Number,
			default: 500
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
			isFirstTIme: true,
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
			if (this.colsHeightArr.length === 0) this.initColsHeightArr() // 第一次初始化
			this.waterfall()
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
			if (this.isPreloading) return
			const lastImgHeight = this.imgsArr[this.imgsArr.length - 1].height
			if (this.$el.parentNode.scrollTop + this.$el.parentNode.offsetHeight > this.$el.parentNode.scrollHeight - lastImgHeight) {
				this.$emit('scrollLoadImg')
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
				setTimeout(() => {
					if (!this.isPreloading) return
					this.isPreloadingC = true
				}, this.timeOut)
			} else {
				this.isPreloadingC = false
			}
		}
	},
	methods: {
		waterfall() {
			for (let i = this.beginIndex; i < this.imgsArr.length; i++) {
				let minHeight = Math.min.apply(null, this.colsHeightArr)
				let minIndex = this.colsHeightArr.indexOf(minHeight)
				let width = this.imgBoxEls[0].offsetWidth
				this.imgBoxEls[i].style.position = 'absolute'
				this.imgBoxEls[i].style.left = minIndex * width + 'px'
				this.imgBoxEls[i].style.top = minHeight + 'px'
				this.$set(this.colsHeightArr, minIndex, minHeight + this.imgBoxEls[i].offsetHeight)
			}
			this.beginIndex = this.imgsArr.length
		},
		loadFn(e, oImg, i) {
			if(oImg) {
				this.loadedCount++
				if (e === 'load') {
					this.$set(this.imgsArr[i], 'height', Math.round(this.imgWidthC / (oImg.width / oImg.height)))
				}
				if (this.loadedCount === this.imgsArr.length) {
					this.imgsArrC = this.imgsArr.concat([])
					this.isPreloading = false
					this.isFirstTIme = false
					this.$nextTick(() => {
						this.initImgBoxEls()
						this.$emit('preloaded')
					})
				}
			}else { //to do list
				this.imgsArr.splice(i, 1)
			}
		},
		preload() {
			this.imgsArr.forEach((v, i) => {
				if (i < this.loadedCount) return
				this.loadImage(v.image, i, this.loadFn)
			})
		},
		loadImage(src, i, callback) {
			var img = new Image();
			img.onload = function () {
				typeof callback === 'function' && callback('load', img, i);
			}
			img.onerror = function () {
				typeof callback === 'function' && callback(new Error('load image error!'));
			}
			img.src = src;
		},
		initColsHeightArr() {
			this.colsHeightArr = []
			for (let i = 0; i < this.columnCount; i++) {
				this.imgBoxEls[i].style.position = 'static'
				let height = this.imgBoxEls[i].offsetHeight
				this.colsHeightArr.push(height)
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
		setActive (idx) {
			this.$emit('changeIndex', idx)
		}
	},
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.vue-waterfall-easy
		position relative
		width 100%
		.img-box
			display inline-block
			width 50%
			box-sizing border-box
			float left
			transition left 1s, top 1s
			.img-inner-box
				.img-wraper
					width 100%
				img
					width 100%
					vertical-align bottom
					cursor pointer
		.loading
			text-align center
			position fixed
			bottom 10px
			left 50%
			margin-left -15px
			width 30px
			height 30px
		.first-loading
			top 50%
			margin-top -15px
		.double-bounce1,
		.double-bounce2
			width 100%
			height 100%
			border-radius 50%
			background-color #6248db
			opacity 0.6
			position absolute
			top 0
			left 0
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
