<template>
    <div class="container">
      <!-- 导航 -->
    <van-nav-bar    @click-right="saveUserInfo"  left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称"  @click="showName=true"      :value="user.name" />
      <van-cell is-link title="性别"  @click="showGemder=true"    :value='user.gender===0?"男":"女"'/>
      <van-cell is-link title="生日"  @click="showDate"       :value="user.birthday" />
    </van-cell-group>

    <!-- 弹层组件开始 -->
    <!-- 头像弹层 -->
    <van-popup   v-model="showPhoto" style="width:80%">
        <!-- 内容 -->
        <van-cell is-link  title="本地相册选择图片"  @click="openChangeFile"></van-cell>
        <van-cell is-link  title="拍照"></van-cell>
    </van-popup>

    <!-- 昵称弹层  关闭点击弹层 关闭功能-->
    <van-popup   :close-on-click-overlay="false"  round   v-model="showName" style="width:80%">
        <!-- 编辑用户昵称  双向绑定用户昵称 -->
         <van-field :error-message="nameMsg" v-model.trim="user.name" type='textarea'  rows="4"></van-field>
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
    <!-- 文件选择控件 -->
    <input ref="myFile" @change="upload"   type="file"  name=""     style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, saveUserInfo, updateImg } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'profile',
  data () {
    return {

      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 当前时间
      showBirthDay: false, // 是否显示日期弹层
      showPhoto: false, // 是否显示选择头像弹层
      showName: false, // 是否显示编辑昵称的弹层
      showGender: false, // 是否显示性别选择的弹层

      // 定义数据
      user: {
        name: '', // 用户昵称
        gender: 1, // 0男  1女
        birthday: '' // 默认生日
      },
      actions: [{ name: '男' }, { name: '女' }], // 性别数据
      nameMsg: '' // 控制显示的错误信息

    }
  },

  methods: {
    ...mapMutations(['updatePhoto']), // 编辑资料页面引入 公共方法
    // 获取用户资料方法
    async getUserProfile () {
      const data = await getUserProfile()
      this.updatePhoto({ photo: data.photo }) // 头像地址 更新设置给公共的state
      this.user = data
    },

    // 保存方法
    async saveUserInfo () {
      try {
        await saveUserInfo({ ...this.user, photo: null })
        this.$gnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$gnotify({ type: 'success', message: '保存失败' })
      }
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
    },

    // 点击图片触发
    openChangeFile () {
    //  先获取dom元素
      this.$refs.myFile.click() // 触发文件上传组件的点击方法
    },

    // 选择图片触发
    async upload () {
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0]) // 往formData 里添加参数 后面是dom参数
      const result = await updateImg(data) // 调用接口
      this.user.photo = result.photo // 上传成功头像 设置给当前头像
      this.showPhoto = false // 关闭弹层
      this.updatePhoto({ // 关键的一步 更新头像后 重新设置给公共状态
        photo: result.photo
      })
    }

  },

  created () {
    this.getUserProfile()
  }
}
</script>

<style>

</style>
