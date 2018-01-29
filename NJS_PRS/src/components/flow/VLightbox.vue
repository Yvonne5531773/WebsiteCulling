<template>
  <div class="v-images">
    <div ref="content" class="content">
      <VHeader ref="header" :favoritePage="true"></VHeader>
      <div class="c-t">
        <img class="banner" src="../../../static/img/flow/banner.png"/>
        <div class="title">
          <a class="back" @click="back">
            {{backTxt}}
          </a>
          <span class="name">{{category.name}}</span>
          <div class="add" :style="category.collected&&`backgroundPosition:-540px`" @click="collect" v-if="categoryid!==`0099`">
            <img src="../../../static/img/favorite/start.png" />
            <span v-if="category.collected">{{collectTxt}}</span>
            <span v-else>{{noCollectTxt}}</span>
          </div>
        </div>
      </div>
      <VWaterfall :imgsArr='imgsArr' :imgWidth="imgWidth" @scrollLoadImg="fetchImgsData" @changeIndex="changeImg($event)"></VWaterfall>
      <transition :duration="300" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div ref="lightbox" class="lightbox" v-if="isShow" @click="isShow=!modalclose">
          <VFancybox ref="fancybox" :images="articles" :index="articlesIndex" :reset="!isShow" :category="category" @close="closeImg" @addIndex="nextImg" @decIndex="prevImg" @addLike="likeSite($event)" :showclosebutton="showclosebutton" :showcaption="showcaption" :imagecountseparator="imagecountseparator" :showimagecount="showimagecount"></VFancybox>
          <VPaginator :images="articles" :activeIndex="articlesIndex" :category="category" @changeIndex="changeArticle($event)" v-show="showthumbnails"></VPaginator>
        </div>
      </transition>
    </div>
    <VAlert v-show="showAlert"></VAlert>
  </div>
</template>

