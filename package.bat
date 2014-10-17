xcopy site deploy\ /s /e /y

rmdir deploy\.sass-cache /s /q
rmdir deploy\css /s /q
rmdir deploy\dev /s /q
rmdir deploy\js /s /q
rmdir deploy\dev /s /q
del deploy\logs\* /Q
del deploy\.htaccess /Q

pause