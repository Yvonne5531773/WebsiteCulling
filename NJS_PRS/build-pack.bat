@rem taskkill /F /IM liebao.exe
@rem  rm C:\Users\pc\AppData\Local\liebao\Data\tn.dat
@rem  rm -rf "C:\Users\pc\AppData\Local\liebao\User Data\Default\Cache"
@rem  rm -rf "C:\Users\pc\AppData\Local\liebao\User Data\Default\Media Cache"
@rem  rm -rf "C:\Users\pc\AppData\Local\liebao\User Data\Default\*.tmp"
@rem D:\dev\ksDebug\Debug\BkPackTool.exe -c -i dist\ -o C:\Users\pc\AppData\Local\liebao\Data\tn.dat --bk-libver=2016.05.18.15

call %cd%\BkPackTool.exe -c  --input=%cd%\website_culling\ --output=%cd%\websiteculling.dat --bk-libver=2016.10.31.1
@pause