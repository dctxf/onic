/*
 * @Author: dctxf
 * @Date:   2017-11-08 10:43:01
 * @Last Modified by:   dctxf
 * @Last Modified time: 2017-11-08 17:37:55
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
const md5 = crypto.createHash('md5')
const Onic = function (options = {}) {
  this.gateway = options.gateway
  this.publicKey = fs.readFileSync(options.publicKey).toString()
  this.privateKey = fs.readFileSync(options.privateKey).toString()

  this.sysInputArg = {
    appKey: options.appKey, //接入方appKey
    format: options.format || 'json', //报文格式
    signType: options.signType || 'RSA', //签名类型，目前支持"RSA""MD5"
    charset: options.charset || 'UTF-8', //字符编码，目前只支持UTF-8
    version: options.version || '1.0.0',
    encrypt: options.encrypt || 1 //content是否进行RSA加密，如果请求加密，那么响应也是加密的,1加密，0不加密
  }
}
Onic.prototype.post = function (serviceName, data) {
  let body = Object.assign({}, this.sysInputArg, {
    serviceName,
    content: this.sysInputArg.encrypt === 0 ? this.signer(this.sysInputArg.signType, this.sorter(data)) : this.sorter(data),
    timestamp: +new Date()
  })
  body.sign = this.signer(this.sysInputArg.signType, this.sorter(body))
  return body
  const options = {
    method: 'POST',
    uri: this.gateway,
    headers: {
      'contentType': 'application/json;charset=utf-8'
    },
    json: true,
    body: body
  }
  return rp(options)
}
Onic.prototype.signer = function (algorithm, data) {
  if (algorithm.toLocaleUpperCase() === 'RSA') {
    algorithm = 'RSA-SHA1'
    const sign = crypto.createSign(algorithm)
    sign.update(data);
    sig = sign.sign(this.privateKey, 'hex');
    return sig;
  }
  return md5.update(data).digest('hex');
}
Onic.prototype.sorter = function (data) {
  let arr = []
  for (let k in data) {
    arr.push({
      name: k,
      value: data[k],
    })
  }

  data = arr.sort((a, b) => {
    return a.name.charCodeAt() > b.name.charCodeAt()
  })
  let obj = {}
  for (let i = 0; i < data.length; i++) {
    obj[data[i].name] = data[i].value
  }
  return JSON.stringify(obj)
}
module.exports = Onic
