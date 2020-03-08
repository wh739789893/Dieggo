<template>
  <div class="container">
     <van-tabs v-model="activeIndex" swipeable>
       <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
          <!-- 引入组件 -->
         <article-list  @showMoreAction="openMoreAction"   :channel_id="channel.id"></article-list>
       </van-tab>
     </van-tabs>
     <!-- 显示编辑图标 -->
     <span class="bar_btn">
        <van-icon name="wap-nav"></van-icon>
     </span>
     <!-- 放置弹层组件 -->
     <van-popup :style="{width:'80%'}" v-model="showMoreAction">
       <!-- 包裹反馈组件 -->
        <more-action @dislike="dislikeOrReport($event,'dislike')" @report="dislikeOrReport($event,'report')"></more-action>
     </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { disLikeArticle, reportArticle } from '@/api/article'
import { getMyChannels } from '@/api/channels'
import eventBus from '@/utils/eventBus'
export default {
  name: 'home',
  components: {
    ArticleList, MoreAction
  },
  created () {
    this.getMyChannels()
  },
  data () {
    return {
      activeIndex: 0, // 默认启动第0个标签
      channels: [], // 频道数据
      articleId: null, // 接收文章Id
      showMoreAction: false
    }
  },
  methods: {
    // 获取频道
    async getMyChannels () {
      const data = await getMyChannels()
      this.channels = data.channels // 更新原来的channels
    },

    // 弹出层
    openMoreAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },

    // 不喜欢文章
    // operateType 操作类型 dislike /report
    // params是 举报类型的参数
    async dislikeOrReport (params, operateType) {
      try {
        if (this.articleId) {
          operateType === 'dislike' ? await disLikeArticle({ target: this.articleId }) : await reportArticle({ target: this.articleId, type: params })
          this.$gnotify({ type: 'success', message: '操作成功' })
          eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
          this.showMoreAction = false
        }
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '操作失败' })
      }
    }
  }
}
</script>

<style lang='less' scoped>
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
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
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
// 编辑频道面板的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>
