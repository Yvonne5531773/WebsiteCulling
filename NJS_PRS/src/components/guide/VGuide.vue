<template>
	<div class="content">
		<section class="container">
			<div class="top">
				<img src="../../../static/img/guide/title.png"/>
			</div>
			<div class="theme">
				<div ref="rBody" class="list" v-for="(row, i) in rows">
					<div @click="click(i, index)" @mouseenter="enter(i, index)" @mouseleave="leave(i, index)" class="block" :key="data.id" v-for="(data, index) in row.list" :style="data.color_mode==0&&`color:#333333`" :title="data.name">
						<div style="overflow:hidden;z-index:8">
							<img :src="addHttp(data.avator)" />
							<img :src="addHttp(data.avator_src)" style="display: none"/>
							<div class="b-bottom">
								<span class="title">
									{{data.name}}
								</span>
							</div>
						</div>
						<img src="../../../static/img/guide/block-cover.png" class="cover">
						<b :class="[data.selected?'check checked':'check no-check']"></b>
					</div>
				</div>
			</div>
			<router-link :to="{path:'home'}">
				<div v-if="hasSelected" class="btn start" @click="start">
					<span>{{startBtnTxt}}</span>
					<b class="button-gif" :style="vGif&&`backgroundPosition:-24px`"></b>
				</div>
			</router-link>
			<div class="btn no-select" v-if="!hasSelected">
				<span>{{noSelectBtnTxt}}</span>
			</div>
		</section>
		<!--<div class="bottom"></div>-->
		<transition
			name="holeTran"
			:duration="400"
			enter-active-class="animated fadeIn"
			leave-active-class="animated fadeOut"
		>
			<div class="overlay" v-show="hole" @click="tipClose">
				<div ref="hole" class="hole">
					<div class="light">
						<div class="tip">
							<a class="close" @click="tipClose" title="关闭"></a>
							<p style="padding: 32px">
								<span>{{tipTxt1}}</span>
								<span>{{tipTxt2}}</span>
							</p>
						</div>
					</div>
				</div>
				<!--<div style="background: rgba(0,0,0,0.6); " class="mask"></div>-->
			</div>
		</transition>
	</div>
