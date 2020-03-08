<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad" finished-text="我也是有底线的!.....">
         <van-cell v-for="article in articles" :key="article" :title="article">
             <!-- 开启布局 -->
                <div class="article_item">
                  <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
                  <!-- 三图模式 -->
                  <div class="img_box">
                    <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
                    <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
                    <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
                 </div>
                 <!-- 单图模式 -->
                   <div class="img_box">
                      <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
                  </div>
                <div class="info_box">
                  <span>你像一阵风</span>
                  <span>8评论</span>
                  <span>10分钟前</span>
                  <span class="close"><van-icon name="cross"></van-icon></span>
                </div>
              </div>
         </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否加载数据
      finished: false, // 是否加载完成
      refreshSuccessText: '更新成功',
      downLoading: false, // 是否开启下拉刷新
      articles: [], // 定义一个数组
      timestamp: null // 存放时间戳
    }
  },
  props: {
    channnel_id: {
      type: Number, // 指定类型
      default: null, // 默认值
      required: true // 要求必须传该props  否则报错
    }
  },
  methods: {
    onLoad () {
      // 加载方法
      setTimeout(() => {
        if (this.articles.length === 50) {
          // 不在追加数据
          this.finished = true
        } else {
          const arr = Array.from(Array(10), (value, index) => index + this.articles.length + 1)
          this.articles.push(...arr) // 追加数据
          this.upLoading = false // 关闭状态
        }
      }, 1000)
    },

    onRefresh () {
      // 下拉刷新
      setTimeout(() => {
        const arr = Array.from(Array(10), (value, index) => ('追加' + (index + 1)))
        this.articles.unshift(...arr)
        this.downLoading = false // 关闭下拉状态
        this.refreshSuccessText = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
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
