<template>
  <div class="container">
     <van-tabs v-model="activeIndex" swipeable>
       <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
          <!-- 阅读记忆 -->
          <!-- <div class="scroll-wrapper">
              <van-cell-group>
                 <van-cell v-for="obj in 20" :key="obj" :title="item"></van-cell>
              </van-cell-group>
          </div> -->
          <!-- 引入组件 -->
          <article-list></article-list>
       </van-tab>
     </van-tabs>
     <span class="bar_btn">
        <van-icon name="wap-nav"></van-icon>
     </span>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getMychannels } from '@/api/channel'
export default {
  name: 'home',
  components: {
    ArticleList
  },
  created () {
    this.getMychannels()
  },
  data () {
    return {
      activeIndex: 0, // 默认启动第0个标签
      channels: [] // 频道数据
    }
  },
  methods: {
    async getMychannels () {
      const data = await getMychannels()
      this.channels = data.channels // 更新频道数据
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
