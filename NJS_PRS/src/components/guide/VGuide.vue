<template>
	<div class="content">
		<section class="container">
			<div class="description">
				<img src="../../../static/img/guide/title.png"/>
				<img src="../../../static/img/guide/desctiption.png"/>
			</div>
			<router-link :to="{path:'home', query:{themeid: selectids}}">
				<div class="btn start" v-if="showStartBtn" @click="start">
					<span>{{startBtnTxt}}</span>
				</div>
			</router-link>
			<div class="btn choose" v-if="!showStartBtn">
				<span>{{chooseBtnTxt}}</span>
			</div>
			<div class="category">
				<div ref="rBody" class="list" v-for="(row, i) in rows">
					<div @click="click(i, index)" @mouseenter="enter(i, index)" @mouseleave="leave(i, index)" :class="{'first':data.id===`0`}" class="block" :key="data.id" v-for="(data, index) in row.list" >
						<span class="title" :style="data.name.length>=6&&`height:50px;width:75px`">
							{{data.name}}
						</span>
						<div :class="{'big-mask':data.id===`0`}" class="mask"></div>
						<b v-show="data.id!==`0`" class="add"></b>
					</div>
				</div>
			</div>
		</section>
		<div class="bottom"></div>
	</div>
</template>
<script>
	import { websiteApi } from 'api'
	import _ from 'lodash'
	import { setStore, getStore } from '../../config/utils'
	import { jsonp } from 'components/common/mixin'
	import Velocity from 'velocity-animate/velocity.min'
	import { mockData } from '../../mock/data.js'

	export default {
		data() {
			return {
				chooseBtnTxt: '选择几个兴趣试试',
				startBtnTxt: '开始使用',
				list: [],
				defaultAvatar: '/static/img/default.png',
				rows: [],
				colors: {
					0: ['#ffe92e'],
					1: ['#ffe128', '#ffdd28', '#ffcf28', '#ff5683'],
					2: ['#ffd528', '#ffcb28', '#ffc02b', '#ff9d5c', '#ff865c'],
					3: ['#ffb533', '#ffa73c', '#ff865a', '#ff715a', '#ff5a6a', '#ff5a79']
				},
				showStartBtn: false,
				selectids: [],
			}
		},
		mixins: [jsonp],
		mounted() {
			this.init()
//			this.mockInit()
		},
		methods: {
			async init () {
				websiteApi.getUserSelectedInfo()
				let info = await websiteApi.getGlobalSelectedInfo(),
					array = !_.isEmpty(info)? info.split(',') : [],
					data = {}
				console.log('init info', info)
				console.log('init array', array)
				try {
					data = await this.jsonp('/v1/index')
				} catch (e) {
					console.log('index error: ', e)
				}
				console.log('init data', data)
				this.list = _.filter(_.uniqBy(data, 'id'), (d) => {
					return !_.isEmpty(d.name)
				})
				this.list.forEach( (l) => {
					l.id += ''
					array && !!~array.indexOf(l.id) && (l.selected = true)
				})
				console.log('init this.list', this.list)
				this.list = _.sortBy(this.list, ['sort'])
				let tlist = {}
				tlist.list = this.list.splice(0,1)
				this.rows.push(tlist)
				this.list.splice(3, 0, {id: '0', name: '热门推荐', selected: true})
				for(let i = 0; i < 3; i++){
					let data = {}
					data.list = this.list.splice(0, i + 4)
					this.rows.push(data)
				}
				console.log('init this.rows', this.rows)
				this.$nextTick( () => {
					this.showStartBtn = !_.isEmpty(this.checkSelects())
					this.rows.forEach( (row, i) => {
						row.list.forEach( (data, j) => {
							let block = this.$refs.rBody[i].childNodes[j],
								color = this.colors[i][j],
								addEl = block.querySelector('.add')
							data.id!=='0' && data.selected && block && (block.style.color = '#000000', block.style.fontSize = '17px', Velocity(block, { scaleX: 1.05, scaleY: 1.05 }, { duration: 100 }) && (block.style.fontSize = '17px', block.style.backgroundColor = color, block.style.boxShadow = '0px 2px 18px'+color))
							addEl && data.selected && Velocity(addEl, { opacity: 0 }, { duration: 200 })
						})
					})
				})
			},
			mockInit(){
				this.list = _.filter(_.uniqBy(mockData, 'id'), (d) => {
					return !_.isEmpty(d.name)
				})
				this.list = _.sortBy(this.list, ['sort'])
				let tlist = {}
				tlist.list = this.list.splice(0,1)
				this.rows.push(tlist)
				this.list.splice(3, 0, {id: '0', name: '热门推荐', selected: true})
				for(let i = 0; i < 3; i++){
					let data = {}
					data.list = this.list.splice(0, i + 4)
					this.rows.push(data)
				}
			},
			enter (row, index) {
				this.change('enter', row, index)
			},
			leave (row, index) {
				this.change('leave', row, index)
			},
			click (row, index) {
				this.change('click', row, index)
			},
			change (action, row, index) {
				let block = this.$refs.rBody[row].childNodes[index],
					data = this.rows[row].list[index],
					color = this.colors[row][index],
					selected = data.selected
				const addEl = block.querySelector('.add')
				if(data.id === '0') return
				switch (action) {
					case 'enter':
						Velocity(block, { scaleX: 1.05, scaleY: 1.05 }, { duration: 100 }) && (block.style.fontSize = '17px', block.style.backgroundColor = color, block.style.boxShadow = '0px 2px 18px'+color)
						return
					case 'leave':
						!selected && Velocity(block, { scaleX: 1, scaleY: 1 }, { duration: 50 }) && (block.style.backgroundColor = '', block.style.boxShadow = '0 8px 18px rgba(0,0,0,.06)', block.style.fontSize = '18px')
						return
					case 'click':
						data.selected = !data.selected
						block.style.color = data.selected? '#000000' : ''
						data.id!=='0' && (block.style.fontSize = '17px')
						this.showStartBtn = !_.isEmpty(this.checkSelects())
						this.selectids = this.getSelectids()
						setStore('THEME_IDS', this.selectids.join(','))
						!selected && (Velocity(block, { scaleX: 1.05, scaleY: 1.05 }, { duration: 100 }) && (block.style.fontSize = '17px', block.style.backgroundColor = color, block.style.boxShadow = '0px 2px 18px'+color))
						selected && (Velocity(block, { scaleX: 1, scaleY: 1 }, { duration: 50 }) && (block.style.backgroundColor = '', block.style.boxShadow = '0 8px 18px rgba(0,0,0,.06)', block.style.fontSize = '18px', block.style.color = '#606060'))
						if(addEl) {
							!selected && Velocity(addEl, { opacity: 0 }, { duration: 200 })
							selected && Velocity(addEl, { opacity: 1 }, { duration: 200 })
						}
						return
				}
			},
			checkSelects () {
				return this.rows.filter( (row) => {
					return !_.isEmpty(row.list.filter( (r) => {
						return r.id!=='0' && r.selected
					}))
				})
			},
			getSelectids () {
				let ids = []
				this.rows.forEach( (row) => {
					ids = ids.concat(row.list.filter( (l) => {
						return l.id!=='0' && l.selected
					}))
				})
				return ids.map((s)=>{
					return s.id
				})
			},
			start () {
				console.log('in start this.selectids.join(\',\')', this.selectids.join(','))
				websiteApi.setUserSelectedInfo(this.selectids.join(','))
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
		background #edeff1
		height 100%
		width 100%
		top 0
		bottom 0
		position fixed
		overflow-y scroll
		overflow-x hidden
		.container
			width 1180px
			height 768px
			margin auto
			left 0
			top 0
			bottom 0
			right 0
			position absolute
			z-index 9
			.description
				position relative
				left 30px
				font-family "PingFang SC"
				top 93px
				font-size 18px
				color #AFB4B9
				img
					display block
					&:nth-child(2)
						top 32px
						position relative
			.btn
				height 120px
				width 315px
				position absolute
				top 303px
				left 18px
				text-align center
				font-size 24px
				color #FFFFFF
				line-height 4.6
				z-index 9
			.choose
				background url("../../../static/img/guide/choose-btn.png") no-repeat
			.start
				background url("../../../static/img/guide/start-btn.png") no-repeat
				cursor pointer
			.category
				bottom 65px
				position absolute
				right 50px
				margin auto
				.list
					color #d6d6df
					font-size 18px
					float right
					width 850px
					.first
						background #ff5a79 !important
						color #000000 !important
						box-shadow 0 3px 8px #ff5a79 !important
						cursor auto !important
						transform scaleX(1.4) scaleY(1.4)
						right 21px
						bottom 21px
					.title
						margin auto
						top 0
						left 0
						right 0
						bottom 0
						position absolute
						height 25px
					.block
						font-size 18px
						float right
						list-style none
						margin 20px 0 0 20px
						width 105px
						height 105px
						text-align center
						-webkit-box-sizing border-box
						box-sizing border-box
						-webkit-box-shadow 0 8px 18px rgba(0,0,0,.06)
						box-shadow 0 8px 18px rgba(0,0,0,.06)
						border-radius 4px
						background-color  #d6d6df
						position relative
						cursor pointer
						color #606060
						&:hover
							color #000000
						.mask
							width 105px
							height 105px
							background url("../../../static/img/guide/small-mask.png") no-repeat
						.big-mask
							background url("../../../static/img/guide/big-mask.png") no-repeat !important
						.add
							background url("../../../static/img/guide/add.png") no-repeat
							width 13px
							height 13px
							position absolute
							top 0
							right 0
							margin 6px
							opacity 1
		.bottom
			background url('../../../static/img/guide/bottom.png') no-repeat
			position fixed
			width 100%
			height 30%
			bottom 0
</style>