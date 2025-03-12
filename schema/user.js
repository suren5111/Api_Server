const joi = require('@hapi/joi')


// string() 必须是字符串
// alphanum() 必须是数字和字母
// min() max() 最小长度最大长度
// required() 表示该参数为必填项
// pattern() 正则表达式


// 用户名验证规则
const username = joi.string()
                    .alphanum()
                    .min(1)
                    .max(10)
                    .required()
// 密码验证规则                    
const password = joi.string()
                    .pattern(/^[\S]{6, 12}$/)
                    .required()

const id = joi.number()
              .integer()
              .min(1)
              .required()

const nickname = joi.string()
                    .required()

const email = joi.string()
                 .email()
                 .required()

const avater = joi.string()
                  .dataUrl()
                  .required()


// 定义验证登录的对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    }
}                

// 定义验证更新用户信息的对象
exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email,
    }
}

exports.update_password_schema = {
    body: {
        oldPassword: password,
        newPassword: joi.not(joi.ref('oldPassword'))  // 新密码不能等于旧密码
                                .concat(password)   // 合并密码的验证规则
    }
}


exports.update_avater_schema = {
    body: {
        avaterUrl
    }
}
