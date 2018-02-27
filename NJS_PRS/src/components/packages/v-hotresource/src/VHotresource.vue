<template>
	<div class="v-hot-resource">
		<ul class="list-head">
			<li v-for="(item, index) in heads" :style="{width:item.width}">{{item.name}}</li>
		</ul>
		<table class="m-table">
			<tbody>
				<tr v-for="(resource, index) in vm" :style="index%2===0&&`backgroundColor:#fafafa`">
					<td class="name">
						<span>{{resource.name | clip(15)}}</span>
					</td>
					<td class="actor">
						<span>{{resource.actors | clip(40)}}</span>
					</td>
					<td class="region">
						<span>{{resource.region | clip(4)}}</span>
					</td>
					<td class="size">
						<span>{{resource.size | clip(5)}}</span>
					</td>
					<td>
						<a class="download-icon" @click.stop="downloadIconClick(resource)"></a>
						<div class="meun" v-if="resource.downloadShow">
							<a v-for="(download, index) in resource.downloads" class="m-item">{{download.type}}</a>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	export default {
		name: 'VHotresource',
		data() {
			return {
				vm: []
			}
		},
		props: {
			resources: {
				type: Array
			}
		},
		watch: {
			resources() {
				this.vm = _.cloneDeep(this.resources)
			}
		},
		computed: {
			categoryid() {
				return this.$route.query.categoryid || ''
			},
			heads() {
				return [
					{name: '资源名', width: '41%'},
					{name: '演员', width: '25%'},
					{name: '地区', width: '13%'},
					{name: '大小', width: '17%'},
					{name: '下载' },
				]
			},
		},
		mounted() {
			this.init()
		},
		methods: {
			async init() {
//				this.$api.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte', {
//					action: 1,
//					name: this.category.name,
//					url: ''
//				})
			},
			downloadIconClick(item) {
				item.downloadShow = true
//				this.$nextTick(() => {
					this.vm = _.cloneDeep(this.vm)
//				})
				console.log('downloadIconClick item', item)
			},
			open(site) {
				const url = site.href_url ? site.href_url : this.addHttp(site.url)
				window.open(url)
				this.$api.reportByInfoc('liebao_urlchoose_detail:352 action:byte name:string url:string ver:byte', {
					action: 2,
					name: this.category.name,
					url: site.url
				})
			},
		},
	}
</script>

<style lang="stylus" scoped>
	.v-hot-resource
		font-size 12px
		.list-head
			display flex
			padding 0 40px 10px 20px
			color #5B5B5B
		.m-table
			width 100%
			background #fff
			cursor pointer
			tr
				display flex
				height 36px
			td
				padding 10px 0
				text-align left
				&:nth-last-child(1)
					position relative
					padding-top 12px
			.left
				padding 0 0 0 12px
				width 44px
			span
				display inline-block
				overflow hidden
				text-overflow ellipsis
				-o-text-overflow ellipsis
				white-space nowrap
				color #5b5b5b
			.name
				width 37.7%
				padding-left 20px
				span
					width 220px
					color #1a1a1a
			.actor
				width 23.1%
				span
					width 140px
			.region
				width 11.7%
			.size
				width 16.7%
			.download-icon
				display inline-block
				width 15px
				height 14px
				background url("../../../../assets/img/collection/download.png") -10px -10px no-repeat
				&:hover
					background-position -45px -10px
				&:active
					background-position -80px -10px
			.meun
				position absolute
				right -31px
				border-radius 2px
				margin-top 6px
				background #fff
				box-shadow 0 2px 4px rgba(226,226,226,0.30), 0 1px 4px 0 #EFEDFA
				width 76px
				z-index 99
				/*a*/
					/*&:first-child*/
						/*border-width 0 5px 5px 5px*/
				.m-item
					display block
					height 30px
					line-height 30px
					text-align center
					color #644EE2
					border solid #fff
					border-width 0 5px 5px 5px
					&:first-child
						border-width 5px
					&:hover
						background-color #e1daf4
					&:active
						background-color #b8afe2
</style>