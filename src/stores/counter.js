import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', {
  // 类似组件的data，用于存储全局状态
  state: () => {
    const passport = false  //记录用户是否处于登录状态
    const phonenumber = ''  //成功登录就记录一下手机号
    const imgPth = "src/assets/images/touxiang.jpg"  //头像图片路径

    return { passport,phonenumber,imgPth,}
  },

  // 类似组件的 computed，用来封装计算属性，有缓存的功能
  getters:{

  },

  // 类似组件的 methods，封装业务逻辑，修改state
  actions:{

  }
})
