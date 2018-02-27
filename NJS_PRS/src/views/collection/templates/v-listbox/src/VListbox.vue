<template>
  <div class="v-list">
    <div class="list-content">
      <VBanner :category="category"></VBanner>
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
        <VFunction :category="category" :show="isFixed" :scrollEle="$refs.content" :type="2"></VFunction>
      </div>
    </div>
  </div>
</template>

<script>
	import { getHost, md5, getOperationFullTime } from 'utils/index'
	import { dataServicePath } from 'config/index'
//  import { mockList } from 'mock/list'
  export default {
	  name: 'VListbox',
	  data() {
		  return {
			  size: 0,
			  category: {},
			  sites: [],
			  list: [],
			  listArr: [],
			  offest: 800,
			  loadIndex: 0,
			  isFixed: false,
			  refreshing: false,
			  nomore: false,
			  txt: this.$txt.TXT_35,
			  loadTxt: this.$txt.TXT_36,
			  refreshTxt: this.$txt.TXT_37,
			  noMoreTxt: this.$txt.TXT_38,
		  }
	  },
	  async mounted() {
		  await this.init()
	  },
	  computed: {
		  categoryid() {
			  return this.$route.query.categoryid || ''
		  },
	  },
	  methods: {
		  async init() {
			  const config = JSON.parse(this.$route.query.config)
			  this.size = config.loadCount || 20
			  this.list = await this.getList()
			  this.listArr = this.listArr.concat(this.constructList())
			  this.category = await this.constructCategory(this.categoryid)
			  this.sites = await this.constructSites()
			  this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int', {
				  action: 1,
				  name: this.categoryid + '',
				  url: '',
				  action_time: getOperationFullTime(new Date()),
				  number1: 0,
				  number2: 0
			  })
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
			  if (_.isEmpty(sites)) return
			  for (let i = 0; i < sites.length; i++) {
				  let site = sites[i],
					  si = _.find(localSites, {'id': site.id + ''})
				  site.liked = !_.isEmpty(si) ? si.liked : false
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
			  if (_.isEmpty(this.list)) return []
			  const start = this.size * this.loadIndex++,
				  end = this.size * this.loadIndex
			  return this.list.slice(start, end)
		  },
		  loadmore(flag) {
			  setTimeout(() => {
				  const fecth = this.constructList(),
					  length = this.listArr.length
				  this.listArr = this.listArr.concat(fecth)
				  length === this.listArr.length && (this.nomore = true)
				  flag === 1 && this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int', {
					  action: 9,
					  name: this.category.id + '',
					  url: '',
					  action_time: getOperationFullTime(new Date()),
					  number1: this.listArr.length,
					  number2: 0
				  })
			  }, 100)
		  },
		  response(event) {
			  this.isFixed = event
		  },
		  open(flag, data) {
			  window.open(data.href)
			  this.$api.reportByInfoc('liebao_urlchoose_detail:366 action:byte name:string url:string ver:byte action_time:string number1:int number2:int', {
				  action: 8,
				  name: this.category.id + '',
				  url: data.href,
				  action_time: getOperationFullTime(new Date()),
				  number1: 0,
				  number2: 0
			  })
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

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .list-content
    position fixed
    top 85px
    bottom 0
    overflow-x hidden
    margin 0
    padding 0
    width 100%
    .list
      display flex
      position relative
      top 30px
      margin auto
      width 1100px
      .list-l
        margin-right 33px
        margin-bottom 55px
        width 820px
        .head
          position relative
          bottom 5px
          font-size 14px
          color #6346de
        .refreshing
          text-align center
          width 100%
          .spinner
            right 4px
            margin 10px auto
            width 20px
            height 20px
        .item
          display flex
          padding 21px 30px
          box-sizing border-box
          background #fff
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
            position absolute
            bottom 0
            background #edeff1
            height 1.4px
            width 92.8%
          .bubble
            position relative
            padding 15px 0 0 20px
            color #5b5b5b
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
</style>
