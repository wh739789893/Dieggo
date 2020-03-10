<template>
   <div class="comment">
    <!-- 列表  上拉加载  loading  是否开启加载状态 finished 是否已经全部加载完成 -->
    <!-- van-list 组件可以完成上拉加载工作 -->
    <!-- 首页中 我们给van-list组件绑定了 @load事件 -->
    <van-list @load="onLoad" v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{ comment.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <!--用过滤器 处理相对时间 -->
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <!-- 通过openReply方法 传递 点击的评论ID -->
            <van-tag plain @click="openReply(comment.com_id)">{{ comment.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 提交模块 -->
    <div class="reply-container van-hairline--top">
      <!-- 给v-model一个修饰符 去掉 评论内容的前后空格 -->
      <van-field v-model.trim="value" placeholder="写评论...">
        <!-- van-loading 通过 submiting 状态来控制显示 -->
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" @click="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 回复列表弹层   @closed="reply.commentId = null" 当退出之后 把评论id重置为null -->
    <van-action-sheet @closed="reply.commentId = null" :round="false" v-model="showReply"  class="reply_dialog" title="回复评论">
      <!-- 回复列表组件  加载状态 finished finshed-text=""-->
      <!-- immediate-check 控制当前 van-list组件是否主动检查滚动  关闭了主动检查 第一次不会主动的去调用load事件对应的方法了 -->
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <!-- 要循环的数据 -->
         <div class="item van-hairline--bottom van-hairline--top" v-for="reply in  reply.list" :key="reply.com_id.toString()">
          <!-- 用户头像 -->
          <van-image round width="1rem" height="1rem" fit="fill" :src="reply.aut_photo" />
          <div class="info">
            <!-- 用户昵称 -->
            <p><span class="name">{{ reply.aut_name }}</span></p>
            <!-- 评论内容 -->
            <p>{{ reply.content }}</p>
             <!--用过滤器 处理相对时间 -->
            <p><span class="time">{{ reply.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>
import { getComments, commentOrReply } from '@/api/article'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 存放评论列表的数据
      offest: null, // 表示分页依据 若为空 从第一页开始
      showReply: false, // 控制回复列表组件的显示与隐藏
      reply: {
        loading: false, // 回复列表组件状态
        finished: false, // 回复列表组件结束状态
        offest: null, // 获取评论的评论的分页依据
        list: [], // 存放当前弹出的关于某个评论的回复列表的数据
        commentId: null // 用来存放 当前点击的评论Id
      }
    }
  },
  methods: {
    // 一级评论
    async onLoad () {
      const data = await getComments({
        type: 'a', // 获取类型
        offest: this.offest, // 偏移量
        source: this.$route.query.articleId // 获取文章的id
      })
      this.comments.push(...data.results)
      this.loading = false
      this.finished = data.last_id === data.end_id
      if (!this.finished) {
      // 这就表明 last_id 和 end_id不相等 表示还有数据
        this.offest = data.last_id // 将last_Id设置成下一页的请求依据
      }
    },

    // 打开回复列表面板
    openReply (commentId) {
      this.showReply = true
      this.reply.commentId = commentId // 存储当前点击的commentId
      this.reply.list = [] // 清空元数据
      this.reply.offest = null // 偏移量置为空
      this.reply.finished = false // 设置成原始状态
      this.reply.loading = true // 打开加载状态 这时候没有自动检查
      this.getReply() // 开始调用第一页数据
    },

    // 获取评论  获取回复数据
    async getReply () {
    // 加载逻辑
      const data = await getComments({
        type: 'c',
        offest: this.reply.offest,
        source: this.reply.commentId.toString()
      })
      this.reply.list.push(...data.results) // 将评论的评论加到数据尾部
      this.reply.loading = false // 评论的评论的加载状态关闭
      this.reply.finished = data.end_id === data.last_id // 如果last_id 等于end_id表示 没有数据可以再加载了
      if (!this.reply.finished) {
        this.reply.offest = data.last_id
      }
    },

    async submit () {
      if (!this.value) return false
      this.submiting = true // 打开提交状态
      await this.$sleep() // 强制等待500毫秒
      try {
        const data = await commentOrReply({
          target: this.reply.commentId ? this.reply.commentId.toString() : this.$route.query.articleId,
          content: this.value,
          art_id: this.reply.commentId ? this.$route.query.articleId : null
        })

        // 评论成功   要刷新页面
        if (this.reply.commentId) {
          this.reply.list.unshift(data.new_obj) // 数据添加到队首
          // 找到评论
          const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId.toString())
          comment && comment.reply_count++ // 找到了 对回复数据+1
        } else {
        // 对文章评论
          this.comments.unshift(data.new_obj)
        }
        this.value = '' // 清空输入框
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '评论失败' })
      }
      // 关闭状态
      this.submiting = false // 关闭进度条
    }
  }

}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
 .van-image__img {
    height: 100px;
  }
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
// 回复列表组件的样式
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
