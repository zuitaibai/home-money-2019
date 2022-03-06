# HomeMoney2019

### (three folders:)

[feDev-pc-ng] FE: angular7+npm

[feDev-m-vue] FE-mobile: vue2.6+yarn

[server] SV: koa2+yarn

	|----apps/      pc端fe文件s + readme.md

	|----apps/mb/   mobile端fe文件s + readme.md


### [feDev-pc-ng]: npm install

DEV:

    feDev-pc-ng/src/index.html  base[href]="/"

    feDev-pc-ng/ bash:ng serve  => 开发：localhost:4200  (sv端跑dev)

PROD:

    feDev-pc-ng/src/index.html  base[href]="/apps/"

    build: feDev-pc-ng/    bash: ng build --prod(不带gzip压缩) 或者 npm run buildGzip(带gzip压缩)

	copy files into server/apps/ & sv端跑prod: localhost:8888/apps

PROD-HOT:

    feDev-pc-ng/src/index.html base[href]="/apps/"

    build: feDev-pc-ng/    bash: ng build --prod

	copy files into server/apps/ & sv端跑prod-hot: localhost:8888/apps

### [feDev-m-vue]: yarn install (install后请搜索feDev-m-vue内的‘码源修改’按说明修改package等)

DEV:

    feDev-m-vue/src/config.js  preApi = '/api/'

    feDev-m-vue/ bash:yarn run serve  => 开发：localhost:8080/apps (sv端跑prod)

PROD:

    feDev-m-vue/src/config.js  preApi = '/apps/api/'

    build: feDev-m-vue/   bash: yarn run build

	copy files into server/apps/mb & sv端跑prod: localhost:8888/apps/mb

PROD-HOT:

    feDev-m-vue/src/config.js  preApi = '/apps/api/'

    build: feDev-m-vue/   bash: yarn run build

	copy files into server/apps/mb & sv端跑prod-hot: localhost:8888/apps/mb

### {server端}: yarn install

//上线前改端口为80 (server\boot\config.js) //由于线上现在用nginx了，故不用改端口了

net start mysql &

run DEV:
     server/ yarn run dev  (Or: win+r/mmm -> d+enter )

run PROD:
    server/ yarn start  (Or: win+r/mmm -> enter|p+enter)

run PROD-HOT:
    server/ yarn run prod-hot  (Or: win+r/mmm -> ph+enter)