<?php 

defined('ABSPATH') or die('Blank Space');

final class Axowl_settings {
	/* singleton */
	private static $instance = null;

	private $opt;


	public static function get_instance() {
		if (self::$instance === null) self::$instance = new self();

		return self::$instance;
	}

	private function __construct() {
		$this->opt = get_option('em_axowl');
		if (!is_array($this->opt)) $this->opt = [];

		$this->hooks();
	}

	private function hooks() {
		add_action('admin_menu', [$this, 'add_menu']);
		add_action('admin_init', [$this, 'register_settings']);
		add_action('admin_enqueue_scripts', [$this, 'add_sands']);

		add_action('settings_page_em-axowl-page', [$this, 'delete_transient']);
		add_action('upgrader_process_complete', [$this, 'delete_transient']);

		// TODO delete transient on save
	}


	public function delete_transient() {
		delete_transient('axowl_sc1');
	}

	public function add_sands($hook) {

		if ($hook != 'settings_page_em-axowl-page') return;

        wp_enqueue_style('emaxowl-admin', EM_AXOWL_PLUGIN_URL.'assets/css/admin/emaxo.css', array(), '1.0.0');
        wp_enqueue_script('emaxowl-admin', EM_AXOWL_PLUGIN_URL.'/assets/js/admin/emaxo.js', array(), '1.0.0', true);

	}

	public function add_menu() {
		add_submenu_page('options-general.php', 'EM Axo White Label', 'Axo WL', 'manage_options', 'em-axowl-page', [$this, 'page_callback']);
	}

	public function register_settings() {
		register_setting('em-axowl-settings-name', 'em_axowl', ['sanitize_callback' => array($this, 'sanitize')]);
		register_setting('em-axowl-settings-data', 'em_axowl', ['sanitize_callback' => array($this, 'sanitize')]);
		register_setting('em-axowl-settings-input', 'em_axowl', ['sanitize_callback' => array($this, 'sanitize')]);
		register_setting('em-axowl-settings-ab', 'em_axowl', ['sanitize_callback' => array($this, 'sanitize')]);

		add_settings_section('em-axowl-name', '', [$this, 'name_section'], 'em-axowl-page-name');
		add_settings_field('em-axowl-name', 'Partner Name', [$this, 'input_setting'], 'em-axowl-page-name', 'em-axowl-name', ['name', 'Name of the partner, as agreed with Axo.']);
		add_settings_field('em-axowl-content', 'Content', [$this, 'input_setting'], 'em-axowl-page-name', 'em-axowl-name', ['content', 'Can be used to distinguish between different publishers']);


		// add_settings_section('em-axowl-ab', '', [$this, 'ab_section'], 'em-axowl-page-ab');
		// add_settings_field('em-axowl-ab', 'Testing settings', [$this, 'ab_setting'], 'em-axowl-page-ab', 'em-axowl-ab', ['ab', 'ab testing']);


		$settings = [
			'form_url' => 'Axo\'s URL',
			'sql_info' => 'Callback for form data',
			'sql_conversions' => 'Callback for conversion details',
			'unsub' => 'Callback for unsubbing',
			// 'gdocs_email' => 'Google Docs for storing email/phone',
			'gdocs_ads' => 'Google Docs for Google Ads upload',
			// 'slack' => 'Slack webhook',
			'payout' => 'Commision earned per lead (used for uploading to google ads and slack)',
			'currency' => 'NOK or SEK (used for uploading to google ads)',
			'ga_code' => 'Google Analytics'
		];

		add_settings_section('em-axowl-data', 'URLs', [$this, 'data_section'], 'em-axowl-page-data');
		foreach ($settings as $key => $value)
			add_settings_field(
				'em-axowl-'.$key, 
				ucwords(str_replace('_', ' ', $key)), 
				[$this, 'input_setting'], 
				'em-axowl-page-data', 
				'em-axowl-data', 
				[$key, $value]
			);


		$input = [
			'loan_amount' => 'Loan amount.',
			'tenure' => 'The repayment period in years.',
			'co_applicant' => 'Whether a co-applicant is provided.',
			'collect_debt' => 'Whether existing loans should be refinanced.',
			'social_number' => 'Valid Norwegian Soscial Security Number ("fødselsnummer"), 11 digits.',
			'mobile_number' => 'Norwegian mobile phone number, without spaces or a leading +47.',
			'email' => 'The customer\'s email address.',
			'employment_type' => 'Select a value from list.',
			'employment_since' => 'The year the customer started working for the current employer, e.g. 2012.',
			'employer' => 'Name of the customer\'s employer.',
			'education' => 'Select a value from list.',
			'norwegian' => 'Whether the customer is a Norwegian citizen.',
			'years_in_norway' => 'Select a value from list.',
			'country_of_origin' => 'Select a value from list.',
			'income' => 'Yearly income before taxes ("bruttolønn")',
			'civilstatus' => 'Select a value from list.',
			'living_conditions' => 'Select a value from list.',
			'address_since' => 'The year the customer\'s household started living at the current address, e.g. 2011. Any year after 1960.',
			'number_of_children' => 'The number of of children under 18 in the household.',
			'allimony_per_month' => 'Monthly child support ("barnebidrag")',
			'spouse_income' => 'The customer\'s spouse/partner\'s income before taxes ("bruttolønn")',
			'rent' => 'Monthly rent paid by the customer\'s household, not including interest/down payment of mortgages.',
			'rent_income' => 'Monthly rent received by the customer\'s household.',
			'mortgage' => 'Sum of mortgages ("bolliglån") and shared debt ("fellesgjeld") for the customer\'s household.',
			'education_loan' => 'Sum of student loans ("Studielån") in the household.',
			'car_boat_mc_loan' => 'Secured loans for e.g. cars, boats and MCs. Should not include consumer loans used to by e.g. a car.',
			'co_applicant_social_number' => 'Valid Norwegian Social Security Number ("fødselesnummer"), 11 digits.',
			'co_applicant_name' => 'The co applicant\'s full name.',
			'co_applicant_mobile_number' => 'Norwegian mobile phone number, without spaces or a leading +47.',
			'co_applicant_email' => 'The co applicant\'s email address.',
			'co_applicant_employment_type' => 'Select a value from list.',
			'co_applicant_employment_since' => 'The year the customer started working for the current employer, e.g. 2012.',
			'co_applicant_employer' => 'Name of the co applicant\'s employer.',
			'co_applicant_education' => 'Select a value from list.',
			'co_applicant_norwegian' => 'Whether the co applicant holds a Norwegian citizenship.',
			'co_applicant_years_in_norway' => 'The number of years the co applicant has lived in Norway.',
			'co_applicant_country_of_origin' => 'Select a value from list.',
			'co_applicant_income' => 'Yearly income before taxes ("bruttolønn")',
			// 'unsecured_debt_lender' => 'List of (unsecured) lenders.',
			// 'unsecured_debt_balance' => 'The sum of all loans the customer wants to refinance.',
			// 'total_unsecured_debt_balance' => 'The sum of all loans the customer wants to refinance.',
			'unsecured_debt_balance' => 'How much to refinance field',
			'total_unsecured_debt' => 'Sum of other, unsecured loans in the household. (forbrukslån)',
			'account_number' => 'The bank account the loan will be paid out to, <br>without e.g. spaces and dots. CDV control is recommended',
			'axo_accept' => 'Checkbox for accepting data usage by axo.',
			'contact_accept' => 'Checkbox for accepting data usage by axo.',
			'popup_text' => 'Bottom text for email/phone popup collector'
		];

		add_settings_section('em-axowl-input', 'Text for form inputs', [$this, 'input_section'], 'em-axowl-page-input');
		foreach ($input as $key => $value)
			add_settings_field(
				'em-axowl-'.$key, 
				ucwords(str_replace('_', ' ', $key)), 
				[$this, 'input'], 
				'em-axowl-page-input', 
				'em-axowl-input', 
				[$key, $value, true]
			);

			// add_settings_field(
			// 	'em-axowl-personvern',
			// 	'Personvern',
			// 	[$this, 'fieldinput'],
			// 	'em-axowl-page-input',
			// 	'em-axowl-input'
			// );

	}


