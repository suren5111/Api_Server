const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')

// 密码处理模块
const bcrypt = require('bcryptjs')

exports.getUserInfo = (req, res) => {

    // 根据用户id查询用户的基础信息，为了防止密码泄露，排除password字段
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?'


    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取用户信息失败')
    
        res.send({
        status: 0,
        message: '获取用户信息成功',
        data: results[0]
        })
    })
    res.send('ok')
}




exports.updateUserInfo = (req, res) => {

    const sql = 'update ev_users set ? where id = ?'

    // 参数 [req.body, req.body.id] 分别对应上面SQL中的两个占位符
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('修改用户基本信息失败')
        return res.cc('修改用户基本信息成功')

    })

    res.send('ok')
}


// 更新密码

exports.upupdatePassword  = (req, res) => {
    
    const sql1 = 'select * from ev_users where id = ?'

    db.query(sql1, req.user.id, (req, results) => {

        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在')
        
        const compareResult = bcrypt.compareSync(req.body.oldPassword, results[0].password)
        if(!compareResult) return res.cc('旧密码错误')
        
        
        // 如果上述if都没有return，则更新密码
        const sql2 = 'update ev_users set password = ? where id = ?'
        const newPassword = bcrypt.hashSync(req.body.newPassword, 10)
        
        db.query(sql2, [newPassword, req.user.id], (req, results) => {
            if (err) return res.cc(err)
            if (results.length !== 1) return res.cc('更新密码失败')
            
            res.cc('更新密码成功')
        })

    })
    
    res.send('ok')
}


// 更新用户头像
exports.updateAvater = (req, res) => {

    const sql = 'update ev_usrs set user_pic = ? where id = ?'

    db.query(sql, [req.body.avater, req.body.id], (res, results) => {

        if (err) return res.cc(err)
        if (result.length !== 1) return res.cc('更新头像失败')
        
        res.cc('更新头像成功')
    })

}
