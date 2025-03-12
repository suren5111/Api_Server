const express = require('express')
const cors = require('cors')

const app = express()
// 注册cors为全局可用的中间件
app.use(cors())
// 配置解析表单数据的中间件，这个中间件，只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded( {extended : false} ))

const joi = require('@hapi/joi')

// 全局错误中间件
app.use((err, res, req, next) => {

    // 数据验证失败导致的错误
    if(err instanceof joi.ValidationError) {
        return res.cc(err)
    }

    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    // 未知的错误
    res.cc(err)
})

// 在路由之前封装函数
app.use((req, res, next) => {
    
    res.cc = (err, status = 1) => {
        // status默认为一，表示失败的情况
        res.send({
            status,
            // 如果err是Error的一个实例，职责返回err.message，否则返回err
            message: err instanceof Error ? err.message : err
    })

    }
    
    next()
})



// 在路由之前配置解析token的中间件

const expressJWT = require('express-jwt')
const config = require('./config')



// 设置除了/api开头的接口之外，均需经过token身份认证才可以访问接口
app.use(expressJWT({secret: config.jwtSecretKey}).unless({ path: [/^\/api/]}))






// 导入并使用用户路由模块
const userRouter = require('./router/user')
// 访问路径http://127.0.0.1:3007/api/路由名
app.use('/api', userRouter)


// 导入用户信息路由模块
const userInfoRouter = require('./router/userinfo')
// 以my开头的接口需要经过身份认证
app.use('/my', userInfoRouter)

// 创建服务
app.listen(3007, () => {
    console.log('api server running at 127.0.0.1:3007')
})




// TODO ： 怎么写接口文档
//         get和post的区别