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
	import { service } from 'components/common/mixin'
	export default {
		data() {
			return {
				inputText: '',
				txt: '请输入搜索内容 ',
				text: '',
				nowIndex: -1,
				result: [],
				inputTxt: '搜一搜',
				focus: false,
				path: 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su/wd=?wd='
			}
		},
		mixins: [service],
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
				let res = await this.submitHTTPRequest([path, '', ''])
				if(!_.isEmpty(res.return_data) && res.return_data.indexOf('w') === 0){
					res = res.return_data.replace(/^window\.baidu\.sug\(|\);?$/g, '').replace(/[a-zA-Z](?=\:)/g, '"$&"');
				}
				this.result = !_.isEmpty(res)? _.cloneDeep(JSON.parse(res).s):''
			},
			goto() {
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
		margin auto
		left 0
		right 0
		z-index 100
		font-size 14px
		width 780px
		.content
			display flex
			.logo
				background url("../../../static/img/baidu/logo.png") no-repeat
				width 140px
				height 40px
			.input
				width 497px
				height 38px
				text-indent 4px
				border 1px solid #6345de
			.btn
				input
					height 40px
					width 140px
					cursor pointer
					color #fff
					letter-spacing 1px
					background #6345de
					border none
					font-size 14px
					&:hover
						background #8368f9
					&:active
						background #4f33c7
		ul
			z-index 199
			margin auto
			left 274px
			width 497px
			position absolute
			background #fff
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
