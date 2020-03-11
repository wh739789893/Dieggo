<template>
    <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="迅达聊天"></van-nav-bar>
    <div class="chat-list" ref="myList">
      <div :class="{left:item.name === 'xd',right:item.name!='xd'}" class="chat-item" v-for="(item,index) in list" :key="index">
        <!-- 迅达机器人图片 -->
        <!-- 根据name值决定是否显示 左边或者右边图片 -->
        <van-image  v-if="item.name ==='xd'"      fit="cover" round :src="XZImg" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image  v-if="item.name!=='xd'" fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import XZImg from '@/assets/images/xz.png'
import { mapState } from 'vuex'
import io from 'socket.io-client' // 引入socket.io的客户端代码
export default {
  name: 'chat',
  data () {
    return {
      value: '',
      loading: false,
      XZImg,
      list: [] // 聊天记录
    }
  },
  computed: {
    ...mapState(['photo', 'user'])
  },
  created () {
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: {
        token: this.user.token // vuex中获取用户token
      }
    })
    this.socket.on('connect', () => {
      console.log('服务器建立连接成功!')
      this.list.push({ msg: '醉暖人心,你好啊,第一次和你聊天呢!', name: 'xd' })
    })
    this.socket.on('message', (data) => {
      this.list.push({ ...data, name: 'xd' }) // name: 'xd' 相当于记录一下 谁发的消息
    })
  },
  methods: {
    async send () {
      if (!this.value) return false // 若为空字符串 直接返回
      this.loading = true // 打开加载
      await this.$sleep()

      // 若消息不为空则继续发送
      const obj = {
        msg: this.value,
        timestamp: Date.now() // 传入当前时间戳
      }

      // 发送消息
      this.socket.emit('message', obj)
      this.list.push(obj)
      this.value = '' // 清空内容
      this.loading = false // 回复状态
      this.scrollBottom() // 消息发送完毕  滚动条设置距离

      // 监听回复消息
      this.socket.on('message', data => {
        this.list.push({ ...data, name: 'xd' })
        this.scrollBottom()
      })
    },

    // 滚动方法
    scrollBottom () {
      // 视图更新后之后执行
      this.$nextTick(() => {
        // scrollTop  滚动条位置距离顶部距离属性来控制
        // scrollHeight 滚动条距离
        // $nextTick 会在上一次数据更新 并且视图完成渲染之后执行
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight // 滚动到底部
      })
    }
  },

  // 页面销毁之前的钩子函数
  beforeDestroy () {
    this.socket.close() // 销毁链接
  }
}
</script>

<style lang =less scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
