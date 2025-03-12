const express = require('express')

const router = express.Router

const { update_userinfo_schema } = require('../schema/user')

// 导入路由处理函数
const userinfo_handler = require('../router_handler/userinfo')
const expressJoi = require('@escook/express-joi')
const { update_userinfo_schema } = require('../schema/user')


// 获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户信息的路由
router.post('userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

module.exports = router


