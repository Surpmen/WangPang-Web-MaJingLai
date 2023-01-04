//  文件模块汇总如下：
import { get,post } from './http'

export const getfilelist = p => get('/file/getfilelist', p); //获取文件列表用来展示接口
export const unzipfile = p => post('/file/unzipfile', p); //进行解压文件的接口
export const deleteFile = p => post('/file/deletefile', p); //删除文件接口
export const selectFileByFileType = p => get('/file/selectfilebyfiletype', p); // 通过文件类型来选择文件接口
export const getFileTree = p => get('/file/getfiletree', p); //获取文件的目录树结构接口
export const moveFile = p => post('/file/movefile', p); //移动文件接口
export const createFile = p => post('/file/createfile', p); //创建文件接口
export const batchDeleteFile = p => post('/file/batchdeletefile', p); //批量删除文件接口
export const batchMoveFile = p => post('/file/batchmovefile', p); //批量移动文件接口
export const renameFile = p => post('/file/renamefile', p); //重命名文件接口
export const getRecoveryFile = p => post('/recoveryfile/list', p); // 获取回收站文件列表接口
export const deleteRecoveryFile = p => post('/recoveryfile/deleterecoveryfile', p); // 回收站文件删除接口
export const restoreRecoveryFile = p => post('/recoveryfile/restorefile', p); // 回收站文件还原接口
export const batchDeleteRecoveryFile = p => post('/recoveryfile/batchdelete', p); // 回收站文件批量删除接口
export const mergeFile = p => post('/filetransfer/merge',p);//文件传输接口
export const searchFile = p => get('/file/search', p);//进行全局查询文件的接口
