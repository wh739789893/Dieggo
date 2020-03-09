<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search   @click="onSearch"    v-model.trim="q"    placeholder="请输入搜索关键词" shape="round" />
    <!--
      什么时候出现联想搜索, ? 什么时候出现 历史记录 ?

      应该是有输入内容时  =>联想

      没内容时  => 历史记录

     -->
    <van-cell-group class="suggest-box"  v-if="q">
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <van-cell   @click="toSearchResult(text)"   v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <van-icon   @click="delHistory(index)"     class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggestion } from '@/api/article'
const key = 'lxxd-110-history'
export default {
  name: 'search',
  data () {
    return {
      q: '',
      historyList: [], // 历史记录数据
      suggestList: [] // 联想建议
    }
  },

  methods: {
    created () {
      this.historyList = JSON.parse(localStorage.getItem(key) || '[]') // 读取本地化内容
    },

    // 删除对应历史记录
    delHistory (index) {
      this.historyList.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
    },

    // 跳到搜索结果页面
    toResult (text) {
      this.$router.push({ path: '/search/result', query: { q: text } })
    },

    // 清空操作
    clear () {
      this.historyList = [] // 清空所有历史
      localStorage.setItem(key, '[]') // 写入缓存
    },

    // 搜索按钮,回车或者虚拟键盘搜索  => 搜索事件
    onSearch () {
      if (!this.q) return
      const obj = new Set(this.historyList)
      obj.add(this.q)
      this.historyList = Array.from(obj) // set转为数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存

      // 携带参数去搜索结果页面
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  },

  watch: {
    // 函数节流
    q () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          this.timer = null
          if (!this.q) {
            this.suggestList = [] // 搜索关键字成为空  连想数组清空
            return false
          }
          const data = await suggestion({ q: this.q })
          this.suggestList = data.options
        }, 500)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
