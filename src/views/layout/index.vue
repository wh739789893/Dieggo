<template>
  <div class="container">
     <van-nav-bar   @click-right="$router.push('/search')"   v-if="showNavBar" fixed title="雷讯讯达" right-text="搜索"></van-nav-bar>
     <!-- 二级路由容器 -->
     <div class="my-wrapper" :class="{ noTop: !showNavBar}">
       <!-- 组件缓存 -->
       <keep-alive>
          <router-view></router-view>
       </keep-alive>
     </div>
     <!-- 标签栏 -->
     <van-tabbar route>
         <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
         <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
         <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
         <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
     </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout',
  computed: {
    showNavBar () {
      return this.$route.path !== '/user'
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
