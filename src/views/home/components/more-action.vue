<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell>侵权</van-cell>
      <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
export default {
  data () {
    return {
      isReport: false
    }
  },

  created () {
    eventBus.$on('delArticle', (articleId, channelId) => {
      if (this.channelId === articleId) {
        const index = this.articles.findIndex(item => item.art_id.toString() === articleId)
        if (index > -1) { // 大于-1表示找到了
          this.articles.splice(index, 1) // 删除不喜欢文章
        }
      }
    })
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
