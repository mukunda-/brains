<?php

require_once 'config.php';

session_set_cookie_params( Config::SessionTimeout(), Config::AbsPath() );

?>