import Vue from "vue";
import Vuex from "vuex";

import user from './module/user'
import fileList from './module/fileList'
import sideMenu from './module/sideMenu'
import imgReview from './module/imgReview'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  getters: {
    isLogin: (state) => state.user.isLogin,
    username: (state) => state.user.username,
    userId: (state) => state.user.userId,
    userImgUrl: (state) => state.user.userImgUrl,
    userInfoObj: (state) => state.user.userInfoObj,
    selectedColumnList: (state) =>
      state.fileList.selectedColumnList === null
        ? ["extendName", "fileSize", "uploadTime", "deleteTime"]
        : state.fileList.selectedColumnList.split(","), //  列显隐
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    fileList,
    sideMenu,
    imgReview
  }
})
