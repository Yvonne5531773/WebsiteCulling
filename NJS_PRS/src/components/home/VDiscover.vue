<template>
	<section class="container">
		<div class="containerRow">
			<ul>
				<li :key="data.id" v-for="(data, index) in dataList">
					<div class="head">
						<div class="left">
							<b class="circle"></b>
							<span class="head-t">
									<a target="_blank">
										<h2>{{data.name}}</h2>
									</a>
								</span>
						</div>
						<div class="right" @click="pullEvent(data, index)">
							<span>{{pullTxt}}</span>
							<b ref="pull" class="pull"></b>
						</div>
					</div>
					<div class="body" ref="body">
						<ul class="list">
							<li :key="category.id" v-for="category in data.categories">
								<VItem :category="category"></VItem>
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
	import VFoot from 'components/common/VFoot'
	import VAlert from 'components/common/VAlert'
	import VRecommend from 'components/home/VRecommend'
	import {  } from 'service'
	import _ from 'lodash'
	import { getRequest } from '../../config/utils'
	import { mapActions, mapGetters } from 'vuex'
	import Velocity from 'velocity-animate/velocity.min'
	import { mockData } from '../../mock/data'

	export default {
		data() {
			return {
				dataList: [],
				pullTxt: '查看全部',

			}
		},
		mounted() {
			this.init()
		},
		watch: {

		},
		computed: {
			...mapGetters([

			]),
		},
		methods: {
			init () {
				const ids = this.$route.query.ids
				let data = []
				data = _.filter(_.uniqBy(mockData, 'id'), (d) => {
					return ids && !_.isEmpty(d.name) && !!~ids.indexOf(d.id)
				})
				this.dataList = _.cloneDeep(_.forEach(data, (d) => {
					d.event = 0
				}))
			},
			pullEvent(data, index){
				if(data.event===0){ //down
					const durationVal = 400
					data.event = 1
					this.$nextTick(()=>{

					})
					//下拉动画
					Velocity(this.$refs.pull[index], { rotateZ: "90deg" }, { duration: durationVal })
					Velocity(this.$refs.body[index], { maxHeight: 1000 }, { duration: durationVal, complete: ()=>{}})
				}else if (data.event===1) { //up
					data.event = 0
					//收缩动画
					Velocity(this.$refs.pull[index], { rotateZ: "0deg" })
					Velocity(this.$refs.body[index], { maxHeight: 365 }, { complete: ()=>{}})
				}
			},
		},
		components: {
			VFoot,
			VAlert,
			VItem,
			VRecommend
		}
	}
</script>

<style lang="stylus" scoped>
	/*.home*/
		/*zoom 1*/
		/*display flex*/
		/*-webkit-box-orient vertical*/
		/*-webkit-box-direction normal*/
		/*-ms-flex-direction column*/
		/*flex-direction column*/
		/*-webkit-box-align stretch*/
		/*-ms-flex-align stretch*/
		/*align-items stretch*/
		/*-ms-flex-negative 0*/
		/*flex-shrink 0*/
		/*width 100%*/
		/*height 100%*/
		.container
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
							a
								color #5454a6
							h2
								font-size 18px!important
								line-height 24px
								font-weight normal
					.right
						float right
						position relative
						right 70px
						top 8px
						cursor pointer
						span
							position relative
							font-size 12px
							color #333333
							bottom .5em
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
							width 242px
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
							&:nth-child(4n - 3)
								/*margin-left 18px*/
							&:nth-child(-n + 4)
								margin-top 0
</style>