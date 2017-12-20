<template>
	<div class="f-content">
		<transition name="fade" >
			<div class="foot" v-show="show">
				<img src="../../../static/img/foot/foot.png" />
				<p>{{txt}}</p>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				txt: '到底啦！',
				show: false,
				scrollVal: 0,
				bottom: 0,
			}
		},
		watch: {
			scrollVal (val) {
				this.scrollVal = val
				if(this.scrollVal === this.getScrollHeight()){
					setTimeout(()=>{
						this.show = true
					}, 200)
				}
				if(this.scrollVal < this.getScrollHeight()){
					this.show = false
				}
			}
		},
		mounted(){
			window.onscroll = ()=>{
				return (() => {
					this.scrollVal = this.getScrollTop() + this.getWindowHeight()
				})()
			};
		},
		methods: {
			getScrollTop(){
				let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
				if(document.body){
					bodyScrollTop = document.body.scrollTop;
				}
				if(document.documentElement){
					documentScrollTop = document.documentElement.scrollTop;
				}
				scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
				return scrollTop;
			},
			getScrollHeight(){
				let scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
				if(document.body){
					bodyScrollHeight = document.body.scrollHeight;
				}
				if(document.documentElement){
					documentScrollHeight = document.documentElement.scrollHeight;
				}
				scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
				return scrollHeight;
			},
			getWindowHeight(){
				let windowHeight = 0;
				if(document.compatMode === "CSS1Compat"){
					windowHeight = document.documentElement.clientHeight;
				}else{
					windowHeight = document.body.clientHeight;
				}
				return windowHeight;
			}
		}
	}
</script>

<style lang="stylus">
	.fade-enter-active, .fade-leave-active
		transition: opacity .8s ease-in
	.fade-enter, .fade-leave-to
		opacity: 0
	.f-content
		margin 0 auto
		position relative
		height 60px
		clear both
		top 120px
		width 260px
		.foot
			position relative
		img
			float left
			margin 1px 8px 30px
		p
			float left
			font-size 12px
			color #a2a2a2
</style>
