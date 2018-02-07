<template>
	<section class="discover-page">
		<div class="containerRow">
			<ul>
				<li class="c-l" :key="data.id" v-for="(data, index) in dataList" v-if="data&&data.categories.length>0">
					<div class="head">
						<div class="left">
							<b class="flag"></b>
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
							<li :key="category.id" v-for="category in data.showCategories" >
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
	import {service} from 'components/common/mixin'
	import { getStore } from '../../config/utils'
	import { mapState } from 'vuex'
	import Velocity from 'velocity-animate/velocity.min'
	import { websiteApi } from 'api'
	import { themePath } from '../../config/config'
	import txt from '../../config/txt'
	export default {
		data() {
			return {
				dataList: [],
				pullTxt: txt.TXT_25,
				pushTxt: txt.TXT_26,
			}
		},
		mixins: [service],
		mounted() {
			this.init()
		},
		computed:{
			...mapState([
				'position'
			])
		},
		watch: {

		},
		methods: {
			async init () {
				websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:1,value:0,hotsite:0,url:'',name:''})
				const store = getStore('THEME_IDS')? getStore('THEME_IDS'):''
				let themeid = ''
				if(store && store.length > 0) {
					themeid = store
				}else {
					let info = await this.getSelectedInfo()
					themeid = info? info:''
				}
				let themes = await this.jsonp(themePath + themeid)
				this.dataList = _.cloneDeep(_.sortBy(_.forEach(themes, (d) => {
					if(themes.length > 2) {
						d.showCategories = d.categories? d.categories.slice(0, 3):[]
					}else {
						d.showCategories = _.cloneDeep(d.categories)
					}
					d.event = 0
				})), ['sort'])
				this.$nextTick(()=>{
					this.dataList.length <= 2 && this.$refs.body && this.$refs.body.forEach( (b, i) => {
						let count = this.dataList[i].categories.length
						b.style.maxHeight = 360*(Math.floor(count/3)+1)+'px'
					})
					this.position.name==='VDiscover' && this.gotoPosition(this.position.scrolly)
				})
			},
			pullEvent(data, index){
				if(data.event===0){ //down
					data.showCategories = _.cloneDeep(data.categories)
					const durationVal = 120*(Math.floor(data.showCategories.length/3)+1)
					//下拉动画
					let count = this.dataList[index].categories.length
					Velocity(this.$refs.pull[index], { rotateZ: "90deg" }, { duration: durationVal})
					Velocity(this.$refs.body[index], { maxHeight: 360*(Math.floor(count/3)+1) }, { duration: durationVal, complete: ()=>{
						data.event = 1
					}})
					websiteApi.reportByInfoc('liebao_urlchoose_find:355 action:byte value:byte hotsite:byte ver:byte url:string name:string',{action:4,value:0,hotsite:0,url:'',name:this.dataList[index].id+''})
				}else if (data.event===1) { //up
					data.event = 0
					//收缩动画
					Velocity(this.$refs.pull[index], { rotateZ: "0deg" })
					Velocity(this.$refs.body[index], { maxHeight: 365 }, {complete: () => {
						data.showCategories = _.cloneDeep(data.categories.slice(0,3))
					}})
				}
			},
			gotoPosition(position) {
				document.documentElement.scrollTop = position
				document.body.scrollTop = position
			}
		},
		components: {
			VAlert,
			VItem,
			VRecommend
		},
	}
</script>

<style lang="stylus" scoped>
		.discover-page
			margin 112px auto
			width 1040px
			.containerRow
				margin 0 auto
				width 762px
				float left
				.c-l
					margin-bottom 10px
				.head
					position relative
					height 24px
					white-space nowrap
					.left
						float left
						.flag
							background url("../../../static/img/my/f-f.png") no-repeat
							width 20px
							height 20px
							float left
							margin 3px 5px 0 0
						.head-t
							float left
							vertical-align middle
							display inline-block
							font-size 18px
							line-height 22px
							color #5454a6
					.right
						float right
						position relative
						top 8px
						cursor pointer
						span
							position relative
							font-size 12px
							color #333333
							bottom 2px
						.pull
							float right
							width 16px
							height 16px
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
						padding-top 17px
						overflow hidden
						li
							float left
							list-style none
							margin 0 20px 20px 0
							width 239px
							height 314px
							text-align center
							color gray
							-webkit-box-sizing border-box
							box-sizing border-box
							background #fff
							font-size 14px
							position relative
							&:nth-child(3n)
								margin-right 0
</style>