</template>
<script>
	import { websiteApi } from 'api'
	import _ from 'lodash'
	import { mapMutations } from 'vuex'
	import { setStore, getStore } from '../../config/utils'
	import { service } from 'components/common/mixin'
	import Velocity from 'velocity-animate/velocity.min'

	export default {
		data() {
			return {
				startBtnTxt: '开始使用',
				noSelectBtnTxt: '选择几个兴趣试试',
				list: [],
				rows: [],
				infoArray: [],
				selectids: [],
				resIds: [],
				path: '/v1/index',
				ROW_NUM: 3,
				COLUMN_NUM: 7,
				vGif: false,
				hole: false,
				lightBlock: {},
				lightBlockEl: {},
				tipTxt1: '选择兴趣',
				tipTxt2: '马上发现优质网站',
				gifSI: '',
				tipSTO: '',
				hasSelected: true
			}
		},
		mixins: [service],
		mounted() {
			this.init()
			this.gif()
		},
		methods: {
			...mapMutations(['SET_COMPONENT', 'SAVE_POSITION']),
			async init () {
				websiteApi.reportByInfoc('liebao_urlchoose_taste:350 action:byte taste:byte ver:byte',{action:1,taste:0})
				let info = await this.getSelectedInfo(),
					data = {}
				this.infoArray = !_.isEmpty(info)? info.split(',') : []
				try {
					data = await this.jsonp(this.path)
				} catch (e) {
					console.log('error: ', e)
				}
				this.list = _.filter(_.uniqBy(data, 'id'), (d) => {
					return !_.isEmpty(d.name)
				})
				this.resIds = this.list.map(l => l.id)
				this.list.forEach( (l) => {
					l.id += ''
					l.sort = 0
					this.infoArray && !!~this.infoArray.indexOf(l.id) && (l.selected = true, l.sort = 1)
				})
				this.list = _.orderBy(this.list, ['sort'], ['desc'])
				for(let i = 0; i < this.ROW_NUM; i++){
					let data = {}
					data.list = this.list.splice(0, this.COLUMN_NUM)
					this.rows.push(data)
				}
				this.$nextTick( () => {
					this.rows.forEach( (row, i) => {
						row.list.forEach( (data, j) => {
							const block = this.$refs.rBody[i].childNodes[j]
							block.velocityInActEnd = block.velocityActEnd = true
							data.selected && block && this.actived(block)
						})
					})
					_.isEmpty(this.checkSelects()) && (this.hasSelected = false, !this.rows[0].list[0].selected && this.change('click', 0, 0))
					this.doHole()
				})
			},
			enter (row, index) {
				this.change('enter', row, index)
			},
			leave (row, index) {
				this.change('leave', row, index)
			},
			click (row, index) {
				this.change('click', row, index)
				this.rows[row].list[index].selected && websiteApi.reportByInfoc('liebao_urlchoose_taste:350 action:byte taste:byte ver:byte',{action:2,taste:this.rows[row].list[index].id})
			},
			change (action, row, index) {
				let block = this.$refs.rBody[row].childNodes[index],
					data = this.rows[row].list[index]
				switch (action) {
					case 'enter':
						this.actived(block)
						return
					case 'leave':
						!data.selected && this.inActived(block)
						return
					case 'click':
						data.selected = !data.selected
						data.selected && this.actived(block)
						!data.selected && this.inActived(block)
						this.rows = _.cloneDeep(this.rows)
						this.changeSelectids(data)
						this.saveIds()
						this.hasSelected = !_.isEmpty(this.checkSelects())
						return
				}
			},
			actived(block) {
				const imgs = block.getElementsByTagName('img')
				imgs[0].style.display = 'none'
				imgs[1].style.display = 'block'
				imgs[2].style.display = 'block'
				if(block.velocityActEnd){
					block.velocityActEnd=false
					Velocity(imgs[0],{scaleX: 1.2, scaleY: 1.2},{duration:100,complete:()=>{block.velocityActEnd=true}})
					Velocity(imgs[1],{scaleX: 1.2, scaleY: 1.2},[0,.3,.6,1],{duration: 100})
				}
			},
			inActived(block) {
				const imgs = block.getElementsByTagName('img')
				imgs[0].style.display = 'block'
				imgs[1].style.display = 'none'
				imgs[2].style.display = 'none'
				if(block.velocityInActEnd){
					block.velocityInActEnd=false
					Velocity(imgs[0],{scaleX:1,scaleY: 1},{duration: 0,complete:()=>{block.velocityInActEnd=true}})
					Velocity(imgs[1],{scaleX: 1, scaleY: 1},{duration: 0})
				}
			},
			checkSelects () {
				return this.rows.filter( (row) => {
					return !_.isEmpty(row.list.filter( (r) => {
						return r.selected
					}))
				})
			},
			changeSelectids (data) {
				data.selected && this.selectids.push(data.id)
				!data.selected && !!~this.infoArray.indexOf(data.id) && this.infoArray.splice(this.infoArray.indexOf(data.id), 1)
				!data.selected && !!~this.selectids.indexOf(data.id) && this.selectids.splice(this.selectids.indexOf(data.id), 1)
			},
			saveIds() {
				const ids = this.selectids? [...this.selectids, ...this.infoArray]:[],
					storeIds = ids.length>0? ids.join(','):''
				setStore('THEME_IDS', storeIds)
				websiteApi.setUserSelectedInfo(storeIds)
			},
			start () {
				const arrIds = [...this.selectids,...this.infoArray]
				let ids = this.selectids? (arrIds.length>0? arrIds:this.resIds):[],
					storeIds = ids.length>0? ids.join(','):''
				websiteApi.reportByInfoc('liebao_urlchoose_taste:350 action:byte taste:byte ver:byte',{action:3,taste:ids.length})
				websiteApi.setUserSelectedInfo(ids?ids.join(','):'')
				this.SET_COMPONENT({component: 'VDiscover'})
				this.SAVE_POSITION({position: 0})
				setStore('THEME_IDS', storeIds)
				this.gifSI && clearInterval(this.gifSI)
			},
			gif() {
				this.gifSI = setInterval(() => {
					this.vGif = !this.vGif
				}, 500)
			},
			doHole() {
				if(getStore('SHOW_TIP')==='1') return
				this.lightBlock = this.rows[0].list[5]
				if(this.lightBlock.selected) return
				this.lightBlockEl = this.$refs.rBody[0].childNodes[5]
				const bLight = this.lightBlockEl.getBoundingClientRect()
				let holeEl = this.$refs.hole
				holeEl.style.top = bLight.top-31+'px'
				holeEl.style.left = bLight.left-29+'px'
				setTimeout(() => {
					this.lightBlock.selected = true
					this.hole = true
					this.actived(this.lightBlockEl)
					this.tipSTO = setTimeout(() => {
						this.tipClose()
					}, 10* 1000)
				}, 1000)
			},
			tipClose() {
				this.tipSTO && typeof this.tipSTO==='number' && clearTimeout(this.tipSTO)
				this.hole = false
				this.lightBlock.selected = false
				this.inActived(this.lightBlockEl)
				setStore('SHOW_TIP', 1)
			}
		},
	}
