xcopy site deploy\ /s /e /y

rmdir deploy\.sass-cache /s /q
rmdir deploy\css /s /q
rmdir deploy\dev /s /q
rmdir deploy\js /s /q
del deploy\logs\* /Q
del deploy\nebula\logs\* /Q
del deploy\.htaccess /Q
del deploy\build\scripts.js
del deploy\build\style.css
del deploy\build\style.css.map

xcopy nebula deploy\nebula\ /s /e /y

pause