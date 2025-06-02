"use strict";
require("../common/vendor.js");
const loginByWeChat = (code) => {
  return new Promise((resolve) => {
    resolve({
      code: 200,
      data: {
        nickName: "测试用户",
        token: "mock-token-123"
      },
      msg: "登录成功"
    });
  });
};
const loginByPhone = ({ phone, password }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (phone === "13800000000" && password === "123456") {
        resolve({
          code: 200,
          data: {
            nickName: "测试用户",
            avatar: "https://mock.image/avatar2.png",
            token: "phone-mock-token-456",
            phone
          },
          msg: "登录成功"
        });
      } else {
        resolve({
          code: 401,
          msg: phone.length !== 11 ? "手机号格式错误" : "密码错误"
        });
      }
    }, 600);
  });
};
exports.loginByPhone = loginByPhone;
exports.loginByWeChat = loginByWeChat;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/login.js.map
