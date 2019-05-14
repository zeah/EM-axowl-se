<?php 

defined('ABSPATH') or die('Blank Space');


final class Axowl_abfp {
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
		add_filter('the_content', [$this, 'ab'], 1);
	}	


	public function ab($content) {
		if (!is_front_page()) return $content;

		$opt = get_option('em_axowl');

		if (!isset($opt['abtesting'])) return $content;

		$ab = [];

		if (isset($opt['ab_id1']) && $opt['ab_id1'] != 'Inactive') {

			if (!isset($opt['ab_chance1']) || !intval($opt['ab_chance1'])) $ab[] = 'ab_id1';
			else 
				for ($i = 0; $i < intval($opt['ab_chance1']); $i++)
					$ab[] = 'ab_id1';
		}

		if (isset($opt['ab_id2']) && $opt['ab_id2'] != 'Inactive') {

			if (!isset($opt['ab_chance2']) || !intval($opt['ab_chance2'])) $ab[] = 'ab_id2';
			else 
				for ($i = 0; $i < intval($opt['ab_chance2']); $i++)
					$ab[] = 'ab_id2';
		}

		if (isset($opt['ab_id3']) && $opt['ab_id3'] != 'Inactive') {

			if (!isset($opt['ab_chance3']) || !intval($opt['ab_chance3'])) $ab[] = 'ab_id3';
			else 
				for ($i = 0; $i < intval($opt['ab_chance3']); $i++)
					$ab[] = 'ab_id3';
		}

		if (isset($opt['ab_id4']) && $opt['ab_id4'] != 'Inactive') {

			if (!isset($opt['ab_chance4']) || !intval($opt['ab_chance4'])) $ab[] = 'ab_id4';
			else 
				for ($i = 0; $i < intval($opt['ab_chance4']); $i++)
					$ab[] = 'ab_id4';
		}

		$id = $ab[rand(0, sizeof($ab)-1)];

		if (isset($_COOKIE['abname'])) {

			$c = $_COOKIE['abname'];

			if (isset($opt['ab_name1']) && $opt['ab_name1'] == $c) $id = 'ab_id1';
			if (isset($opt['ab_name2']) && $opt['ab_name2'] == $c) $id = 'ab_id2';
			if (isset($opt['ab_name3']) && $opt['ab_name3'] == $c) $id = 'ab_id3';
			if (isset($opt['ab_name4']) && $opt['ab_name4'] == $c) $id = 'ab_id4';

		}

		$name = '';

		$post = get_post($opt[$id]);

		if (!$post) return $content;


		switch ($id) {
			case 'ab_id1': $name = $opt['ab_name1']; break;
			case 'ab_id2': $name = $opt['ab_name2']; break;
			case 'ab_id3': $name = $opt['ab_name3']; break;
			case 'ab_id4': $name = $opt['ab_name4']; break;
		}

		if (!$name) $name = $post->post_name;

		return $post->post_content.'<input type="hidden" id="abtesting-name" value="'.$name.'">';

		
	}

}