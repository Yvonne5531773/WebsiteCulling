<template>
	<div class="v-search-result">
		<div>
			<span class="result-name">{{inputText}}</span>
			<span class="result-number">{{vm.length}}</span>
		</div>
		<section class="s-r-list">
			<div class="list-item" v-for="(resource, index) in vm">
				<div class="name">
					<span>{{resource.name}}</span>
				</div>
				<div class="l-b">
					<div class="actor">
						<span>{{resource.actors}}</span>
					</div>
					<div class="region">
						<span>{{resource.region}}</span>
					</div>
					<div class="size">
						<span>{{resource.size}}</span>
					</div>
				</div>
				<div class="download-list">
					<a v-if="download.type===`迅雷`||download.type===`磁力`" v-for="(download, index) in resource.downloads" href="#" class="download-icon" :thunderHref="mThunderEncode(download.src)" thunderResTitle="" :thunderPid="tpid" onClick="return OnDownloadClick_Simple(this ,2 ,4)" oncontextmenu="ThunderNetwork_SetHref(this)" onmousedown="pushtocnzz()">{{download.type}}</a>
					<a v-if="download.type!==`迅雷`&&download.type!==`磁力`" v-for="(download, index) in resource.downloads" class="download-icon" @click.stop="open(download.src)">{{download.type}}</a>
				</div>
				<a target="_blank" @click.stop="open(resource.host, 1)" class="r-b" v-if="resource.host">
					<span>{{resource.host}}</span>
				</a>
			</div>
		</section>
	</div>
</template>

<script>
	export default {
		name: 'VSearchresult',
		data() {
			return {
				vm: [],
			}
		},
		props: {
			resources: {
				type: Array
			},
			inputText: {
				type: String
			},
			tpid: {
				type: String
			},
			mThunderEncode: {
				type: Function
			}
		},
		computed: {
			categoryid() {
				return this.$route.query.categoryid || ''
			},
		},
		mounted() {
			this.init()
		},
		methods: {
			async init() {
				this.vm = _.cloneDeep(this.resources)
				console.log('this.inputText', this.inputText)
//				this.$api.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte', {
//					action: 1,
//					name: this.category.name,
//					url: ''
//				})
			},
			open(url, type) {
				type === 1 && (url = '//'+url)
				window.open(url)
			}
		},
	}
</script>

<style lang="stylus" scoped>
	.v-search-result
		margin-top 25px
		font-size 12px
		color #5b5b5b
		.result-name
			color #000000
			&:before
				content ('为您找到 ')
				color #5b5b5b
			&:after
				content (' 相关资源 ')
				color #5b5b5b
		.result-number
			&:after
				content (' 个')
		.s-r-list
			margin-top 10px
			width 100%
			background #fff
			.list-item
				display flex
				position relative
				padding 20px 0 15px 20px
				border-bottom 1px solid #edeff1
				height 50px
				.l-b
					display flex
					position absolute
					bottom 7px
			span
				display inline-block
				overflow hidden
				text-overflow ellipsis
				-o-text-overflow ellipsis
				white-space nowrap
				color #5b5b5b
				width 100%
			.name
				span
					font-size 14px
					color #1a1a1a
					cursor pointer
			.actor
				margin-right 40px
				width 133px
			.region
				margin-right 30px
				width 88px
			.size
				width 80px
			.download-list
				position absolute
				margin-right 10px
				right 0
				.download-icon
					display inline-block
					border-radius 100px
					padding 2px 10px 2px 10px
					margin-right 10px
					text-align center
					color #644ee2
					background-color #b8afe24d
					&:hover
						color #fff
						background-color #7664e4
					&:active
						color #fff
						background-color #503ccb
			.r-b
				display flex
				position absolute
				bottom 12px
				right 20px
				width 167px
				color #808080
				&:hover
					color #644ee2
					span
						color #644ee2
				&:before
					content '资源来源 :'
					width 110px

</style>