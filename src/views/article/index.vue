<template>
   <div class='container'>
    <van-nav-bar fixed :title="article.title" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill"
         :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{ article.aut_name }}</p>
          <!-- relTime过滤器 将时间转化成相对时间 -->
          <p class="time">{{ article.pubdate | relTime }}</p>
        </div>
        <!-- is_followed 为true表示已关注该用户 false表示未关注 -->
        <!-- loading表示进度 -->
        <van-button @click="follow" :loading="followLoading" round size="small" type="info">{{ article.is_followed ? '已关注' : '+ 关注' }}</van-button>
      </div>
      <!-- v-html 可以渲染html标签 -->
      <div class="content" v-html="article.content">
      </div>
      <div class="zan">
       <!-- :class="{css名称: 布尔值}" -->
        <van-button round size="small" :class="{active: article.attitude === 1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active: article.attitude === 0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 放置我们的评论组件 -->
      <comment></comment>
    </div>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/article'
import { followUser, unFollowUser } from '@/api/user'
import Comment from './components/comment'
export default {
  name: 'articles',
  components: {
    Comment
  },
  data () {
    return {
      article: {}, // 接收文章数据
      followLoading: false // 默认是关闭的
    }
  },

  methods: {
    // 获取文章详情
    async getArticleInfo () {
      const { articleId } = this.$route.query // 查询地址栏id
      this.article = await getArticleInfo(articleId)
    },

    // 取消与关注
    async follow () {
      try {
        this.followLoading = true // 打开加载状态
        await this.$sleep() // 强制的延迟几百毫秒
        if (this.article.is_followed) {
          // 取消关注
          await unFollowUser(this.article.aut_id)
        } else {
          // 关注接口
          await followUser({ target: this.article.aut_id })
        }
        this.article.is_followed = !this.article.is_followed // 取反操作 关注与取消
        this.$gnotify({ type: 'success', message: '操作成功' })
        this.followLoading = false // 关闭状态
      } catch (error) {
        this.$gnotify({ type: 'success', message: '操作失败' })
      }
    }
  },

  created () {
    this.getArticleInfo()
  }

}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
