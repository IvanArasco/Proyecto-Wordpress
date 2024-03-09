<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'nOsTU7BXjb74|+aGP[aB>}T-7dBTSc=ie]@p *ZhPHpD,%2AK;-uBr!]X>6vjH2g' );
define( 'SECURE_AUTH_KEY',   '*JF]aRaf+9Eg)( 437qz=ItK&xp6Es7tzl+ZEN:S%T_fpWtZ-{ocr4FPoP gt{|z' );
define( 'LOGGED_IN_KEY',     ')6$EEV3{B%|xh7KgLxlb~UsZ,w<}jUv!=Y.23fRpU9RlMQcpW9RJ~LHV/VSob6JJ' );
define( 'NONCE_KEY',         '$55lIg,VC?6UJN-)!BNt]?0$%e0N5ka%uk$2@PkZc+1@Snnno/f,1]&gks%W!&3m' );
define( 'AUTH_SALT',         '>4`SS<FpU$~NTM~?}FQ1o@W/B;{#^wBx;lG74]N6upztHsX.?xyH~FcI<$0gA-%+' );
define( 'SECURE_AUTH_SALT',  'fu^0=ArFq#1mIa`4h?;fwQ!Oq*bsh.Q9cQ#v1-5krA=T2X(JIS#YiJm;RdnKk:Y;' );
define( 'LOGGED_IN_SALT',    'R*b%2M^o=]/;7}h`2nfN*eT~U`S!SOXrIM5(uh-L`AFA&qNGki*Jiz-8,].K?:r,' );
define( 'NONCE_SALT',        '-T)Z5vbbaf;{mk~)|_,{|8>d?Nz}<}GdJboym-X2c3.p5]*fgND;SRl `TnS#x,F' );
define( 'WP_CACHE_KEY_SALT', 'gN~xb.J-7.+:V+SW1wf!-JXw:;hs-a)5k]r A{oQ#D0/Tfr`EzYf* xL:p7f&lNe' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
