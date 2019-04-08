@echo off
mode con lines=30 cols=60
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
rem 进入批处理所在目录
cd /d "%~dp0"
rem 下面可以写你的bat代码了
net start mysql
yarn start




rem rem 方法二：
rem @ echo off
rem %1 %2
rem ver|find "5.">nul&&goto :st
rem mshta vbscript:createobject("shell.application").shellexecute("%~s0","goto :st","","runas",1)(window.close)&goto :eof

rem :st
rem copy "%~0" "%windir%\system32\"
rem rem 下面可以写你的bat代码了
rem net start mysql
rem yarn start