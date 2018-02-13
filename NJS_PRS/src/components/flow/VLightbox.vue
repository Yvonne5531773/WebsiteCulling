<template>
  <div class="v-images">
    <VHeader ref="header" :favoritePage="true"></VHeader>
    <div ref="content" class="content">
      <VBanner :category="category" :collect="collect" @back="back"></VBanner>
      <VWaterfall v-if="imgsArr&&imgsArr.length>0" :imgsArr='imgsArr' :imgWidth="imgWidth" :maxCols="maxCols" :fetchImgsData="fetchImgsData" @scrollLoadImg="fetchImgsData" @changeIndex="changeImg($event)" @response="response($event)"></VWaterfall>
      <transition :duration="300" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div ref="lightbox" class="lightbox" v-if="isShow" @click="isShow=!modalclose" :style="!isFullScreen&&`padding:0 20px 0 20px`">
          <VFancybox ref="fancybox" :images="articles" :index="articlesIndex" :reset="!isShow" :category="category" :isFullScreen="isFullScreen" @close="closeImg" @addIndex="nextImg" @decIndex="prevImg"></VFancybox>
          <VPaginator ref="paginator" :images="articles" :activeIndex="articlesIndex" :category="category" :gif="gif" @changeIndex="changeArticle($event)" @addLike="likeSite($event)"></VPaginator>
          <transition :duration="600" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <span v-show="isFullScreen&&showEndTip" class="endTip">{{endTip1}}<b>esc</b>{{endTip2}}</span>
          </transition>
          <a v-if="isFullScreen" title="退出全屏模式" class="close" @click.stop="close"></a>
        </div>
      </transition>
    </div>
    <VAlert v-show="showAlert"></VAlert>
    <VFunction :category="category" :show="showFunction" :scrollEle="scrollEle" :type="1" :collect="collect"></VFunction>
  </div>
</template>

<script>
	import VHeader from 'components/common/VHeader'
	import VBanner from 'components/common/VBanner'
	import VWaterfall from 'components/flow/childrens/VWaterfall'
  import VFancybox from 'components/flow/childrens/VFancybox'
  import VPaginator from 'components/flow/childrens/VPaginator'
	import VAlert from 'components/common/VAlert'
	import VFunction from 'components/common/VFunction'
	import { websiteApi } from 'api'
	import { mapState } from 'vuex'
	import { service } from 'components/common/mixin'
	import { getHost, md5, getOperationFullTime } from '../../config/utils'
	import txt from '../../config/txt'
	import { dataServicePath } from '../../config/config'
  import { mockImages } from '../../mock/image'
  export default {
	  data () {
		  return {
			  categoryid: this.$route.query.categoryid||'',
			  categoryname: this.$route.query.name||'',
			  imgWidth: '',
			  maxCols: '',
			  firstLoadCount: '',
			  loadCount: '',
        gif: false,
			  category: {},
			  images: [],
			  imgsArr: [],
			  articles: [],
			  fetchImgsArr: [],
			  isShow: false,
			  index: 0,
			  articlesIndex: 0,
			  LOAD_INDEX: 0,
			  changeTime: 100,
			  showAlert: false,
			  collectAlertSTO: {},
			  scrollEle: {},
        modalclose: true,
			  keyinput: true,
			  mousescroll: true,
			  showFunction: false,
			  showEndTip: false,
        fetchSTO: {},
			  likeTxt: txt.TXT_14,
			  likedTxt: txt.TXT_15,
			  endTip1: txt.TXT_19,
        endTip2: txt.TXT_20
		  }
	  },
	  mixins: [service],
    async created () {
      if(this.isShow) {
        window.addEventListener('keydown', this.keyFun)
        window.addEventListener('mousewheel', this.wheelFun)
      }
      console.log('this.$route.query.config', this.$route.query.config)
      const config = JSON.parse(this.$route.query.config)
      this.imgWidth = config.imgWidth || 254
	    this.maxCols = config.maxCols || 8
      this.firstLoadCount = config.firstLoadCount || 16
		  this.loadCount = config.loadCount || 16
      this.gif = config.gif

	    this.images = mockImages
//      const path = dataServicePath + 'index/' + this.categoryid + '.json'
//      this.images = await this.getJSON(path)
	    this.images = _.unionBy(this.images, 'image')
	    this.imgsArr = this.images.slice(0, this.firstLoadCount)
	    this.fetchImgsArr = this.constructImages()
    },
    computed: {
	    ...mapState([
		    'isFullScreen'
	    ]),
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
				  websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:2,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
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
			  !this.isFullScreen&&websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:21,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
      }
	  },
    methods: {
	    async init () {
		    await this.construct()
		    websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:1,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
	    },
	    async construct () {
		    this.category = await this.constructCategory()
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
		    site.liked && websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:3,name:this.category.id+'',url:site.url,action_time:getOperationFullTime(new Date()),number1:0,number2:0})
	    },
	    collect() {
		    !this.category.collected && (this.showAlert = true,
			    this.collectAlertSTO = setTimeout( () => {
				    this.showAlert = false
			    }, 1800))
		    this.category.collected && this.collectAlertSTO && (this.showAlert = false, clearTimeout(this.collectAlertSTO))
		    this.category.collected = !this.category.collected
		    this.saveForm(this.category)
		    this.category.collected &&  websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:4,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
	    },
	    fetchImgsData() {
		    !_.isEmpty(this.fetchSTO) && clearTimeout(this.fetchSTO)
		    this.imgsArr = [...this.imgsArr, ...this.fetchImgsArr]
		    this.fetchImgsArr = this.constructImages()
        this.fetchSTO = setTimeout(() => {
	        this.imgsArr = [...this.imgsArr, ...this.fetchImgsArr]
        }, 100)
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
				      loading: 'static/img/flow/gif.svg'
            } : null
			      retArr.push(data)
		      }
	      })
	      for(let i = 0, len = retArr.length; i < len; i++) {
		      retArr[i].total = len
	      }
	      console.log('constructArticles retArr', retArr)
	      return retArr
      },
	    back() {
		    const header = this.$refs.header
		    header && header.change && header.change('VDiscover')
		    websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:6,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
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
						    !this.isFullScreen&&websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:15,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
						    this.isFullScreen&&websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:20,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
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
    components: {
	    VHeader,
	    VBanner,
	    VWaterfall,
	    VFancybox,
	    VPaginator,
	    VAlert,
	    VFunction
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .v-images
    zoom 1
    display -ms-flexbox
    display flex
    -ms-flex-direction column
    flex-direction column
    -ms-flex-align stretch
    align-items stretch
    -ms-flex-negative 0
    flex-shrink 0
    width 100%
    height 100%
    top 0
    bottom 0
    position absolute
    .content
      overflow-x hidden
      top 85px
      bottom 0
      margin 0
      padding 0
      position fixed
      width 100%
      .c-t
        position relative
        top 85px
        background-color black
        .banner
          position absolute
          opacity 0.5
          z-index 1
        .title
          width 1100px
          margin auto
          height 140px
          font-size 30px
          color #fff
          position relative
          z-index 2
          .back
            background url("../../../static/img/flow/back.png") no-repeat
            width 96px
            height 56px
            top 23px
            left -13px
            position absolute
            font-size 12px
            color #fff
            line-height 3.6
            text-align center
            padding-left 3px
            &:hover
              background-position -96px
            &:active
              background-position -192px
          .name
            position absolute
            bottom 20px
          .add
            background url("../../../static/img/favorite/add.png") no-repeat
            width 270px
            height 77px
            cursor pointer
            right -10px
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
      background url("../../../static/img/flow/close.png") no-repeat
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