<script>
	import VWaterfall from 'components/flow/childrens/VWaterfall'
	import VHeader from 'components/common/VHeader'
  import VFancybox from 'components/flow/childrens/VFancybox'
  import VPaginator from 'components/flow/childrens/VPaginator'
	import VAlert from 'components/common/VAlert'
	import { websiteApi } from 'api'
	import { service } from 'components/common/mixin'
	import { getHost, md5, getOperationFullTime } from '../../config/utils'
	import { mapMutations } from 'vuex'
	import { mockImages } from '../../mock/images1'

  export default {
	  data () {
		  return {
			  categoryid: this.$route.query.categoryid,
			  categoryname: this.$route.query.name,
			  category: {},
			  noCollectTxt: '加入收藏',
			  collectTxt: '取消收藏',
			  likeTxt: '收藏',
			  likedTxt: '已收藏',
        backTxt: '返回',
			  catePath: '/v1/category/',
			  images: [],
			  imgsArr: [],
			  articles: [],
			  fetchImgsArr: [],
			  imgWidth: 254,
			  isShow: false,
			  index: 0,
			  articlesIndex: 0,
			  IMAGE_LOAD_COUNT: 20,
			  LOAD_INDEX: 0,
			  DATA_SERVICE_HOST: 'http://act.cmcmcdn.com/liebao/website/',
			  changeTime: 100,
			  showAlert: false,
			  collectAlertSTO: {},
        modalclose: true,
			  keyinput: true,
			  mousescroll: true,
			  showclosebutton: false,
			  showcaption: false,
			  imagecountseparator: '',
			  showimagecount: false,
			  showthumbnails: true,
        showFullScreen: false,
		  }
	  },
	  mixins: [service],
    async created () {
      if(this.isShow) {
        window.addEventListener('keydown', this.keyFun)
        window.addEventListener('mousewheel', this.wheelFun)
      }
//	    this.images = mockImages
      const path = this.DATA_SERVICE_HOST + 'index/' + this.categoryid + '.json'
      this.images = await this.getJSON(path)
	    this.imgsArr = this.constructImages()
	    console.log('created this.images', this.images)
	    this.fetchImgsArr = this.constructImages()
    },
	  async mounted () {
		  await this.init()
		  this.$nextTick(()=>{
			  this.category = _.cloneDeep(this.category)
		  })
	  },
	  watch: {
		  async isShow () {
			  if (this.isShow) {
				  window.addEventListener('keydown', this.keyFun)
				  this.$nextTick(()=>{
					  this.$refs.lightbox.addEventListener('mousewheel', this.wheelFun)
				  })
          const contentEl = this.$refs.content
				  contentEl.style.position = 'relative'
				  const img = this.imgsArr[this.index],
					  path = this.DATA_SERVICE_HOST + 'json/' + this.categoryid + '/' + md5(img.href, 32) + '.json'
				  img.articles = _.isEmpty(img.articles)? await this.getJSON(path):img.articles
				  this.articles = this.constructArticles(img)
				  websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:2,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
			  } else {
				  window.removeEventListener('keydown', this.keyFun)
				  this.$refs.lightbox.removeEventListener('mousewheel', this.wheelFun)
				  const contentEl = this.$refs.content
				  contentEl.style.position = 'fixed'
				  this.articlesIndex = 0
				  this.articles = []
			  }
		  }
	  },
    methods: {
	    ...mapMutations(['SET_LIKED']),
	    constructImages() {
	    	const start = this.IMAGE_LOAD_COUNT* this.LOAD_INDEX++,
		      end = this.IMAGE_LOAD_COUNT* this.LOAD_INDEX++,
          res = this.images&&this.images.length>0? this.images.slice(start, end):[]
//		    res.forEach(r => {
//		    	r.lazy = {
//				    src: r.image,
//				    error: '',
//				    loading: ''
//			    }
//        })
		    return res
      },
	    async init () {
		    this.category = {
		    	id: this.categoryid,
		    	name: this.categoryname
        }
		    await this.construct()
		    this.category = _.cloneDeep(this.category)
		    websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:1,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
	    },
	    async construct () {
		    const localCategories = await this.getForm(),
			    localSites = await this.getSite(),
			    cat = _.find(localCategories, {'id': this.categoryid+''})
		    this.category.collected = !_.isEmpty(cat)? cat.collected:false
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
		    site.liked && this.SET_LIKED({liked: true})
		    site.liked && websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:3,name:this.category.id+'', url:site.url,action_time:getOperationFullTime(new Date())})
	    },
	    collect () {
		    !this.category.collected && (this.showAlert = true,
			    this.collectAlertSTO = setTimeout( () => {
				    this.showAlert = false
			    }, 1800))
		    this.category.collected && this.collectAlertSTO && (this.showAlert = false, clearTimeout(this.collectAlertSTO))
		    this.category.collected = !this.category.collected
		    this.saveForm(this.category)
		    this.category.collected && websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:4,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
	    },
	    fetchImgsData() {
		    this.imgsArr = [...this.imgsArr, ...this.fetchImgsArr]
		    this.fetchImgsArr = this.constructImages()
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
            data.from = img.articles.url? '来自 '+getHost(img.articles.url):''
            data.liked = img.liked
			      data.id = img.id
			      retArr.push(data)
		      }
	      })
	      for (let i = 0, len = retArr.length; i < len; i++) {
		      retArr[i].total = len
	      }
	      return retArr
      },
      async getJSON(path) {
        let data = {}
        try {
	        const res = await this.submitHTTPRequest([path, '', ''])
	        data = res && !_.isEmpty(res.return_data)? JSON.parse(res.return_data) : {}
        } catch (e) {
	    		console.log('error:', e)
        }
        return data
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
						    websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:15,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
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
						    websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:16,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
					    }
					    this.timeout = setTimeout(() => {
						    this.timeout = null
					    }, this.changeTime)
				    }
			    }
		    }
	    },
	    back() {
	    	const header = this.$refs.header
		    header && header.change && header.change('VDiscover')
		    websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:6,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
      }
    },
    components: {
	    VHeader,
	    VWaterfall,
	    VFancybox,
	    VPaginator,
	    VAlert
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
      /*overflow auto*/
      overflow-x hidden
      position fixed
      /*position sticky*/
      width 100%
      height 100%
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
