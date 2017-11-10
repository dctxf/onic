/*
 * @Author: dctxf
 * @Date:   2017-11-08 10:43:01
 * @Last Modified by:   dctxf
 * @Last Modified time: 2017-11-10 10:17:30
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
const fs = require('fs')
const rp = require('request-promise')
const crypto = require('crypto')
const sortKeys = require('sort-keys')
const Onic = function (options = {}) {
  this.gateway = options.gateway // 网关地址
  this.appSerect = options.appSerect
  this.publicKey = fs.readFileSync(options.publicKey, 'utf8').toString() //公钥
  this.privateKey = fs.readFileSync(options.privateKey, 'utf8').toString() //私钥
  this.sysInputArg = {
    appKey: options.appKey, //接入方appKey
    format: options.format || 'json', //报文格式
    signType: options.signType || 'RSA', //签名类型，目前支持"RSA""MD5"
    charset: options.charset || 'UTF-8', //字符编码，目前只支持UTF-8
    version: options.version || '1.0.0',
    encrypt: options.encrypt !== 0 ? 1 : 0 //content是否进行RSA加密，如果请求加密，那么响应也是加密的,1加密，0不加密
  }
}
Onic.prototype.post = function (serviceName, data, customerConfig = {}) {
  let content = JSON.stringify(sortKeys(data))
  let body
  // return this
  if (this.sysInputArg.encrypt !== 0) {
    // 对content加密
    content = this.publicEncrypt(content)
    // return content
  }
  body = Object.assign({}, this.sysInputArg, {
    serviceName,
    content,
    timestamp: +new Date()
  }, customerConfig)
  body.sign = this.countersign(body) //加签
  // return sortKeys(body)
  return Promise.resolve(rp({
    method: 'POST',
    uri: this.gateway,
    headers: {
      'contentType': 'application/json;charset=utf-8'
    },
    json: true,
    body: sortKeys(body)
  }))
}
Onic.prototype.countersign = function (data) {
  data = sortKeys(data)
  let toBeSign = ''
  for (let k in data) {
    toBeSign += ([k] + data[k])
  }
  // return toBeSign
  switch (this.sysInputArg.signType.toLocaleUpperCase()) {
    case 'RSA':
      return crypto.createSign('RSA-SHA1').update(toBeSign).sign(this.privateKey, 'base64')
      break
    default:
      return crypto.createHash('md5').update(toBeSign + this.appSerect).digest('hex')
  }
}
Onic.prototype.publicEncrypt = function (data, publicKey) {
  return crypto.publicEncrypt({
    key: publicKey ? publicKey : this.publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, new Buffer(data, 'base64')).toString('base64')
}
Onic.prototype.publicDecrypt = function (data, publicKey) {
  return crypto.publicDecrypt({
    key: publicKey ? publicKey : this.publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, new Buffer(data, 'base64')).toString('base64')
}
Onic.prototype.privateEncrypt = function (data, privateKey) {
  return crypto.privateEncrypt({
    key: privateKey ? privateKey : this.privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, new Buffer(data, 'base64')).toString('base64')
}
Onic.prototype.privateDecrypt = function (data, privateKey) {
  return crypto.privateDecrypt({
    key: privateKey ? privateKey : this.privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, new Buffer(data, 'base64')).toString('base64')
}
module.exports = Onic
