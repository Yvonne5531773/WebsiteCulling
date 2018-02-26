<template>
  <div class="v-lightbox">
    <section ref="content" class="lightbox-content">
      <VBanner :category="category"></VBanner>
      <VWaterfall v-if="imgsArr&&imgsArr.length>0" :imgsArr='imgsArr' :imgWidth="imgWidth" :maxCols="maxCols" :fetchImgsData="fetchImgsData" @changeIndex="changeImg($event)" @response="response($event)"></VWaterfall>
      <transition :duration="300" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div ref="lightbox" class="lightbox" v-if="isShow" @click="isShow=!modalclose" :style="!isFullScreen&&`padding:0 20px 0 20px`">
          <VFancybox ref="fancybox" :images="articles" :index="articlesIndex" :reset="!isShow" :category="category" :isFullScreen="isFullScreen" @close="closeImg" @addIndex="nextImg" @decIndex="prevImg"></VFancybox>
          <VPaginator ref="paginator" :images="articles" :activeIndex="articlesIndex" :category="category" :gif="gif" @changeIndex="changeArticle($event)" @addLike="likeSite($event)"></VPaginator>
          <transition :duration="600" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <span v-show="isFullScreen&&showEndTip" class="endTip">{{endTip1}}<b>esc</b>{{endTip2}}</span>
          </transition>
          <a v-if="isFullScreen" :title="exitFullScreenTxt" class="close" @click.stop="close"></a>
        </div>
      </transition>
    </section>
    <VFunction :category="category" :show="showFunction" :scrollEle="scrollEle" :type="1"></VFunction>
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import { getHost, md5, getOperationFullTime } from 'utils/index'
	import { dataServicePath } from 'config/index'
  import { mockImages } from 'mock/image'
  export default {
		name: 'VLightbox',
	  data () {
		  return {
			  imgWidth: '',
			  maxCols: '',
			  firstLoadCount: '',
			  loadCount: '',
			  images: [],
			  imgsArr: [],
			  articles: [],
			  fetchImgsArr: [],
			  index: 0,
			  articlesIndex: 0,
			  LOAD_INDEX: 0,
			  changeTime: 100,
			  category: {},
			  scrollEle: {},
//			  fetchSTO: {},
			  gif: false,
			  isShow: false,
        modalclose: true,
			  keyinput: true,
			  mousescroll: true,
			  showFunction: false,
			  showEndTip: false,
			  likeTxt: this.$txt.TXT_14,
			  likedTxt: this.$txt.TXT_15,
			  endTip1: this.$txt.TXT_19,
        endTip2: this.$txt.TXT_20,
        exitFullScreenTxt: this.$txt.TXT_43,
		  }
	  },
    async created () {
      if(this.isShow) {
        window.addEventListener('keydown', this.keyFun)
        window.addEventListener('mousewheel', this.wheelFun)
      }
      this.constructConfig()

	    this.images = mockImages
//      const path = dataServicePath + 'index/' + this.categoryid + '.json'
//      this.images = await this.getJSON(path)
	    this.images = _.unionBy(this.images, 'image')
	    this.imgsArr = _.forEach(this.images.slice(0, this.firstLoadCount), image => {
	    	image.status = 1
      })
	    this.fetchImgsArr = this.constructImages()
    },
    computed: {
	    ...mapState([
		    'isFullScreen'
	    ]),
	    categoryid() {
		    return this.$route.query.categoryid || ''
      },
    },
	  async mounted () {
		  await this.init()
	  },
	  watch: {
		  async isShow() {
			  if(this.isShow) {
				  window.addEventListener('keydown', this.keyFun)
				  this.$nextTick(()=>{
					  this.$refs.lightbox.addEventListener('mousewheel', this.wheelFun)
				  })
          const contentEl = this.$refs.content
				  contentEl.style.position = 'absolute'
				  const img = this.imgsArr[this.index],
					  path = dataServicePath + 'json/' + this.categoryid + '/' + md5(img.href, 32) + '.json'
				  img.articles = _.isEmpty(img.articles)? await this.getJSON(path):img.articles
				  this.articles = this.constructArticles(img)
				  this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:2,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
			  } else {
				  window.removeEventListener('keydown', this.keyFun)
				  this.$refs.lightbox.removeEventListener('mousewheel', this.wheelFun)
				  const contentEl = this.$refs.content
				  contentEl.style.position = 'fixed'
				  this.articlesIndex = 0
				  this.articles = []
			  }
		  },
		  articlesIndex() {
			  this.showEndTip = this.articlesIndex===this.articles.length-1
			  this.showEndTip && setTimeout(() => {
				  this.showEndTip = false
			  }, 5000)
      },
		  isFullScreen() {
			  !this.isFullScreen&&this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:21,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
      }
	  },
    methods: {
	    async init () {
		    await this.construct()
		    this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:1,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
	    },
	    async construct () {
		    this.category = await this.constructCategory(this.categoryid)
		    const localSites = await this.getSite()
		    this.images.forEach((item) => {
			    if(item) {
				    const result = _.find(localSites, {'url': item.href})
				    item.liked = !_.isEmpty(result)? result.liked:false
				    item.id = !_.isEmpty(result)? result.id:(new Date()).valueOf()+Math.floor(Math.random()*1000 + 1)+''
			    }
		    })
	    },
	    likeSite (event) {
	    	if(!event) return
        const site = {
	    		id: event.id,
          liked: !event.liked,
          url: event.url,
          name: event.title,
	        href_url: event.url,
          icon: getHost(event.url) + '/favicon.ico'
        }
		    this.articles.forEach(a => a.liked = site.liked)
		    this.imgsArr[this.index].liked = site.liked
		    this.saveSite(_.cloneDeep(site))
		    site.liked && this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:3,name:this.category.id+'',url:site.url,action_time:getOperationFullTime(new Date()),number1:0,number2:0})
	    },
	    fetchImgsData(status) {
//		    !_.isEmpty(this.fetchSTO) && clearTimeout(this.fetchSTO)
		    this.imgsArr = [...this.imgsArr, ...this.fetchImgsArr]
		    this.fetchImgsArr = this.constructImages()
//        this.fetchSTO = setTimeout(() => {
//	        this.imgsArr = [...this.imgsArr, ...this.fetchImgsArr]
//        }, 100)
	    },
      closeImg () {
        this.isShow = false
      },
      nextImg () {
        if (this.articlesIndex < this.articles.length - 1) {
          this.articlesIndex++
        } else {
          this.articlesIndex = 0
        }
      },
      prevImg () {
        if (this.articlesIndex > 0) {
          this.articlesIndex--
        }
      },
      changeImg (event) {
        this.isShow = true
        this.index = event
      },
	    changeArticle(event) {
		    this.articlesIndex = event
	    },
	    constructConfig() {
		    const config = !_.isEmpty(this.$route.query.config)? JSON.parse(this.$route.query.config) : {}
		    this.imgWidth = config.imgWidth || 254
		    this.maxCols = config.maxCols || 8
		    this.firstLoadCount = config.firstLoadCount || 16
		    this.loadCount = config.loadCount || 16
		    this.gif = config.gif
	    },
	    constructImages() {
		    const start = this.firstLoadCount + this.loadCount* this.LOAD_INDEX++,
			    end = this.firstLoadCount + this.loadCount* this.LOAD_INDEX,
			    res = this.images&&this.images.length>0? this.images.slice(start, end):[]
		    return res
	    },
      constructArticles(img) {
	    	if(_.isEmpty(img.articles)) return []
	      let retArr = []
	      let idx = 0
	      img.articles.images.forEach((item) => {
		      let data = {}
		      if (item) {
			      data.index = ++idx
			      data.isActive = false
			      data.src = item
			      data.title = img.articles.title
			      data.url = img.articles.url
            data.host = 'http://' + getHost(img.articles.url)
            data.from = img.articles.url? getHost(img.articles.url):''
            data.liked = img.liked
			      data.id = img.id
			      data.lazy = this.gif? {
			      	src: item,
				      loading: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjBweCcgaGVpZ2h0PSc2MHB4JyB2aWV3Qm94PScwIDAgNjAgNjAnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz4gICAgPGcgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCc+ICAgICAgICA8ZWxsaXBzZSBmaWxsPScjNGYzM2M3JyBvcGFjaXR5PScwLjQ1JyBjeD0nMzAnIGN5PSczMCcgcng9JzMwJyByeT0nMzAnPjwvZWxsaXBzZT4gICAgICAgIDxlbGxpcHNlIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIG9wYWNpdHk9IjAuNSIgY3g9IjMwIiBjeT0iMzAiIHJ4PSIyNiIgcnk9IjI2Ij48L2VsbGlwc2U+ICAgICAgICA8ZWxsaXBzZSBzdHJva2U9JyNmZmZmZmYnIHN0cm9rZS13aWR0aD0nMicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJyBzdHJva2UtZGFzaGFycmF5PSc0LDEsNCcgY3g9JzMwJyBjeT0nMzAnIHJ4PScyNicgcnk9JzI2Jz4gICAgICAgICAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVUeXBlPSJ4bWwiIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBmcm9tPSIwIDMwIDMwIiB0bz0iOTAgMzAgMzAiIGR1cj0iMC4zcyIvPiAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGZyb209IjEiIHRvPSIwIiBkdXI9IjAuMyIgZmlsbD0iZnJlZXplIi8+ICAgICAgICA8L2VsbGlwc2U+ICAgIDwvZz4gICAgPHN2ZyB4PSIxNiIgeT0iMTguNSIgPiAgICA8ZyBpZD0iZ2lmLWxvZ28iIGZpbGw9IiNmZmZmZmYiPiAgICAgICAgPHBhdGggeD0nMTAwJyB5PScxMDAnIGQ9Ik0xMi44NDIyODUyLDEyLjk4MTQ0NTMgTDEyLjg0MjI4NTIsMTEuMzk5NDE0MSBMNy42MzkxNjAxNiwxMS4zOTk0MTQxIEw3LjYzOTE2MDE2LDEzLjA1MTc1NzggTDEwLjkwODY5MTQsMTMuMDUxNzU3OCBMMTAuOTA4NjkxNCwxMy4zMjQyMTg4IEMxMC44OTExMTMzLDE1LjIwNTA3ODEgOS40NjcyODUxNiwxNi40NzA3MDMxIDcuMzkzMDY2NDEsMTYuNDcwNzAzMSBDNS4wMTEyMzA0NywxNi40NzA3MDMxIDMuNTE3MDg5ODQsMTQuNjI1IDMuNTE3MDg5ODQsMTEuNjM2NzE4OCBDMy41MTcwODk4NCw4LjcwMTE3MTg4IDUuMDAyNDQxNDEsNi44NDY2Nzk2OSA3LjM0OTEyMTA5LDYuODQ2Njc5NjkgQzkuMDgwNTY2NDEsNi44NDY2Nzk2OSAxMC4yODQ2NjgsNy42ODE2NDA2MiAxMC43NzY4NTU1LDkuMjEwOTM3NSBMMTIuNzU0Mzk0NSw5LjIxMDkzNzUgQzEyLjMyMzczMDUsNi42NDQ1MzEyNSAxMC4yMzE5MzM2LDUuMDA5NzY1NjIgNy4zNDkxMjEwOSw1LjAwOTc2NTYyIEMzLjc5ODMzOTg0LDUuMDA5NzY1NjIgMS41MDQzOTQ1Myw3LjYxMTMyODEyIDEuNTA0Mzk0NTMsMTEuNjU0Mjk2OSBDMS41MDQzOTQ1MywxNS43NSAzLjc3MTk3MjY2LDE4LjMwNzYxNzIgNy4zNjY2OTkyMiwxOC4zMDc2MTcyIEMxMC42ODg5NjQ4LDE4LjMwNzYxNzIgMTIuODQyMjg1MiwxNi4yMjQ2MDk0IDEyLjg0MjI4NTIsMTIuOTgxNDQ1MyBaIE0xNy41MTgwNjY0LDE4IEwxNy41MTgwNjY0LDUuMzE3MzgyODEgTDE1LjU0OTMxNjQsNS4zMTczODI4MSBMMTUuNTQ5MzE2NCwxOCBMMTcuNTE4MDY2NCwxOCBaIE0yMi42NTk2NjgsMTggTDIyLjY1OTY2OCwxMi43NDQxNDA2IEwyOC4xMDg4ODY3LDEyLjc0NDE0MDYgTDI4LjEwODg4NjcsMTEuMDAzOTA2MiBMMjIuNjU5NjY4LDExLjAwMzkwNjIgTDIyLjY1OTY2OCw3LjExMDM1MTU2IEwyOC42MDk4NjMzLDcuMTEwMzUxNTYgTDI4LjYwOTg2MzMsNS4zMTczODI4MSBMMjAuNjkwOTE4LDUuMzE3MzgyODEgTDIwLjY5MDkxOCwxOCBMMjIuNjU5NjY4LDE4IFoiIGlkPSJHSUYiPjwvcGF0aD4gICAgPC9nPiAgPC9zdmc+ICAgIDxwYXRoIGQ9Ik01NiwzMCBDNTYsMTUuNjQwNTk2NSA0NC4zNTk0MDM1LDQgMzAsNCIgaWQ9Ik92YWwtMi1Db3B5LTMiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIG9wYWNpdHk9IjAiIGZpbGw9Im5vbmUiPiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgZnJvbT0iMCIgdG89IjEiIGR1cj0iLjYiIGZpbGw9ImZyZWV6ZSIvPiAgICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlVHlwZT0ieG1sIiBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZnJvbT0iMCAzMCAzMCIgdG89IjM2MCAzMCAzMCIgZHVyPSIxLjYyNXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+ICAgIDwvcGF0aD48L3N2Zz4=', //打包后svg会失效，用bas64代替
            } : null
			      retArr.push(data)
		      }
	      })
	      for(let i = 0, len = retArr.length; i < len; i++) {
		      retArr[i].total = len
	      }
	      return retArr
      },
	    close() {
		    const paginator = this.$refs.paginator
		    paginator && paginator.full()
      },
	    response(event) {
		    this.showFunction = event.show
        this.scrollEle = event.el
	    },
	    keyFun (event) {
		    event.preventDefault()
		    if (this.keyinput) {
			    switch (event.keyCode) {
				    case 27:
					    this.closeImg()
					    break
				    case 37:
					    if (this.articlesIndex > 0) {
						    if (this.timeout) {
							    clearTimeout(this.timeout)
						    } else {
							    this.$refs.fancybox.next = true
							    this.$refs.fancybox.animation = true
							    this.prevImg()
						    }
						    this.timeout = setTimeout(() => {
							    this.timeout = null
						    }, this.changeTime)
					    }
					    break
				    case 39:
					    if (this.articlesIndex < this.articles[this.articlesIndex].total - 1) {
						    if (this.timeout) {
							    clearTimeout(this.timeout)
						    } else {
							    this.$refs.fancybox.next = false
							    this.$refs.fancybox.animation = true
							    this.nextImg()
						    }
						    this.timeout = setTimeout(() => {
							    this.timeout = null
						    }, this.changeTime)
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
				    if (this.articlesIndex < this.articles[this.articlesIndex].total - 1) {
					    if (this.timeout) {
						    clearTimeout(this.timeout)
					    } else {
						    this.$refs.fancybox.next = false
						    this.$refs.fancybox.animation = true
						    this.nextImg()
						    !this.isFullScreen&&this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:15,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
						    this.isFullScreen&&this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:20,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
					    }
					    this.timeout = setTimeout(() => {
						    this.timeout = null
					    }, this.changeTime)
				    }
			    } else {
				    if (this.articlesIndex > 0) {
					    if (this.timeout) {
						    clearTimeout(this.timeout)
					    } else {
						    this.$refs.fancybox.next = true
						    this.$refs.fancybox.animation = true
						    this.prevImg()
					    }
					    this.timeout = setTimeout(() => {
						    this.timeout = null
					    }, this.changeTime)
				    }
			    }
		    }
	    },
    },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .lightbox-content
    overflow-x hidden
    top 85px
    bottom 0
    margin 0
    padding 0
    position fixed
    width 100%
  .lightbox
    display flex
    position fixed
    top 0
    left 0
    z-index 9999
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.95)
    box-sizing border-box
    font-size 14px
    .close
      background url("../../../../../assets/img/flow/close.png") no-repeat
      width 48px
      height 48px
      margin 30px 30px 0 0
      right 0
      position absolute
      &:hover
        background-position -48px
      &:active
        background-position -96px
    .endTip
      text-align center
      position absolute
      top 0
      left 0
      right 0
      margin auto
      width 282px
      height 45px
      line-height 3.3
      color #000000
      background #f4e66c
      b
        padding 4px
        margin 7px
        border-radius 5px
        box-shadow inset 0 0 0 2px #000
</style>
