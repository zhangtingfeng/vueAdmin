import axios from '../axios'

/*
 * 菜单管理模块
 */

 // 保存
export const save = (data) => {
    return axios({
        url: '/SysMenu/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/SysMenu/delete',
        method: 'post',
        data
    })
}
// 查找导航菜单树
export const findNavTree = (params) => {
    return axios({
        url: '/SysMenu/findNavTree',
        method: 'get',
        params
    })
}
// 查找导航菜单树
export const findMenuTree = () => {
    return axios({
        url: '/SysMenu/findMenuTree',
        method: 'get'
    })
}
