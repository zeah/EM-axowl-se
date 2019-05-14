<?php 

/*
Plugin Name: EM Axo WL
Description: Axo White Label Sverige
Version: 0.0.1
GitHub Plugin URI: zeah/EM-axowl-se
*/

defined('ABSPATH') or die('Blank Space');

require_once 'inc/axowl-settings-se.php';
require_once 'inc/axowl-shortcode-se.php';
require_once 'inc/axowl-data-se.php';
require_once 'inc/axowl-ads-se.php';
// require_once 'inc/axowl-cookie.php';
require_once 'inc/axowl-unsub.php';
// require_once 'inc/axowl-abfp.php';


function init_em_axowl_se() {
	EM_axowl_se::get_instance();
}

init_em_axowl_se();

define('EM_AXOWL_SE_PLUGIN_URL', plugin_dir_url(__FILE__));


final class EM_axowl_se {
	/* singleton */
	private static $instance = null;

	public static function get_instance() {
		if (self::$instance === null) self::$instance = new self();

		return self::$instance;
	}

	private function __construct() {
	
		// wp_die('<xmp>'.print_r(parse_url($_SERVER['HTTP_REFERER']), true).'</xmp>');
		// $temp = '260410';

		// wp_die('<xmp>'.print_r('hi'.sprintf('%s-%s-%s', 
		// 	(intval(substr($temp, 4, 2)) < 20) ? '20'.substr($temp, 4, 2) : '19'.substr($temp, 4, 2), 
		// 	substr($temp, 2, 2), 
		// 	substr($temp, 0, 2)), true).'</xmp>');


		// Axowl_abfp::get_instance();
		Axowl_settings_se::get_instance();
		Axowl_shortcode_se::get_instance();
		Axowl_data_se::get_instance();
		Axowl_ads_se::get_instance();
		// Axowl_cookie::get_instance();
		Axowl_unsub_se::get_instance();
	}

}