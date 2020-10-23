### Unimportant params (has default params):
    FRONTEND_PORT` - frontend client started to this port (8080)
    BACKED_PORT - API client started to this port (3000)
    PUBLIC_DIR - this parameter set a directory contains necessary sources: images, styles, additional scripts and so on and so forth (`public`)
    VIEW_DIR - this parameter set a directory contains templates to render pages (`templates`)
    TEMP_DIR - this parameter set a directory contains temporary files it's necessary to download user files (`temp`)
    LOG_LEVEL - set event logging level (`info`)
    DEBUG - set debugger for using debug package    
##### DBMS params:
    DB_DRIVER - this parameter set a database driver (`postgres`)
##### Authentication params:
    JWT_ACCESS_SECRET - this parameter set a secret for JWT access token generation
    JWT_REFRESH_SECRET - this parameter set a secret for JWT refresh token generation
    MAX_AGE_ACCESS_TOKEN_COOKIE - this paramets set an access token lifetime
    MAX_AGE_REFRESH_TOKEN_COOKIE - this paramets set a refresh token lifetime
    SALT_ROUND - this paramets set salt for password encryption



### Important params:
##### DBMS develop and production params:
    DEV_USER - this parameter set a database user necessary to work with API server
    DEV_HOST - this parameter set database host
    DEV_PASSWORD - this parameter set a database user password necessary to connect a database server
    DEV_DATABASE - this parameter set a database it keeps business entities
    DEV_PORT - this parameter set a port which database used

##### DBMS test params:
    TEST_USER - this parameter set a database user necessary to work with API server
    TEST_HOST - this parameter set database host
    TEST_PASSWORD - this parameter set a database user password necessary to connect a database server
    TEST_DATABASE - this parameter set a database it keeps business entities
    TEST_PORT - this parameter set a port which database used
