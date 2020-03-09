 <template>
   <div class='container'>
     <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <!-- art_id有可能是大数字 超过一定长度会转成 BigNumber  要toString一下 -->
          <van-cell :to="`/article?articleId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <div class="img_box" v-if="item.cover.type === 3">
                <!-- 支持图片懒加载   当图片显示在当前可视区域的时候才去请求该图片的地址 -->
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]"  />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]"  />
              </div>
              <div class="img_box" v-if="item.cover.type === 1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]"  />
              </div>
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{item.comm_count}}评论</span>
                <span>{{ item.pubdate | relTime }}</span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
  </div>
</template>

<script>
import { searchArticle } from '@/api/article'
export default {
  name: 'searchResult',
  data () {
    return {
      upLoading: false,
      finished: false,
      articles: [],
      page: {
        page: 1,
        per_page: 10
      }
    }
  },

  methods: {
    async onLoad () {
      const { q } = this.$route.query // 地址栏解析查询参数
      const data = await searchArticle({ ...this.page, q })

      // 上拉加载 数据要追加到队尾
      this.articles.push(...data.results)
      // 关闭加载状态
      this.upLoading = false

      // 如何判断下一页是否还有数据呢？ 通过返回的数组长度去判断  要是长度不为0表示还有数据 反之就是没有
      if (data.results.length) {
        this.page.page++ // 将页码加1 表示还有下一页数据
      } else {
        this.finished = true // 加载结束
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
