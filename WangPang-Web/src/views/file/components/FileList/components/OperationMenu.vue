<template>
  <div class="operation-menu-wrapper" :class="'file-type-' + fileType">
    <el-button-group class="operate-group">
      <el-button size="mini" type="primary" icon="el-icon-upload2" id="uploadFileId" @click="upload()" v-if="fileType !== 6">上传</el-button>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="addFolder()" v-if="!fileType && fileType !== 6">新建文件夹</el-button>
      <el-button size="mini" type="primary" :disabled="!selectionFile.length" icon="el-icon-delete" @click="deleteSelectedFile()">删除</el-button>
      <el-button size="mini" type="primary" :disabled="!selectionFile.length" icon="el-icon-rank" @click="moveSelectedFile()" v-if="!fileType && fileType !== 6">移动</el-button>
      <!-- <el-button size="mini" icon="el-icon-document-copy">拷贝</el-button> -->
      <el-button size="mini" type="primary" :disabled="!selectionFile.length" icon="el-icon-download" @click="downloadSelectedFile()" v-if="fileType !== 6">下载</el-button>
    </el-button-group>
    <!-- 全局搜素文件 -->
    <el-input
        v-if="fileType === 0"
        class="select-file-input"
        v-model="searchFile.fileName"
        placeholder="请搜索你保存的文件"
        size="mini"
        maxlength="255"
        :clearable="true"
        @change="handleSearchInputChange"
        @clear="$emit('getTableDataByType')"
        @keyup.enter.native="handleSearchInputChange(searchFile.fileName)"
    >
      <i slot="prefix" class="el-input__icon el-icon-search" title="点击搜索" @click="handleSearchClick"></i>
    </el-input>
    <!-- 多选文件下载，页面隐藏 -->
    <a
      target="_blank"
      v-for="(item, index) in selectionFile"
      :key="index"
      :href="'api' + item.fileUrl"
      :download="item.fileName + '.' + item.extendName"
      :title="'downloadLink' + index"
      :ref="'downloadLink' + index"
    ></a>
  </div>
</template>

<script>
import {
  batchDeleteFile,
  createFile,
  batchDeleteRecoveryFile
} from '@/request/file.js'
export default {
  name: 'OperationMenu',
  props: {
    selectionFile: Array,
    operationFile: Object,
    batchOperate: Boolean
  },
  data() {
    return {// 文件搜索数据
      searchFile: {
        fileName: ''
      },
      fileTree: [],
      batchDeleteFileDialog: false,
      fileGroupLable: 0, //  文件展示模式
    }
  },
  computed: {//  当前查看的文件路径
    filePath: {
      get() {
        return this.$route.query.filePath
      },
      set() {
        return ''
      }
    },
    fileType: {//  文件类型索引
      get() {
        return Number(this.$route.query.fileType)
      },
      set() {
        return 0
      }
    },
    uploadFileData: { //  上传文件组件参数
      get() {
        let res = {
          filePath: this.filePath,
          isDir: 0
        }
        return res
      },
      set() {
        return {
          filePath: '/',
          isDir: 0
        }
      }
    },
  },
  watch: {

  },
  mounted() {
    this.$EventBus.$on('refreshList', () => {
      this.$emit('getTableDataByType')
    })
  },
  methods: {
    upload() {// 上传文件，打开文件选择框
      this.$EventBus.$emit('openUploader', this.uploadFileData)
    },
    addFolder() { //  新建文件夹按钮：打开模态框
      this.$prompt('请输入文件夹名称', '创建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.createFile(value)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    createFile(fileName) {//  新建文件夹模态框-确定按钮
      let data = {
        fileName: fileName,
        filePath: this.filePath,
        isDir: 1
      }
      createFile(data).then((res) => {
        if (res.success) {
          this.$message.success('添加成功')
          this.$emit('getTableDataByType')
        } else {
          this.$message.warning(res.errorMessage)
        }
      })
    },
    deleteSelectedFile() {  //  批量操作-删除按钮
      if(this.fileType === 6){ //回收站，彻底删除
        this.$confirm('此操作将永久删除该文件，是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.confirmDeleteFile(true)
        }).catch(()=>{
          this.$message({
            type:'info',
            message:'已取消删除'
          })
        })
      }else{//正常删除，非回收站
        this.$confirm('删除后可在回收站查看，是否继续删除？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.confirmDeleteFile(false)
        }).catch(()=>{
          this.$message({
            type:'info',
            message:'已取消删除'
          })
        })
      }
    },
    confirmDeleteFile(type) {//  删除文件模态框-确定按钮
      if(type) {  //  回收站中删除
        batchDeleteRecoveryFile({
          recoveryFileIds: JSON.stringify(this.selectionFile)
        }).then((res) => {
          if (res.success) {
            this.$message({
              message: res.data,
              type: 'success'
            })
            this.$emit('getTableDataByType')
            this.$store.dispatch('showStorage')
          } else {
            this.$message.error('失败' + res.message)
          }
        })
      } else {  //  非回收站删除
        batchDeleteFile({
          files: JSON.stringify(this.selectionFile)
        }).then((res) => {
          if (res.success) {
            this.$message({
              message: res.data,
              type: 'success'
            })
            this.$emit('getTableDataByType')
            this.$store.dispatch('showStorage')
          } else {
            this.$message.error('失败' + res.message)
          }
        })
      }
    },
    moveSelectedFile() {//  批量操作-移动按钮
      this.$emit('setMoveFileDialogData', true, true)
    },
    downloadSelectedFile() { //  批量操作：下载按钮
      for (let i = 0; i < this.selectionFile.length; i++) {
        let name = 'downloadLink' + i
        this.$refs[name][0].click()
      }
    },
    handleSearchInputChange(value) {
      console.log(value)
      if(value === '') {
        this.$emit('getTableDataByType')
      } else {
        this.$emit('getSearchFileList', value)
      }
    },
    handleSearchClick() {//搜索框图标点击事件
      this.$emit('getSearchFileList', this.searchFile.fileName)
    }
  }
}
</script>

<style lang="stylus" scoped>
.operation-menu-wrapper.file-type-6
  margin 8px 0
  justify-content flex-end
.operation-menu-wrapper
  padding 16px 0
  display flex
  justify-content space-between
  align-items: center;
  .operate-group
    flex 1
  .select-file-input {
    margin-right: 8px;
    width: 200px;
    .el-icon-search {
      cursor: pointer;
      font-size: 16px;
      &:hover {
        color: $Primary;
      }
    }
  }
  .change-image-model,
  .change-file-model
    margin-right 8px
  .batch-opera-btn
    margin-right 8px

</style>
