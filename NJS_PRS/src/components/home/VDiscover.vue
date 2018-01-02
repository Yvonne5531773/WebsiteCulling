<template>
	<section class="discover-page">
		<div class="containerRow">
			<ul>
				<li :key="data.id" v-for="(data, index) in dataList">
					<div class="head">
						<div class="left">
							<b class="circle"></b>
							<span class="head-t">
								{{data.name}}
							</span>
						</div>
						<div class="right" @click="pullEvent(data, index)" v-show="dataList.length > 2 && data.categories.length>3">
							<span v-if="data.event===0">{{pullTxt}}</span>
							<span v-else>{{pushTxt}}</span>
							<b ref="pull" class="pull"></b>
						</div>
					</div>
					<div class="body" ref="body">
						<ul class="list">
							<li :key="category.id" v-for="category in data.categories">
								<VItem :themeid="data.id" :category="category"></VItem>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<VRecommend></VRecommend>
	</section>
</template>
<script>
	import VItem from 'components/home/VItem'
	import VAlert from 'components/common/VAlert'
	import VRecommend from 'components/home/VRecommend'
	import {jsonp} from 'components/common/mixin'
	import _ from 'lodash'
	import { getStore } from '../../config/utils'
	import { mapActions, mapGetters } from 'vuex'
	import Velocity from 'velocity-animate/velocity.min'
	import { websiteApi } from 'api'
	import { mockData } from '../../mock/data'

	export default {
		data() {
			return {
				dataList: [],
				pullTxt: '查看全部',
				pushTxt: '收起内容',
				path: '/v1/theme/'
			}
		},
		mixins: [jsonp],
		mounted() {
			this.init()
		},
		methods: {
			async init () {
				websiteApi.reportByInfoc('liebao_urlchoose_find:351 action:byte value:byte hotsite:byte ver:byte',{action:1,value:0,hotsite:0})
				const store = getStore('THEME_IDS')&&getStore('THEME_IDS').split(',')
				let query = this.$route.query.themeid,
					ids = query?(_.isArray(query)?query:[...new Array(query)]):[]
				const themeid = ids&&ids.length>0?ids:(store.length>0?store:[])

				let themes = await this.jsonp(this.path + themeid.join(','))
				this.dataList = _.cloneDeep(_.sortBy(_.forEach(themes, (d) => {
					d.event = 0
				})), ['sort'])
				this.$nextTick(()=>{
					this.dataList.length <= 2 && this.$refs.body && this.$refs.body.forEach( (b, i) => {
						let count = this.dataList[i].categories.length
						b.style.maxHeight = 353*(Math.floor(count/3)+1)+'px'
					})
				})
			},
			pullEvent(data, index){
				if(data.event===0){ //down
					const durationVal = 400
					//下拉动画
					let count = this.dataList[index].categories.length
					Velocity(this.$refs.pull[index], { rotateZ: "90deg" }, { duration: durationVal})
					Velocity(this.$refs.body[index], { maxHeight: 353*(Math.floor(count/3)+1) }, { duration: durationVal, complete: ()=>{
						data.event = 1
					}})
					websiteApi.reportByInfoc('liebao_urlchoose_find:351 action:byte value:byte hotsite:byte ver:byte',{action:4,value:0,hotsite:0})
				}else if (data.event===1) { //up
					data.event = 0
					//收缩动画
					Velocity(this.$refs.pull[index], { rotateZ: "0deg" })
					Velocity(this.$refs.body[index], { maxHeight: 365 })
				}
			},
		},
		components: {
			VAlert,
			VItem,
			VRecommend
		}
	}
</script>

<style lang="stylus" scoped>
		.discover-page
			margin 112px auto
			width 1098px
			.containerRow
				margin 0 auto
				width 882px
				float left
				.head
					position relative
					height 24px
					white-space nowrap
					.left
						float left
						.circle
							background url("../../../static/img/home/circle.png") no-repeat
							width 20px
							height 20px
							float left
							margin 3px 5px 0 0
						.head-t
							float left
							vertical-align middle
							display inline-block
							font-size 18px
							line-height 24px
							color #5454a6
					.right
						float right
						position relative
						right 80px
						top 8px
						cursor pointer
						span
							position relative
							font-size 12px
							color #333333
							bottom 2px
							right 5px
						.pull
							float right
							width 13px
							height 15px
							position relative
							cursor pointer
							background url("../../../static/img/home/pull.png") no-repeat
				.body
					max-height 365px
					overflow hidden
					&:after
						content ''
						display block
						visibility hidden
						height 0
						clear both
						font-size 0
					.list
						padding-top 26px
						overflow hidden
						li
							float left
							list-style none
							margin 20px 28px 26px 10px
							width 239px
							height 314px
							text-align center
							color gray
							-webkit-box-sizing border-box
							box-sizing border-box
							-webkit-box-shadow 0 8px 18px rgba(0,0,0,.06)
							box-shadow 0 8px 18px rgba(0,0,0,.06)
							background #fff
							font-size 14px
							position relative
							border-radius 4px
							margin-top 0

</style>