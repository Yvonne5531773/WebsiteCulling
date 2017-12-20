<template>
	<div class="content">
		<section class="container">
			<div class="description">
				<img src="../../../static/img/guide/title.png"/>
				<img src="../../../static/img/guide/desctiption.png"/>
			</div>
			<router-link :to="{path:'home', query:{ids: selectids}}">
				<div class="btn start" v-if="showStartBtn">
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
					</div>
				</div>
			</div>
		</section>
		<div class="bottom"></div>
	</div>
</template>
<script>
	import {  } from 'service'
	import _ from 'lodash'
	import { getRequest, compareTime } from '../../config/utils'
	import { mapActions, mapGetters } from 'vuex'
	import Velocity from 'velocity-animate/velocity.min'
	import { mockData } from '../../mock/data.js'

	export default {
		data() {
			return {
				chooseBtnTxt: '选择几个兴趣试试',
				startBtnTxt: '开始使用',
				list: [],
				defaultAvatar: '../../../static/img/default.png',
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
		mounted() {
//			this.init()
			this.mockInit()
		},
		watch: {

		},
		computed: {
			...mapGetters([

			]),
		},
		methods: {
			init () {

			},
			mockInit(){
				this.list = _.filter(_.uniqBy(mockData, 'id'), (d) => {
					return !_.isEmpty(d.name)
				})
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
				let block = this.$refs.rBody[row].childNodes[index]
				this.rows[row].list[index].id!=='0' && Velocity(block, { scaleX: 1.05, scaleY: 1.05 }, { duration: 100 }) && (block.style.fontSize = '17px')
				this.change(row, index, this.colors[row][index], block)
			},
			leave (row, index) {
				let block = this.$refs.rBody[row].childNodes[index]
				this.rows[row].list[index].id!=='0' && !this.rows[row].list[index].selected && Velocity(block, { scaleX: 1, scaleY: 1 }, { duration: 50 }) && (block.style.backgroundColor = '', block.style.boxShadow = '', block.style.fontSize = '18px')
			},
			click (row, index) {
				this.rows[row].list[index].selected = !this.rows[row].list[index].selected
				let block = this.$refs.rBody[row].childNodes[index]
				block.style.color = this.rows[row].list[index].selected? '#000000' : ''
				this.rows[row].list[index].id!=='0' && (block.style.fontSize = '17px')
				this.change(row, index, this.colors[row][index], block)
				this.showStartBtn = !_.isEmpty(this.checkSelects())
				this.selectids = this.getSelectids()
			},
			change (row, index, color, block) {
				this.rows[row].list[index].id!=='0' && !this.rows[row].list[index].selected && (block.style.backgroundColor = color, block.style.boxShadow = '0px 2px 18px'+color, block.style.scaleX = 1.05, block.style.scaleY = 1.05)
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
			}
		},
		components: {

		}
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
		position absolute
		.container
			width 1180px
			min-height 768px
			margin-left auto
			margin-right auto
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
						/*&:nth-child(4n - 3)
							margin-left 74px
						&:nth-child(-n + 4)
							margin-top 0*/
						.mask
							width 105px
							height 105px
							background url("../../../static/img/guide/small-mask.png") no-repeat
						.big-mask
							background url("../../../static/img/guide/big-mask.png") no-repeat !important
		.bottom
			background url('../../../static/img/guide/bottom.png') no-repeat
			position absolute
			width 100%
			height 30%
			bottom 0
</style>