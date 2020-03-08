<template>
  <div class="scroll-wrapper">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad"></van-list>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否加载数据
      finished: false // 是否加载完成
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载数据')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
