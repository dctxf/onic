/*
 * @Author: dctxf
 * @Date:   2017-11-08 10:43:01
 * @Last Modified by:   dctxf
 * @Last Modified time: 2017-11-08 11:34:29
 */
/**
 * [exports description]
 * @param  {Object} options [description]
 * @return {[Object]}         [description]
 */
// content String  Y   应用级返回参数json序列串，(详见各个接口文档)
// charset String  Y "UTF-8" 字符编码，目前只支持UTF-8
// format  String  Y "json"  响应格式,目前支持格式为json
// timestamp Long  Y   时间戳
// code  Integer Y   返回编码，成功200，其他为失败
// msg String  Y   返回信息，一般在失败时为错误原因
const rp = require('request-promise')
const Onic = function (options = {}) {
  this.options = options
  this.gateway = options.gateway
  this.appKey = options.appKey //接入方appKey
  // this.serviceName = options.serviceName //服务名
  this.timestamp = options.timestamp //时间戳
  this.format = options.format || 'json' //报文格式
  this.signType = options.signType || 'RSA' //签名类型，目前支持"RSA""MD5"
  this.charset = options.charset || 'UTF-8' //字符编码，目前只支持UTF-8
  this.sign = options.sign //API请求的签名
  this.content = options.content //应用级请求参数json序列串，(详见各个接口文档)
  this.version = options.version || '1.0.0'
  this.encrypt = options.encrypt || 1 //content是否进行RSA加密，如果请求加密，那么响应也是加密的,1加密，0不加密
}
Onic.prototype.post = function (config) {
  const data = extend(this.options, config)
  const options = {
    method: 'POST',
    uri: this.gateway,
    headers: {
      'contentType': 'application/json;charset=utf-8'
    },
    json: true,
    body: data
  }
  return rp(options)
}
module.exports = Onic
