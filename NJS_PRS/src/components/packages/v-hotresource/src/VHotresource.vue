<template>
	<div class="v-hot-resource">
		<ul class="list-head">
			<li v-for="(item, index) in heads" :style="{width:item.width}">{{item.name}}</li>
		</ul>
		<table class="m-table">
			<tbody>
			<tr v-for="(resource, index) in resources" :style="index%2===0&&`backgroundColor:#fafafa`">
				<td class="name">
					<a target="_blank" :href="resource.link">
						<span>{{resource.name | clip(15)}}</span>
					</a>
				</td>
				<td class="name">
					<a>
						<span>{{resource.actors | clip(40)}}</span>
					</a>
				</td>
				<td class="name">
					<a>
						<span>{{resource.region | clip(8)}}</span>
					</a>
				</td>
				<td class="name">
					<a>
						<span>{{resource.size | clip(10)}}</span>
					</a>
				</td>
				<td class="url">
					<a target="_blank">{{resource.region | clip(10)}}</a>
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

			}
		},
		props: {
			resources: {
				type: Array
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
			}
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
			tr
				height 36px
			td
				padding 6px 14px
				text-align left
			.left
				padding 0 0 0 12px
				width 44px
			span
				text-overflow ellipsis
				-o-text-overflow ellipsis
				white-space nowrap
				overflow hidden
			.name
				width 150px
				padding 6px 0 0 0
				img
					float left
					width 16px
					height 16px
					padding 5px 6px 0 0
				span
					line-height 2
					color #333333
			.description
				width 416px
				span
					width 380px
					display block
					color #5b5b5b
			.url
				padding 0
				span
					color #5b5b5b
					width 230px
					display block
</style>