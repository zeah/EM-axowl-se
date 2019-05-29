<?php 
defined('ABSPATH') or die('Blank Space');


final class Axowl_abtesting_se {
	/* singleton */
	private static $instance = null;

	private $po = null;
	private $id = null;

	public static function get_instance() {
		if (self::$instance === null) self::$instance = new self();

		return self::$instance;
	}

	private function __construct() {
		$this->wp_hooks();
	}

	private function wp_hooks() {
		// if (rand(0, 1) == 1) return;

		if (isset($_COOKIE['ab']) && $_COOKIE['ab'] == '1') return;

		if (!isset($_COOKIE['ab']) && rand(0, 1) == 1) {
			setcookie('ab', '1', time() + (86400 * 10), '/');
			return;
		}

		setcookie('ab', '0', time() + (86400 * 10), '/');

		$opt = get_option('em_axowl_se');

		if (!isset($opt['ab_onoff']) || !$opt['ab_onoff']) return;
		if (!isset($opt['ab_page']) || $opt['ab_page'] == 'Inactive') return;
		if (!isset($opt['ab_add']) || $opt['ab_add'] == 'Inactive') return;

		$this->po = get_post($opt['ab_add']);
		$this->id = $opt['ab_page'];

		add_action('wp', [$this, 'test']);
	}

	public function test() {
		global $post;
		if ($this->id != $post->ID) return;


		add_filter('the_content', [$this, 'change_content'], 1);
		add_filter('the_post', [$this, 'change_name'], 1);
		add_filter('pre_get_document_title', [$this, 'change_the_title']);
		add_filter('body_class', [$this, 'change_class']);
	}

	public function change_class($class) {
		$page = 'page-id-'.$this->po->ID;

		if ($this->po->post_type == 'post') $page = 'postid-'.$this->po->ID;
		
		for ($i = 0; $i < sizeof($class); $i++)
			if (strpos($class[$i], 'page-id-') !== false || strpos($$class[$i], 'postid-') !== false)
				$class[$i] = $page;


			
		return $class;
	}

	public function change_the_title() {
		return $this->po->post_title;
	}

	public function change_name($post) {
		$post->post_name = $this->po->post_name;
		return $post;
	}

	public function change_content($p) {

		if (!in_the_loop()) return $p;

		// setcookie('ab', $this->po->ID, time() + (86400 * 10), '/');

		return $this->po->post_content;
	}

}