	/**
	 * echoing page
	 */
	public function page_callback() {

		// title
		echo '<h1>Effektiv Markedsføring Axo White Label</h1>';
		// container
		echo '<div class="em-settings-container">';

		// nav
		echo '<div class="em-settings-nav">
			<button type="button" class="em-settings-anchor em-settings-anchor-name em-settings-anchor-active">General</button>
			<button type="button" class="em-settings-anchor em-settings-anchor-data">Callbacks</button>
			<button type="button" class="em-settings-anchor em-settings-anchor-input">Input text</button>
			<!-- <button type="button" class="em-settings-anchor em-settings-anchor-ab">A/B</button> -->
		</div>';

		// form
		echo '<div class="em-settings-form-container">';
		echo '<form class="em-settings-form" action="options.php" method="POST">';

		// first tab
		echo '<div class="em-settings em-settings-name">';
		settings_fields('em-axowl-settings-name');
		do_settings_sections('em-axowl-page-name');
		echo '</div>';

		// second tab
		echo '<div class="em-settings em-settings-data em-hidden">';
		settings_fields('em-axowl-settings-data');
		do_settings_sections('em-axowl-page-data');
		echo '</div>';

		// third tab
		echo '<div class="em-settings em-settings-input em-hidden">';
		settings_fields('em-axowl-settings-input');
		do_settings_sections('em-axowl-page-input');
		echo '</div>';

		// fourth tab
		// echo '<div class="em-settings em-settings-ab em-hidden">';
		// settings_fields('em-axowl-settings-ab');
		// do_settings_sections('em-axowl-page-ab');
		// echo '</div>';


		submit_button('save');
		echo '</form>';
		echo '</div>';

		// end of container
		echo '</div>';
	}

