// 路由处理函数模块

// 导入数据库操作模块
const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')

// 导入密码加密模块 bcryptjs
const bcrypt = require('bcryptjs')

// 导入生成token字符串的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件（包含token加密解密的秘钥）
const config = require('../config')


// 用户注册
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userInfo = req.body
    
    console.log(userInfo)

    // 对表单数据进行合法性校验，如果有一个为空则向客户端返回数据
    if (!userInfo.username || !userInfo.password){
        return res.send({status: 1, message: '用户名或密码不合法'})
    }

    // 查询用户名是否被占用

    const sql1 = 'select * from ev_users where username=?'

    db.query(sql, userInfo.username, (err, results) => {
        
        // 执行SQL语句失败
        if (err) {
            return res.cc(err)
        }
        // 用户名已被占用
        if (results.length > 0){
            return res.cc('用户名被占用，请更换其他用户名')
            // return res.send({status: 1, message: '用户名被占用，请更换其他用户名'})
        }
        // 参数，明文密码，加密盐
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        console.log(userInfo.password)

    })


    // 插入新用户
    const sql2 = 'insert into ev_users set?'

    db.query(sql, {username: userInfo.username, password: userInfo.password}, (err, results) => {

        if (err) return res.cc(err)
        // return res.send({status: 1, message: err.message})
        if (results.affectedRows !== 1) {
            return res.cc('影响行数不为一行，注册失败')
            // return res.send({status: 1, message: '影响行数不为一行，注册失败'})
        }

        res.cc('注册成功', 0)
        //res.send({status: 0, message: '注册成功'})
    })
}


// 用户登录
exports.login = (req, res) => {
    const userInfo = req.body

    const sql1 = 'select * from en_users where username=?'

    db.query(sql1, userInfo.username, (err, results) => {
        // 执行SQL语句失败
        if(err) return res.cc(err)
        // 执行SQL语句成功，但是返回结果不为一条
        if(results.length !== 1) return res.cc('登录失败')


        // 判断密码是否正确
        // 参数: 用户输入的密码，数据库查询结果的密码
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
        if(!compareResult) return res.cc('登录失败')
            
        // 生成加密token字符串

        // 去除密码和头像数据
        const user = { ...results[0], password: '', user_pic: ''}
        // 对用户信息进行加密，设置有效期
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
        
    })


    res.send({
        status: 0,
        message: '登陆成功',
        token: 'Bearer ' + tokenStr
    })
}