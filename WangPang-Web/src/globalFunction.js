//全局函数 ，挂载到Vue实例上
export default function install (Vue) {
  //  检测用户登录状态并做相应的跳转
  Vue.prototype.checkIsLogin = function (params) {
    if (this.$store.getters.isLogin == false) { // 未登录时自动跳转到登录页面，并将当前页面的路由作为query传递给登陆页面
      this.$router.push({ path: '/login', query: { Rurl: params } });
    } else {
      return true
    }
  };
  //  加载缩略图
  Vue.prototype.downloadImgMin = function (row) {
    let fileUrl = ''
    if (row.fileUrl) {
        // 本地磁盘存储
        let index = row.fileUrl.lastIndexOf('.')
        fileUrl = '/api' + row.fileUrl.substr(0, index) + '_min' + row.fileUrl.substr(index)
    }
    return fileUrl
  };
  //获取文件下载路径
  Vue.prototype.getDownloadFilePath = function (row) {
    let fileUrl = row.fileUrl
    let isOSS = row.isOSS
    if (isOSS == 1) { //阿里云OSS对象存储
      fileUrl = "https://" + sessionStorage.getItem("downloadDomain") + fileUrl;
    } else { //本地磁盘存储
      fileUrl = "api" + fileUrl;
    }
    return fileUrl
  };
  //文件查看大图
  Vue.prototype.getViewFilePath = function (row) {
    let fileUrl = row.fileUrl
    let isOSS = row.isOSS
    if (isOSS == 1) {
      fileUrl = "https://" + sessionStorage.getItem("viewDomain") + fileUrl;
    } else { //本地磁盘存储
      fileUrl = "api" + fileUrl;
    }
    return fileUrl
  };
}
