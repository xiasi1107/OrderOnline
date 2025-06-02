export const http = 'http://47.95.166.181:8080'

export function apiFailureAndErrorHandler() {
    uni.showToast({
        title: '数据请求失败',
        icon: 'error'
    })
}