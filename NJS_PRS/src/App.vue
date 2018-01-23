<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

export default {
	name: 'app'
}

</script>

<style lang="stylus">
  html, body, #app
    height 100%

  *
    margin: 0
    padding: 0

  #app
    font-family microsoft yahei
    overflow auto

</style>
