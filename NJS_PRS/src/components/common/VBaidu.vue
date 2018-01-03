<template>
	<div class="baidu-search">
		<div class="content">
			<a class="logo" target="_blank" href="http://www.baidu.com"></a>
			<input type="text" class="input" :placeholder="txt" v-model='inputText' @keyup='show($event)' @keydown.down='down()' @keydown.up.prevent='up()' @focus="focusInput" @blur="blurInput">
			<span class="btn" @click="goto()">
	     <input type="submit" :value="inputTxt" >
	    </span>
		</div>
		<ul v-show="focus">
			<li v-for="(item, index) in result" :class='{bgcolor: index==nowIndex}' @click="goItem(item)">
				{{item}}
			</li>
		</ul>
	</div>
</template>

<script>
	import { websiteApi } from 'api'
	import { jsonp } from 'components/common/mixin'
	export default {
		data() {
			return {
				inputText: '',
				txt: '请输入搜索内容 ',
				text: '',
				nowIndex: -1,
				result: [],
				inputTxt: '搜索',
				focus: false,
				path: 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su/wd=?wd='
			}
		},
		mixins: [jsonp],
		methods: {
			async show (ev) {
				if (ev.keyCode === 38 || ev.keyCode === 40) {
					if (this.nowIndex < -1){
						return;
					}
					if (this.nowIndex !== this.result.length && this.nowIndex !== -1) {
						this.inputText = this.result[this.nowIndex];
					}
					return;
				}
				if (ev.keyCode === 13) {
					window.open('https://www.baidu.com/s?wd=' + this.inputText, '_blank');
					this.inputText = '';
				}
				this.text = this.inputText;
				const path = "http://unionsug.baidu.com/su?wd=" + encodeURIComponent(this.inputText) + "&p=3&cb=window.baidu.sug&ie=UTF-8&t=" + Date.now();
				websiteApi.submitHTTPRequest(path)
				let res = await websiteApi.getGlobalResponse(),
					response = {}
				if(res.return_data.indexOf('w') === 0){
					res = res.return_data.replace(/^window\.baidu\.sug\(|\);?$/g, '').replace(/[a-zA-Z](?=\:)/g, '"$&"');
				}
				response = JSON.parse(res)
				this.result = _.cloneDeep(response.s)
			},
			goto () {
				websiteApi.reportByInfoc('liebao_urlchoose_mine:353 action:byte url:string value:byte ver:byte',{action:2,url:'',value:0})
				window.open('https://www.baidu.com/s?wd=' + this.inputText, '_blank');
			},
			goItem(item) {
				window.open('https://www.baidu.com/s?wd=' + item, '_blank');
			},
			down () {
				this.nowIndex++;
				if (this.nowIndex === this.result.length) {
					this.nowIndex = -1;
					this.inputText = this.text;
				}
			},
			up () {
				this.nowIndex--;
				if (this.nowIndex < -1){
					this.nowIndex = -1;
					return;
				}
				if (this.nowIndex === -1) {
					this.nowIndex = this.result.length;
					this.inputText = this.text;
				}
			},
			focusInput () {
				this.focus = true
			},
			blurInput () {
				setTimeout( () => {
					this.focus = false
				}, 100)
			}
		},
	}
</script>

<style lang="stylus">
	.baidu-search
		position absolute
		top 135px
		margin auto
		left 0
		right 0
		width 720px
		z-index 100
		font-size 14px
		.content
			display flex
			.logo
				background url("../../../static/img/baidu/logo.png") no-repeat
				width 140px
				height 40px
			.input
				width 475px
				height 40px
				text-indent 4px
			.btn
				input
					height 40px
					width 105px
					cursor pointer
					color #fff
					letter-spacing 1px
					background #5454a6
					border 1px solid #5454a6
					font-size 16px
		ul
			margin auto
			left 17px
			right 0
			width 474px
			position relative
			background white
			box-shadow 1px 1px 3px #ededed
			-webkit-box-shadow 1px 1px 3px #ededed
			li
				list-style none
				margin-top 5px
				padding 8px
				cursor pointer
				&:hover
					background #ccc
			.bgcolor
				background #ccc
</style>
