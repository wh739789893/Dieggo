<template>
  <div class="container">
    <!-- 监听tabs切换事件 -->
     <van-tabs v-model="activeIndex" swipeable @change="changeTab">
       <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
          <!-- 引入组件 -->
         <article-list  @showMoreAction="openMoreAction"   :channel_id="channel.id"></article-list>
       </van-tab>
     </van-tabs>
     <!-- 显示编辑图标 -->
     <span class="bar_btn" @click="showChannelEdit=true">
        <van-icon name="wap-nav"></van-icon>
     </span>
     <!-- 放置弹层组件 -->
     <van-popup :style="{width:'80%'}" v-model="showMoreAction">
       <!-- 包裹反馈组件 -->
        <more-action @dislike="dislikeOrReport($event,'dislike')" @report="dislikeOrReport($event,'report')"></more-action>
     </van-popup>
     <!-- 编辑频道 -->
     <van-action-sheet :round="false" title="编辑频道" v-model="showChannelEdit">
        <channel-edit
        :channels="channels"
        :activeIndex="activeIndex"
        @selectChannel="selectChannel"
        @delChannel="delChannel"
        @addChannel="addChannel"
        ></channel-edit>
        <!-- 监听子组件触发的事件    @delChannel="delChannel"     -->
     </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { disLikeArticle, reportArticle } from '@/api/article'
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
import ChannelEdit from './components/channel-edit'
import eventBus from '@/utils/eventBus'
export default {
  name: 'home',
  components: {
    ArticleList, MoreAction, ChannelEdit
  },
  created () {
    this.getMyChannels()
  },
  data () {
    return {
      activeIndex: 0, // 默认启动第0个标签
      channels: [], // 频道数据
      articleId: null, // 接收文章Id
      showMoreAction: false,
      showChannelEdit: false // 频道
    }
  },
  methods: {
    // 获取频道
    async getMyChannels () {
      const data = await getMyChannels()
      this.channels = data.channels // 更新原来的channels
    },

    // 切换Tab页触发
    changeTab () {
      eventBus.$emit('changeTab', this.channels[this.activeIndex].id)
    },

    // 弹出层
    openMoreAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },

    // 切换到对应频道  关闭弹层
    selectChannel (id) {
      const index = this.channels.findIndex(item => item.id === id)
      this.activeIndex = index // tabs激活标签切换到对应标签
      this.showChannelEdit = false
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
    },

    // 删除频道

    /*
        删除频道思想
     1. 有一个实际情况需要考虑就是 要删除的频道是否是当前激活频道
     2.所以要拿到索引去判断  当然第一步是删除 是根据id去删除的 这个是 子组件中传出来的
     3.比较索引 要删除的索引  let index = this.channels.findIndex(item => item.id === id)  当前索引  this.activeIndex
     4.若这个删除频道的索引在当前激活频道之前  或者就是当前激活频道  那么要把激活索引向前挪一位   this.activeIndex = this.activeIndex - 1
     5.判断了要删除索引和当前激活频道索引关系后 就简单了 如果存在那么直接删除当前频道就行  this.channels.splice(index, 1)
    */
    async delChannel (id) {
      try {
        await delChannel(id)
        const index = this.channels.findIndex(item => item.id === id) // 找到删除的索引
        if (index < this.activeIndex) {
          this.activeIndex = this.activeIndex - 1
        }
        if (index > -1) {
          this.channels.splice(index, 1) // 移除当前频道
        }
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '删除频道失败' })
      }
    },

    // 添加频道
    async addChannel (channel) {
      await addChannel(channel)
      this.channels.push(channel)
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
