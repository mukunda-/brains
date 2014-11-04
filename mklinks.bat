@setlocal enableextensions
@cd /d "%~dp0"

cd admin
mklink /D classes ..\site\classes
mklink /D libs ..\site\libs
mklink /D private ..\site\private
cd ..

cd site
mklink /D nebula ..\nebula
cd ..

pause