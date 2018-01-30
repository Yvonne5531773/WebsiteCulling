<template>
  <div class="v-list">
    <div ref="content" class="content">
      <VHeader ref="header" :favoritePage="true"></VHeader>
      <VBanner :category="category" @back="back" @collect="collect"></VBanner>
      <div class="list">
        <section class="list-l">
          <VRecyclist :list="listArr" :size="size" :loadmore="loadmore" :scrollElement="$refs.content" :offset="offest">
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
                <div>
                  <div class="avatar" :style="{backgroundImage: 'url(' + (props.data.image || '') + ')'}"></div>
                </div>
                <div class="bubble">
                  <p>{{ props.data.title }}</p>
                  <div class="meta">
                    <span class="summary">{{ props.data.summary }}</span>
                  </div>
                </div>
                <div class="b-line" v-if="props.index!==props.lastIndex"></div>
              </div>
            </template>
          </VRecyclist>
        </section>
        <VFrom></VFrom>
      </div>
    </div>
    <VAlert v-show="showAlert"></VAlert>
  </div>
</template>

<script>
	import VHeader from 'components/common/VHeader'
	import VBanner from 'components/common/VBanner'
	import VRecyclist from 'components/list/childrens/VRecyclist'
	import VFrom from 'components/list/childrens/VFrom'
	import VAlert from 'components/common/VAlert'
	import { websiteApi } from 'api'
	import { service } from 'components/common/mixin'
	import { getHost, md5, getOperationFullTime } from '../../config/utils'
	import { mapMutations } from 'vuex'
	import { mockList } from '../../mock/list'

  export default {
	  data () {
		  return {
			  categoryid: this.$route.query.categoryid||'',
			  categoryname: this.$route.query.name||'',
			  category: {},
			  catePath: '/v1/category/',
			  listArr: [],
			  size: 20,
			  offest: 600,
			  loadIndex: 0,
			  DATA_SERVICE_HOST: 'http://act.cmcmcdn.com/liebao/website/',
			  showAlert: false,
			  collectAlertSTO: {},
		  }
	  },
	  mixins: [service],
	  computed: {
		  list() {
//			  mockList.forEach(data => {
//			  	data.lazy = {
//					  src: data.image,
//          }
//			  })
			  console.log('compute list mockList', mockList)
			  return mockList
		  },
    },
	  async mounted () {
		  await this.init()
	  },
    methods: {
	    ...mapMutations(['SET_LIKED']),
	    async init () {
		    this.category = await this.construct()
		    websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:1,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
	    },
	    async construct () {
		    const category = {
			    id: this.$route.query.categoryid,
			    name: this.$route.query.name
		    }
		    const localCategories = await this.getForm(),
			    localSites = await this.getSite(),
			    cat = _.find(localCategories, {'id': category.id+''})
		    this.category.collected = !_.isEmpty(cat)? cat.collected:false
//        this.images.forEach((item) => {
//		    	if(item) {
//				    const result = _.find(localSites, {'url': item.href})
//				    item.liked = !_.isEmpty(result)? result.liked:false
//				    item.id = !_.isEmpty(result)? result.id:(new Date()).valueOf()+Math.floor(Math.random()*1000 + 1)+''
//          }
//        })
        return category
	    },
	    loadmore() {
		    setTimeout(() => {
			    const fecth = this.constructList()
			    this.listArr = this.listArr.concat(fecth)
			    console.log('in loadmore this.listArr', this.listArr)
		    }, 1000)
	    },
	    constructList() {
		    const start = this.size* this.loadIndex++,
			    end = this.size* this.loadIndex,
			    res = this.list&&this.list.length>0? this.list.slice(start, end):[]
		    return res
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
	    back() {
		    const header = this.$refs.header
		    header && header.change && header.change('VDiscover')
		    websiteApi.reportByInfoc('liebao_urlchoose_detail:363 action:byte name:string url:string ver:byte action_time:string',{action:6,name:this.category.id+'',url:'',action_time:getOperationFullTime(new Date())})
	    },
    },
    components: {
	    VHeader,
	    VBanner,
	    VRecyclist,
	    VAlert,
	    VFrom
    }
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
    .content
      overflow-x hidden
      position fixed
      width 100%
      height 100%
      .list
        display flex
        width 1100px
        margin auto
        zoom 1
        position relative
        top 115px
        .list-l
          width 820px
          margin-right 30px
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
              width 93%
              position absolute
              bottom 0
            .bubble
              color #5b5b5b
              position relative
              padding 15px 0 0 20px
              font-size 14px
              .meta
                height 44px
                overflow hidden
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
