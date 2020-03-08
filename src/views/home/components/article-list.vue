<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad" finished-text="我也是有底线的!.....">
         <van-cell v-for="article in articles" :key="article" :title="article"></van-cell>
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
      articles: [] // 定义一个数组
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
</style>
