@echo off
mode con lines=30 cols=60
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
rem 进入批处理所在目录
cd /d "%~dp0"
rem 下面可以写你的bat代码了
net start mysql
yarn start