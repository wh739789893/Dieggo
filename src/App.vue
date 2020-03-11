<template>
  <div id="app">
    <keep-alive>
      <!-- 需要缓存时 -->
        <router-view v-if="$route.meta.isAlive"></router-view>
    </keep-alive>
    <!-- 不需要缓存 -->
     <router-view v-if="!$route.meta.isAlive"></router-view>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
</style>
