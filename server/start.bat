:: �����ʽ��ע���ļ��������Ҳ���֮
chcp 936
:: ��Ϊutf-8ʱ��һЩ��ʾ��Ϣ��mysql�ķ��������������ʾ�����Ӣ����
:: chcp 65001
@echo off
mode con lines=30 cols=60
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
:: ��������������Ŀ¼
cd /d "%~dp0"



:: �������д���bat������
net start mysql

:starts
echo ����룺 ��/p��d��ph��off��exit (��=p=prod, d=dev, ph=prod-hot, off=close mysql)
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