</script>

<style lang="stylus" scoped>
	.content
		zoom 1
		display flex
		-webkit-box-orient vertical
		-webkit-box-direction normal
		-ms-flex-direction column
		flex-direction column
		-webkit-box-align stretch
		-ms-flex-align stretch
		align-items stretch
		-ms-flex-negative 0
		flex-shrink 0
		background #f7f9fb
		height 100%
		width 100%
		top 0
		bottom 0
		position fixed
		overflow-x hidden
		.container
			width 1180px
			max-height 768px
			min-height 687px
			margin auto
			left 0
			top 0
			bottom 0
			right 0
			position absolute
			z-index 9
			.top
				position relative
				margin auto
				width 398px
				top 45px
				img
					display block
					&:nth-child(2)
						top 14px
						position relative
			.btn
				position absolute
				bottom 30px
				left 0
				right 0
				margin auto
				text-align center
				font-size 24px
				color #FFFFFF
				line-height 3.6
				background url("../../../static/img/guide/start-btn.png") no-repeat
				height 96px
				width 271px
			.start
				letter-spacing 6px
				&:hover
					background-position -266px
				&:active
					background-position -532px
				.button-gif
					background url("../../../static/img/guide/buttongif.png") no-repeat
					width 24px
					height 20px
					position absolute
					bottom 10px
					left 0
					right 0
					margin auto
			.no-select
				font-size 22px
				background-position -266px
			.theme
				bottom 170px
				position absolute
				width 1045px
				margin auto
				left 0
				right 0
				.list
					font-size 16px
					float right
					display flex
					.block
						font-size 16px
						margin 10px 0 0 10px
						width 140px
						height 140px
						text-align center
						-webkit-box-sizing border-box
						box-sizing border-box
						position relative
						cursor pointer
						color #ffffff
						display flex
						.cover
							position absolute
							top -10px
							left -17px
							display none
						.b-bottom
							position absolute
							bottom 0
							left 0
							width 100%
							height 27px
							background-position 0 -537px
							.title
								margin auto
								left 0
								right 0
								bottom 16px
								position absolute
								height 15px
								z-index 9
						.check
							width 37px
							height 25px
							position absolute
							z-index 11
							right 0
						.checked
							background url('../../../static/img/guide/checked.png') no-repeat
						.no-check
							background url('../../../static/img/guide/nocheck.png') no-repeat
		.bottom
			background url('../../../static/img/guide/bottom.png') no-repeat
			position fixed
			width 100%
			height 30%
			bottom 0
		.overlay
			position fixed
			z-index 999
			top 0
			width 100%
			height 100%
			.hole
				height 200px
				width 200px
				position absolute
				border-radius 50%
				box-shadow rgba(0, 0, 0, 0.6) 0px 0px 1px 10000px
				.light
					position absolute
					top 0
					bottom 0
					left 0
					right 0
					.tip
						background url('../../../static/img/guide/tip.png') no-repeat
						background-position right
						width 210px
						height 115px
						position absolute
						top 205px
						color #000000
						font-size 16px
						span
							display block
						.close
							background url('../../../static/img/guide/close.png') no-repeat
							width 10px
							height 10px
							position absolute
							right 22px
							top 24px
	@media screen and (max-height:727px)
		.container
			.theme
				bottom 133px !important
</style>