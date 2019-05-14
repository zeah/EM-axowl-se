<?php 


final class Axowl_cookie {
	/* singleton */
	private static $instance = null;

	public static function get_instance() {
		if (self::$instance === null) self::$instance = new self();

		return self::$instance;
	}

	private function __construct() {
		$this->wp_hooks();
	}

	private function wp_hooks() {
		add_action('init', [$this, 'referer']);
		// $this->referer();
	}

	public function referer() {
		
		// if no referer data
		//if (!isset($_SERVER['REFERER']) || !$_SERVER['REFERER']) return;

		$r = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : ''; 
		// wp_die('<xmp>'.print_r($_SERVER, true).'</xmp>');

		if (strpos($r, $_SERVER['SERVER_NAME']) !== false) return;

		// sets cookie for a year
		setcookie('referer', $r, time()+(3600*24*365));
	}

	// referer cookie
}