<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- List组件 -->
      <van-list v-model="upLoading" :finished="finished" finished-text="我是有底线的!...." @load="onLoad">
        <van-cell v-for="article in articles" :key="article.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ article.title }}</h3>
            <!-- 三图模式 -->
            <div class="img_box" v-if="article.cover.type === 3">
              <van-image   lazy-load  class="w33" fit="cover" :src="article.cover.images[0]" />
              <van-image   lazy-load  class="w33" fit="cover" :src="article.cover.images[1]" />
              <van-image   lazy-load  class="w33" fit="cover" :src="article.cover.images[2]" />
            </div>
            <!-- 单图模式 -->
            <div class="img_box" v-if="article.cover.type === 1">
              <van-image   lazy-load  class="w100" fit="cover" :src="article.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ article.aut_name }}</span>
              <span>{{ article.comm_count }}评论</span>
              <span>{{ article.pubdate | relTime}}</span>
              <span class="close" v-if="user.token" @click.stop="$emit('showMoreAction',article.art_id.toString())">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'
export default {
  name: 'article-list',
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      upLoading: false, // 是否加载数据
      finished: false, // 是否加载完成
      refreshSuccessText: '',
      downLoading: false, // 是否开启下拉刷新
      articles: [], // 定义一个数组
      timestamp: null // 存放时间戳
    }
  },
  props: {
    channel_id: {
      required: true,
      type: Number,
      default: null
    }
  },

  created () {
    // 开启监听  监听删除事件
    eventBus.$on('delArticle', (articleId, channelId) => {
      if (this.channel_id === channelId) {
        const index = this.articles.findIndex(item => item.art_id.toString() === articleId) // 查找对应的文章
        if (index > -1) {
          this.articles.splice(index, 1)
        }
      }
    })
  },

  methods: {

    // 上拉加载
    async onLoad () {
      await this.$sleep() // 等待
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      // 追加数据到队尾
      this.articles.push(...data.results)
      // 关闭加载状态
      this.upLoading = false
      if (data.pre_timestamp) {
        // 如果有
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true // 没有数据了
      }
    },

    // 下拉刷新
    async onRefresh () {
      await this.$sleep() // 等待
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      this.downLoading = false // 关掉下拉状态
      if (data.results.length) {
        this.articles = data.results
        this.finished = false // 还要继续下拉
        this.timestamp = data.pre_timestamp // 获取历史时间戳
        this.refreshSuccessText = `更新了${data.results.length}条数据`
      } else {
        this.refreshSuccessText = '已是最新数据'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
