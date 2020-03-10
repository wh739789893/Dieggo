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
        <van-filed v-model.trim="user.name" type="textarea" rows="4"></van-filed>
        <!-- 关闭按钮组件 -->
        <van-button type="info" size="large" block @click="btnName">确定</van-button>
    </van-popup>

    <!-- 性别弹层 -->
    <van-action-sheet :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>

    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
       <!-- type表示 当前的日期类型 年月日 -->
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
        >
        </van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
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
  }
}
</script>

<style>

</style>
