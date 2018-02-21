<template>
  <div class="v-list">
    <VHeader ref="header" :favoritePage="true"></VHeader>
    <div ref="content" class="content">
      <VBanner :category="category" @back="back" :collect="collect"></VBanner>
      <div class="list">
        <section class="list-l">
          <h2 class="head">{{txt}}</h2>
          <div class="refreshing" v-if="refreshing">
            <div class="cssloading-circle spinner"></div>
            <h2>{{refreshTxt}}</h2>
          </div>
          <VRecyclist :list="listArr" :size="size" :loadmore="loadmore" :scrollElement="$refs.content" :offset="offest" :loadTxt="loadTxt" :nomore="nomore" @response="response($event)">
            <!--<template slot="tombstone" scope="props">-->
              <!--<div class="item tombstone">-->
                <!--<div class="avatar"></div>-->
                <!--<div class="bubble">-->
                  <!--<p></p>-->
                  <!--<p></p>-->
                  <!--<p></p>-->
                  <!--<div class="meta">-->
                    <!--<time class="posted-date"></time>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
            <!--</template>-->
            <template slot="item" scope="props">
              <div class="item">
                <a @click="open(1, props.data)">
                  <div class="avatar" :style="{backgroundImage: 'url(' + (props.data.image || '') + ')'}"></div>
                </a>
                <div class="bubble">
                  <p @click="open(2, props.data)">{{ props.data.title | clip(50) }}</p>
                  <a class="meta" @click="open(3, props.data)">
                    <span class="summary">{{ props.data.summary | clip(150) }}</span>
                  </a>
                </div>
                <div class="b-line" v-if="props.index!==props.lastIndex"></div>
              </div>
            </template>
            <div slot="nomore">{{noMoreTxt}}</div>
          </VRecyclist>
        </section>
        <VOriginlist :isFixed="isFixed" :categoryid="categoryid" :sites="sites"></VOriginlist>
        <VFunction :category="category" :show="isFixed" :scrollEle="$refs.content" :type="2" :collect="collect"></VFunction>
      </div>
    </div>
    <VAlert v-show="showAlert"></VAlert>
  </div>
</template>

<script>
	import { websiteApi } from 'api'
	import { getHost, md5, getOperationFullTime } from '../../config/utils'
	import { dataServicePath } from '../../config/config'
	import Velocity from 'velocity-animate/velocity.min'
  import {mockList} from '../../mock/list'
  export default {
	  data () {
		  return {
			  size: 0,
			  category: {},
        sites: [],
        list: [],
			  listArr: [],
			  collectAlertSTO: {},
			  offest: 800,
			  loadIndex: 0,
			  showAlert: false,
        isFixed: false,
        refreshing: false,
			  nomore: false,
			  txt: this.$txt.TXT_35,
			  loadTxt: this.$txt.TXT_36,
			  refreshTxt: this.$txt.TXT_37,
        noMoreTxt: this.$txt.TXT_38,
		  }
	  },
	  async mounted () {
		  await this.init()
	  },
	  computed: {
		  categoryid() {
			  return this.$route.query.categoryid || ''
		  },
	  },
    methods: {
	    async init () {
		    const config = JSON.parse(this.$route.query.config)
	    	this.size = config.loadCount || 20
	    	this.list = await this.getList()
		    this.category = await this.constructCategory(this.categoryid)
        this.sites = await this.constructSites()
		    websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:1,name:this.categoryid+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
	    },
      async getList() {
	      const path = dataServicePath + 'index/' + this.categoryid + '.json',
		      list = await this.getJSON(path)
	      return _.unionBy(list, 'title')
//			  return _.unionBy(mockList, 'title')
      },
      async constructSites() {
	      let sites = _.cloneDeep(this.category.sites)
	      const localSites = await this.getSite()
	      if(_.isEmpty(sites)) return
	      for(let i = 0; i < sites.length; i++){
		      let site = sites[i],
			      si = _.find(localSites, {'id': site.id+''})
		      site.liked = !_.isEmpty(si)? si.liked:false
		      site.liked && (sites.splice(i, 1), sites.unshift(site))
		      site.iconLazyObj = {
		      	src: this.addHttp(site.icon),
			      error: 'static/img/default-icon.png',
			      loading: 'static/img/default-icon.png'
          }
	      }
        return sites
      },
	    constructList() {
		    const start = this.size* this.loadIndex++,
			    end = this.size* this.loadIndex
        return this.list&&this.list.length>0? this.list.slice(start, end):[]
	    },
	    loadmore(flag) {
		    setTimeout(() => {
			    const fecth = this.constructList(),
            length = this.listArr.length
			    this.listArr = this.listArr.concat(fecth)
			    length===this.listArr.length && (this.nomore=true)
			    flag===1&&websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:9,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:this.listArr.length,number2:0})
		    }, 200)
	    },
	    response(event) {
	    	this.isFixed = event
      },
	    collect () {
		    !this.category.collected && (this.showAlert = true,
			    this.collectAlertSTO = setTimeout( () => {
				    this.showAlert = false
			    }, 1800))
		    this.category.collected && this.collectAlertSTO && (this.showAlert = false, clearTimeout(this.collectAlertSTO))
		    this.category.collected = !this.category.collected
		    this.saveForm(this.category)
		    this.category = _.cloneDeep(this.category)
		    this.category.collected && websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:4,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
	    },
	    back() {
		    const header = this.$refs.header
		    header && header.change && header.change('VDiscover')
		    websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:6,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date()),number1:0,number2:0})
	    },
	    open(flag, data) {
        window.open(data.href)
		    websiteApi.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int',{action:8,name:this.category.id+'',url:data.href,action_time:getOperationFullTime(new Date()),number1:0,number2:0})
      },
	    refresh() {
		    this.refreshing = true
	    	setTimeout(() => {
			    this.refreshing = false
        }, 1000)
        this.backToTop()
      }
    },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .v-list
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
    overflow hidden
    .content
      overflow-x hidden
      top 85px
      bottom 0
      margin 0
      padding 0
      position fixed
      width 100%
      .list
        display flex
        width 1100px
        margin auto
        zoom 1
        position relative
        top 30px
        .list-l
          width 820px
          margin-right 33px
          margin-bottom 55px
          .head
            font-size 14px
            position relative
            bottom 5px
            color #6346de
          .refreshing
            text-align center
            width 100%
            .spinner
              margin 10px auto
              width 20px
              height 20px
              right 4px
          .item
            padding 21px 30px
            background #fff
            box-sizing border-box
            display: flex;
            .avatar
              width 188px
              height 124px
              background-size cover
              outline none
            p
              margin-bottom 8px
              word-wrap break-word
              color #333
              font-size 20px
            .b-line
              background #edeff1
              height 1.4px
              width 92.8%
              position absolute
              bottom 0
            .bubble
              color #5b5b5b
              position relative
              padding 15px 0 0 20px
              font-size 14px
              p
                cursor pointer
                &:hover
                  color #6346de
              .meta
                overflow hidden
                .summary
                  color #5b5b5b
                  &:hover
                    color #6346de
  .lightbox
    position fixed
    top 0
    left 0
    z-index 9999
    width 100%
    height 100%
    padding 2px
    background rgba(0, 0, 0, 0.8)
    box-sizing border-box
    font-size 0
  .fix
    position fixed
    top 85px
    z-index 9
    height 46px
    width 820px
    background #edeff1
    h2
      position relative
      top 20px
      color #6346de
</style>
