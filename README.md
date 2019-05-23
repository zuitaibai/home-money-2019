# HomeMoney2019

three folders£º
[feDev-pc-ng] FE: angular7+npm
[feDev-m-vue] FE-mobile: vue2.6+yarn
[server] SV: koa2+yarn


[feDev-pc-ng]: ======================================

run dev: localhost:4200
    feDev-pc-ng/src/index.html  base[href]="/"
    feDev-pc-ng/ bash:ng serve
    net start mysql + server/yarn run dev
	(Or: win+r/mmm -> d+enter )

run prod: localhost:8888/apps
    build: feDev-pc-ng/src/index.html  base[href]="/apps/"   bash: ng build --prod
	copy files into server/apps/
    net start mysql + server/yarn start
	(Or: win+r/mmm -> enter|p+enter)

run prod-hot: localhost:8888/apps
    build: feDev-pc-ng/src/index.html base[href]="/apps/"   bash: ng build --prod
	copy files into server/apps/
    net start mysql + server/yarn run prod-hot
	(Or: win+r/mmm -> ph+enter)
: ===================================================


[feDev-m-vue]: ======================================

run dev: localhost:8080/appm
    feDev-m-vue/ bash:yarn run serve
    net start mysql + server/yarn start
	(Or: win+r/mmm -> enter|p+enter )

run prod: localhost:8888/appm
    build: feDev-m-vue/   bash: yarn run build
	copy files into server/appm/
    net start mysql + server/yarn start
	(Or: win+r/mmm -> enter|p+enter)

run prod-hot: localhost:8888/appm
    build: feDev-m-vue/   bash: yarn run build
	copy files into server/appm/
    net start mysql + server/yarn run prod-hot
	(Or: win+r/mmm -> ph+enter)
: ===================================================