	public function data_section() {
		echo 'All the data used. Only Form Url is required.';
	}

	public function name_section() {
	}

	public function input_section() {
	}


	public function input($name) {
		echo sprintf('<h4 class="em-settings-h4">%1$s</h4>
					<input class="em-settings-i" placeholder="Input title" type="text" name="em_axowl[%2$s]" value="%3$s">
					<input class="em-settings-i" placeholder="Helper text" type="text" name="em_axowl[%2$s_ht]" value="%4$s">
					<input class="em-settings-i" placeholder="Error text" type="text" name="em_axowl[%2$s_error]" value="%5$s">',
					$name[1],
					$name[0],
					$this->option($name[0]),
					$this->option($name[0].'_ht'),
					$this->option($name[0].'_error')
				);	

	}

	// public function fieldinput() {

	// }

	/**
	 * echoing input field
	 * @param  String $name name of data
	 */
	// public function input2($name) {
	// 	$html = '';

	// 	if (isset($name[1])) $html .= '<h4 style="margin: 0; margin-top: 4px;">'.$name[1].'</h4>';

	// 	$html .= '<div><div style="width: 100px; display: inline-block;">Title Text:</div><input type="text" style="width: 600px; max-width: 90%;" name="em_axowl['.$name[0].']" value="'.$this->get($name[0]).'"></div>';
	// 	if (isset($name[2])) $html .= '<div><div style="width: 100px; display: inline-block;">Helper Text:</div><input type="text" style="width: 600px; max-width: 90%;" name="em_axowl['.$name[0].'_ht]" value="'.$this->get($name[0].'_ht').'"></div>';
	
	// 	echo $html;
	// }

	/**
	 * echoing input field
	 * @param  String $name name of data
	 */
	public function input_setting($name) {

		echo sprintf('<h4 class="em-settings-h4">%1$s</h4>
					  <input type="text" class="em-settings-i" name="em_axowl[%2$s]" value="%3$s">',
					  $name[1],
					  $name[0],
					  $this->option($name[0])
					);

		// $html = '';

		// if (isset($name[1])) $html .= '<h4 style="margin: 0; margin-top: 4px;">'.$name[1].'</h4>';

		// $html .= '<div><input type="text" style="width: 600px; max-width: 90%;" name="em_axowl['.$name[0].']" value="'.$this->get($name[0]).'"></div>';
	
		// echo $html;
	}

	public function ab_section() {
		// echo 'title';
	}

	public function ab_setting() {
		$d = get_option('em_axowl');
		$posts = get_posts(['numberposts' => -1, 'post_type' => ['post', 'page'], 'orderby' => 'name', 'order' => 'asc']);

		$divs = '';
		for ($i = 1; $i < 5; $i++) {
			$divs .= sprintf(
				'<div>
					<input name="em_axowl[ab_name%1$s]" type="text" value="%2$s">
				 </div>
				 <div>
				 	<select name="em_axowl[ab_id%1$s]">%3$s</select>
				 </div>
				 <div>
					<input name="em_axowl[ab_chance%1$s]" type="text" value="%4$s">
				 </div>
				',
				$i,
				$this->option('ab_name'.$i),
				$this->option_html($d['ab_id'.$i], $posts),
				$this->option('ab_chance'.$i)
			);
		}

		echo sprintf('
			<div class="em-settings-ab-container">
				<div><input type="checkbox" name="em_axowl[abtesting]"%1$s> Active</div>
				<div></div>
				<div></div>
				
				<div>Name</div>
				<div>Post</div>
				<div>Chance</div>
				
				%2$s
			</div>',
			$this->option('abtesting') ? ' checked' : '',
			$divs
		);

	}


	private function option_html($id, $posts = []) {
		$html = '<option>Inactive</option>';
		foreach ($posts as $p) {

			$sel = false;
			if ($p->ID == $id) $sel = true;
			$html .= sprintf('<option value="%s"%s>%s</option>', $p->ID, $sel ? ' selected' : '', $p->post_name);
		}
		return $html;
	}


	private function option($name) {

		// return $option.' '.$name;
		// $opt = $this->data;

		// switch ($option) {
			// case 'name': $opt = get_option('axowl_name'); break;
			// case 'data': $opt = get_option('axowl_data'); break;
			// case 'input': $opt = get_option('axowl_input');
		// }

		$opt = get_option('em_axowl');

		if (isset($opt[$name])) return esc_attr($opt[$name]);

		return '';
	}


	/**
	 * getting and escaping data for input
	 * @param  String $name what data to get
	 * @return String       the data for the input
	 */
	private function get($name) {
		$d = $this->opt;

		if (isset($d[$name])) return esc_attr($d[$name]);

		return;
	}

	/**
	 * helper function which sanitizes arrays and strings
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	public static function sanitize($data) {
		if (!is_array($data)) return wp_kses_post($data);

		$d = [];
		foreach($data as $key => $value)
			$d[$key] = Axowl_settings::sanitize($value);

		return $d;
	}
}