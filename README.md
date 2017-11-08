# ONIC

豆包网API平台接入JavaScript SDK

## Usage

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
```
