const express = require('express')

const router = express.Router

// 导入数据验证模式
const { update_userinfo_schema } = require('../schema/user')
const { update_userinfo_schema, update_password_schema } = require('../schema/user')
const { update_avater_schema } = require('../schema/user')


// 导入路由处理函数
const userinfo_handler = require('../router_handler/userinfo')
const expressJoi = require('@escook/express-joi')

// 获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户信息的路由
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 更新用户密码的路由
router.post('/updatePassword', expressJoi(update_password_schema), userinfo_handler.updatePassword)

// 更新用户头像的路由
router.post('/update/avater', expressJoi(update_avater_schema), userinfo_handler.updateAvater)

module.exports = router


