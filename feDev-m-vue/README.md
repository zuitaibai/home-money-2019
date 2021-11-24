# home-money
last update this readme: 2021-11-24

## 上线时：

### 常用的依赖包使用cdn的方式（但经操作，成效不是很大，因此决定这种方式算了）
1. 将feDev-m-vue\public\index.html中的js引入解注
2. 将feDev-m-vue\vue.config.js中的“// 分离打包js,用cdn加速...”部分解注
3. 将feDev-m-vue\src\router.js中的“Router”部分注掉，VueRouter解注

### 生产build时已启用Gzip(vue.config.js内)，生成的.gz文件比原js小了很多。此种方式相当ok。不过我目前线上的服务器有没有开启支持Gzip，已经记不清了。有时间弄弄。

### 关于组件库vux的bug，import from 'vux'，build时据说会把vux全量拉入。这个问题详看main.js内标注

## 目前不完全记录问题：

1. 首页用vux的vchart的饼图，有比例相对超小的类目时，legend显示的颜色和饼块颜色不匹配，而且legend内的类目有丢失。
2. 登录后跳首页还是很慢

