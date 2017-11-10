# ONIC

豆包网API平台接入JavaScript SDK

## 基础配置

使用之前请先进行全局配置

```js
<!--全局设置-->
const config = {
	appKey: '11111',
	appSerect: '221sd1daa',
	gateway: 'http://xxx.com/aaa',
	publicKey: '/keys/publick.pem',
	privateKey: '/keys/private.pem',
	format: 'json',
	signType: 'RSA',
	charset: 'UTF-8',
	version: '1.0.0',
	encrypt: 1
}
const onic = new Onic(config)
const data = {
	      productCode: '111',
	      aroductId: 123
      }
const res = await onic.post(serviceName, data)
console.log(res)
```

## 发送请求

### `onic.post(serviceName, data, customerConfig)`

- `serviceName` 必填
	
	`string`类型，你需要请求的服务名称
	

- `data` 必填

	`object`类型，你需要请求的数据
	
- `customerConfig` 选填

	`object`类型，可以自定义配置
	
	- `format`: 报文格式 默认`json`
	- `signType`: 签名类型，目前支持`RSA`,`MD5`
	- `charset`: 字符编码，目前只支持`UTF-8`
	- `version`: api版本号，默认`1.0.0`
	- `encrypt`: content是否进行RSA加密，如果请求加密，那么响应也是加密的,1加密，0不加密 **目前不支持加密，请在全局设置成0**

## 公钥加密

暂不支持

## 开发中

- 公钥加密
- 公钥解密
- 私钥加密
- 私钥解密