import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // 1. 获取请求体
  const body = await readBody(event);
  const { token, secretKey } = body || {};

  if (!token || !secretKey) {
    return {
      success: false,
      message: 'token 和 secretKey 必填',
    };
  }

  try {
    const payload = jwt.verify(token, secretKey);
    return {
      success: true,
      message: '验证通过',
      payload,
    };
  } catch (e) {
    return {
      success: false,
      message: '验证失败: ' + e.message,
    };
  }
}); 