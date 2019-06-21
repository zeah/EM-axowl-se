<?php 

/*
Plugin Name: EM Axo WL SE
Description: Axo White Label Sverige
Version: 0.0.13
GitHub Plugin URI: zeah/EM-axowl-se
*/

defined('ABSPATH') or die('Blank Space');

require_once 'inc/axowl-settings-se.php';
require_once 'inc/axowl-shortcode-se.php';
require_once 'inc/axowl-data-se.php';
require_once 'inc/axowl-unsub-se.php';
require_once 'inc/axowl-abtesting-se.php';

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
        add_filter('wp_enqueue_scripts', [$this, 'add_sands']);

		Axowl_abtesting_se::get_instance();

		Axowl_settings_se::get_instance();
		Axowl_shortcode_se::get_instance();
		Axowl_data_se::get_instance();
		Axowl_unsub_se::get_instance();
	}

	public function add_sands() {
		wp_deregister_script('jquery');
        wp_register_script('jquery', '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js', [], false, true);
        wp_register_script('jquery-ui', '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js', ['jquery'], false, true);
        wp_register_script('jquery-touch', '//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js', ['jquery-ui'], false, true);
		
	}

}