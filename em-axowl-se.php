<?php 

/*
Plugin Name: EM Axo WL SE
Description: Axo White Label Sverige
Version: 0.0.1
GitHub Plugin URI: zeah/EM-axowl-se
*/

defined('ABSPATH') or die('Blank Space');

require_once 'inc/axowl-settings-se.php';
require_once 'inc/axowl-shortcode-se.php';
require_once 'inc/axowl-data-se.php';
require_once 'inc/axowl-unsub-se.php';

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
		Axowl_settings_se::get_instance();
		Axowl_shortcode_se::get_instance();
		Axowl_data_se::get_instance();
		Axowl_unsub_se::get_instance();
	}

}