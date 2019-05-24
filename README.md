# HomeMoney2019

### three folders:

[feDev-pc-ng] FE: angular7+npm

[feDev-m-vue] FE-mobile: vue2.6+yarn

[server] SV: koa2+yarn

	|----apps/      pc端fe文件s + readme.md

	|----apps/mb/   mobile端fe文件s + readme.md


### [feDev-pc-ng]: ======================================

run DEV: localhost:4200

    feDev-pc-ng/src/index.html  base[href]="/"

    feDev-pc-ng/ bash:ng serve

    net start mysql + server/yarn run dev
	(Or: win+r/mmm -> d+enter )

run PROD: localhost:8888/apps

    feDev-pc-ng/src/index.html  base[href]="/apps/"  

    build: feDev-pc-ng/    bash: ng build --prod

	copy files into server/apps/

    net start mysql + server/yarn start
	(Or: win+r/mmm -> enter|p+enter)

run PROD-HOT: localhost:8888/apps

    feDev-pc-ng/src/index.html base[href]="/apps/"   

    build: feDev-pc-ng/    bash: ng build --prod

	copy files into server/apps/

    net start mysql + server/yarn run prod-hot
	(Or: win+r/mmm -> ph+enter)

: ===================================================


### [feDev-m-vue]: ======================================

run DEV: localhost:8080/apps

    feDev-m-vue/src/config.js  preApi = '/api/'

    feDev-m-vue/ bash:yarn run serve

    net start mysql + server/yarn start
	(Or: win+r/mmm -> enter|p+enter )

run PROD: localhost:8888/apps/mb

    feDev-m-vue/src/config.js  preApi = '/apps/api/'

    build: feDev-m-vue/   bash: yarn run build

	copy files into server/apps/mb

    net start mysql + server/yarn start
	(Or: win+r/mmm -> enter|p+enter)

run PROD-HOT: localhost:8888/apps/mb

    feDev-m-vue/src/config.js  preApi = '/apps/api/'

    build: feDev-m-vue/   bash: yarn run build

	copy files into server/apps/mb

    net start mysql + server/yarn run prod-hot
	(Or: win+r/mmm -> ph+enter)
: ===================================================