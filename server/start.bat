:: 编码格式，注意文件本身编码也请改之
chcp 936
:: 当为utf-8时，一些提示信息如mysql的服务启动情况的提示，变成英文了
:: chcp 65001
@echo off
mode con lines=30 cols=60
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
:: 进入批处理所在目录
cd /d "%~dp0"



:: 下面可以写你的bat代码了
net start mysql

:starts
echo 请键入： 空/p、d、ph、off、exit (空=p=prod, d=dev, ph=prod-hot, off=close mysql)
set /p input=

if "%input%" == "" (
    yarn start
) else (
    if "%input%" == "p" (
        yarn start
    ) else (
        if "%input%" == "d" (
            yarn run dev
        ) else (
            if "%input%" == "ph" (
                yarn run prod-hot
            ) else (
                if "%input%" == "off" (
                    net stop mysql
                ) else (
                    if "%input%" == "exit" (
                        exit
                    ) else (
                        goto :starts
                    )
                )
            )
        )
    )   
)