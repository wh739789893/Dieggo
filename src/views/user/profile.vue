<template>
    <div class="container">
      <!-- 导航 -->
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell is-link title="名称" value="用户名称" />
      <van-cell is-link title="性别" value='男'/>
      <van-cell is-link title="生日" value="2019-08-08" />
    </van-cell-group>

    <!-- 弹层组件开始 -->
    <!-- 头像弹层 -->
    <van-popup   v-model="showPhoto" style="width:80%">
        <!-- 内容 -->
        <van-cell is-link  title="本地相册选择图片"></van-cell>
        <van-cell is-link  title="拍照"></van-cell>
    </van-popup>

    <!-- 昵称弹层  关闭点击弹层 关闭功能-->
    <van-popup   :close-on-click-overlay="false"     v-model="showName" style="width:80%">
        <!-- 编辑用户昵称  双向绑定用户昵称 -->
        <van-filed    :error-message="nameMsg"   v-model.trim="user.name" type="textarea" rows="4"></van-filed>
        <!-- 关闭按钮组件 -->
        <van-button type="info" size="large" block @click="btnName">确定</van-button>
    </van-popup>

    <!-- 性别弹层 -->
    <van-action-sheet  @select="selectItem"     :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>

    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
       <!-- type表示 当前的日期类型 年月日 -->
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="showBirthDay=false"
          @confirm="confirmDate"
        >
        </van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile } from '@/api/user'
// import { mapMutations } from 'vuex'
export default {
  name: 'profile',
  data () {
    return {

      actions: [{ name: '男' }, { name: '女' }], // 性别数据
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 当前时间
      showBirthDay: false, // 是否显示日期弹层
      showPhoto: false, // 是否显示选择头像弹层
      showName: false, // 是否显示编辑昵称的弹层
      showGender: false // 是否显示性别选择的弹层
    }
  },

  methods: {

    // 获取用户资料方法
    async getUserProfile () {
      const data = await getUserProfile()
      this.user = data
    },

    // 昵称长度判断
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '您的用户昵称不符合1-7的长度要求'
        return false
      }
      this.nameMsg = '' // 提示消息清空
      this.showName = false // 关闭弹层
    },

    //  捕获点击上拉菜单选项事件
    selectItem (item) {
      this.user.gender = item.name === '男' ? 0 : 1 // 根据判断得到当前性别
      this.showGender = false // 关闭当前弹层
    },

    // 设置生日弹层 触发方法
    confirmDate (date) {
      this.user.birthday = dayjs(date).format('YYYY-MM-DD') // 转化后结果赋值给user生日
      this.showBirthDay = false
    },

    // 点击生日 触发
    showDate () {
      this.currentDate = new Date(this.user.birthday) // 当前用户生日 赋值当前绑定时间数据
      this.showBirthDay = true // 显示生日弹层
    }
  },

  created () {
    this.getUserProfile()
  }
}
</script>

<style>

</style>
