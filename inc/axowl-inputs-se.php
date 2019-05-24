<?php 
defined('ABSPATH') or die('Blank Space');


require_once 'axowl-list-se.php';

final class Axowl_inputs_se {

	public static function years() {
		$years = [];
		for ($i = 2018; $i > 1959; $i--)
			array_push($years, $i);

		return $years;
	}


	public static $inputs = [
		'div0' => ['class' => 'em-part-1-grid'],
		'monthly_cost' => ['text_field' => 'Månadkostnad', 'notInput' => true],
		'loan_amount' => ['text' => true, 'range' => true, 'validation' => 'currency', 
						  'format' => 'currency', 'max' => 500000, 'min' => 10000, 'default' => 250000, 'step' => 10000],
		'tenure' => ['list' => Axowl_list_se::tenure, 'validation' => 'list', 'empty' => false, 'start' => 5, 'key_as_value' => true, 'hidden' => true],
		'collect_compare' => ['compare' => true],
		'collect_debt' => ['checkbox' => true, 'no' => true, 'hidden' => true, 'show' => 'em-element-collect_compare'],
		'mobile_number' => ['text' => true, 'type' => 'tel', 'validation' => 'phone', 'digits' => 8, 'hidden' => true],
		'email' => ['text' => true, 'type' => 'email', 'validation' => 'email', 'hidden' => true],
		'axo_accept' => ['check' => true, 'validation' => 'check', 'hidden' => true],
		'contact_accepted' => ['check' => true, 'hidden' => true],
		'neste' => ['button' => true, 'button_text' => 'Näste'],
		'/div0' => '',
		
		'/div55' => [],


		'div98' => ['class' => 'em-slidedown em-hidden'],
		'div99' => ['class' => 'em-part-lower-container'],
		'div100' => ['class' => 'em-lower-titles'],

		'social_number' => ['text' => true, 'page' => '2', 'validation' => 'socialnumber', 'digits' => 11],
		'employment_type' => ['list' => Axowl_list_se::employment_type, 'validation' => 'list'],
		'div5' => ['class' => 'em-date'],
		'employment_since_year' => ['hidden' => true, 'list' => Axowl_list_se::years, 'validation' => 'list'],
		'employment_since_month' => ['hidden' => true, 'list' => Axowl_list_se::months, 'validation' => 'list'],
		'/div5' => [],
		'div6' => ['class' => 'em-date'],
		'employment_last_year' => ['hidden' => true, 'list' => Axowl_list_se::lastyears, 'validation' => 'list'],
		'employment_last_month' => ['hidden' => true, 'list' => Axowl_list_se::months, 'validation' => 'list'],
		'/div6' => [],
		'employer' => ['text' => true, 'hidden' => true, 'validation' => 'empty'],
		'work_number' => ['text' => true, 'hidden' => true, 'validation' => 'phone', 'type' => 'tel'],
		'monthly_income' => ['text' => true, 'validation' => 'currency', 'format' => 'currency'],

		'co_applicant' => ['checkbox' => true, 'page' => '3', 'no' => true, 'show' => 'em-part-4'],
		'civilstatus' => ['list' => Axowl_list_se::civilstatus, 'validation' => 'list'],
		'number_of_children' => ['key_as_value' => true, 'list' => Axowl_list_se::number_of_children, 'validation' => 'list'],
		'living_conditions' => ['list' => Axowl_list_se::living_conditions, 'validation' => 'list'],
		'div7' => ['class' => 'em-date'],
		'address_since_year' => ['list' => Axowl_list_se::years, 'validation' => 'list'],
		'address_since_month' => ['list' => Axowl_list_se::months, 'validation' => 'list'],
		'/div7' => [],
		'rent' => ['hidden' => true, 'text' => true, 'validation' => 'currency', 'format' => 'currency'],


		'div2' => ['class' => 'em-co-applicant em-lower', 'page' => '4', 'page_class' => 'em-hidden'], 

		'co_applicant_social_number' => ['text' => true, 'validation' => 'socialnumber', 'digits' => 11],
		'co_applicant_mobile_number' => ['text' => true, 'validation' => 'phone', 'digits' => 8],
		'co_applicant_email' => ['text' => true, 'validation' => 'email'],
		'co_applicant_employment_type' => ['list' => Axowl_list_se::employment_type, 'validation' => 'list'],
		'div8' => ['class' => 'em-date'],
		'co_applicant_employment_since_year' => ['list' => Axowl_list_se::years, 'validation' => 'list', 'hidden' => true],
		'co_applicant_employment_since_month' => ['list' => Axowl_list_se::months, 'validation' => 'list', 'hidden' => true],
		'/div8' => [],
		'div9' => ['class' => 'em-date'],
		'co_applicant_employment_last_year' => ['list' => Axowl_list_se::lastyears, 'validation' => 'list', 'hidden' => true],
		'co_applicant_employment_last_month' => ['list' => Axowl_list_se::months, 'validation' => 'list', 'hidden' => true],
		'/div9' => [],
		'co_applicant_employer' => ['text' => true, 'hidden' => true, 'validation' => 'empty'],
		'co_applicant_work_number' => ['text' => true, 'hidden' => true, 'validation' => 'phone', 'type' => 'tel'],
		'co_applicant_monthly_income' => ['text' => true, 'validation' => 'currency', 'format' => 'currency'],
		'living_together' => ['checkbox' => true, 'no' => true, 'show' => 'no: em-element-co_applicant_living_conditions'],
		'co_applicant_civilstatus' => ['list' => Axowl_list_se::civilstatus, 'validation' => 'list'],
		'co_applicant_living_conditions' => ['list' => Axowl_list_se::living_conditions, 'validation' => 'list'],
		'div10' => ['class' => 'em-date'],
		'co_applicant_address_since_year' => ['list' => Axowl_list_se::years, 'validation' => 'list'],
		'co_applicant_address_since_month' => ['list' => Axowl_list_se::months, 'validation' => 'list'],
		'/div11' => [],
		'co_applicant_rent' => ['hidden' => true, 'text' => true, 'validation' => 'currency', 'format' => 'currency'],


		'/div2' => '',

		'credit_loan_amount' => ['text' => true, 'page' => '5', 'validation' => 'currency', 'format' => 'currency', 'hidden' => true],
		'loan_purpose' => ['list' => Axowl_list_se::loan_purpose, 'validation' => 'list'],
		'privateloan' => ['text' => true, 'validation' => 'currency', 'format' => 'currency', 'hidden' => true],
		'creditloan' => ['text' => true, 'validation' => 'currency', 'format' => 'currency', 'hidden' => true],

		'/div98' => '',
		'/div99' => ''
	];


	public static $inputs2 = [
		'div0' => ['class' => 'em-part-1-grid'],
		'monthly_cost' => ['text_field' => 'Månadkostnad', 'notInput' => true],
		'loan_amount' => ['text' => true, 'range' => true, 'validation' => 'currency', 
						  'format' => 'currency', 'max' => 500000, 'min' => 10000, 'default' => 250000, 'step' => 10000],
		// 'collect_compare' => ['compare' => true],
		'collect_debt' => ['checkbox' => true, 'no' => true, 'hidden' => true],
		'tenure' => ['list' => Axowl_list_se::tenure, 'validation' => 'list', 'empty' => false, 'start' => 5, 'key_as_value' => true, 'hidden' => true],
		'mobile_number' => ['text' => true, 'type' => 'tel', 'validation' => 'phone', 'digits' => 8, 'hidden' => true],
		'email' => ['text' => true, 'type' => 'email', 'validation' => 'email', 'hidden' => true],
		'axo_accept' => ['check' => true, 'validation' => 'check', 'hidden' => true],
		'contact_accepted' => ['check' => true, 'hidden' => true],
		'neste' => ['button' => true, 'button_text' => 'Näste'],
		'/div0' => '',
		
		'/div55' => [],


		'div98' => ['class' => 'em-slidedown em-hidden'],
		// 'div99' => ['class' => 'em-part-lower-container'],
		'div100' => ['class' => 'em-lower-titles'],

		'co_applicant' => ['checkbox' => true, 'no' => true,  'page' => '2', 'show' => 'em-part-4'],

		// 'social_number' => ['text' => true, 'page' => '2', 'validation' => 'socialnumber', 'digits' => 11],
		'employment_type' => ['list' => Axowl_list_se::employment_type, 'validation' => 'list'],
		'monthly_income' => ['text' => true, 'validation' => 'currency', 'format' => 'currency'],
		'div4' => ['class' => 'em-employ'],
		'employer' => ['text' => true, 'hidden' => true, 'validation' => 'empty'],
		'div5' => ['class' => 'em-date'],
		'employment_since_year' => ['hidden' => true, 'list' => Axowl_list_se::years, 'validation' => 'list'],
		'employment_since_month' => ['hidden' => true, 'list' => Axowl_list_se::months, 'validation' => 'list'],
		'/div5' => [],
		'div6' => ['class' => 'em-date'],
		'employment_last_year' => ['hidden' => true, 'list' => Axowl_list_se::lastyears, 'validation' => 'list'],
		'employment_last_month' => ['hidden' => true, 'list' => Axowl_list_se::months, 'validation' => 'list'],
		'/div6' => [],
		'/div4' => [],
		// 'work_number' => ['text' => true, 'hidden' => true, 'validation' => 'phone', 'type' => 'tel'],

		// 'co_applicant' => ['checkbox' => true, 'page' => '3', 'no' => true, 'show' => 'em-part-4'],
		'civilstatus' => ['list' => Axowl_list_se::civilstatus, 'validation' => 'list'],
		'number_of_children' => ['key_as_value' => true, 'list' => Axowl_list_se::number_of_children, 'validation' => 'list'],
		'living_conditions' => ['list' => Axowl_list_se::living_conditions, 'validation' => 'list'],
		'div7' => ['class' => 'em-date'],
		'address_since_year' => ['list' => Axowl_list_se::years, 'validation' => 'list'],
		'address_since_month' => ['list' => Axowl_list_se::months, 'validation' => 'list'],
		'/div7' => [],
		'rent' => ['hidden' => true, 'text' => true, 'validation' => 'currency', 'format' => 'currency'],



		// 'credit_loan_amount' => ['text' => true, 'validation' => 'currency', 'format' => 'currency', 'hidden' => true],
		'credit_loan_amount' => ['text' => true, 'page' => '5', 'validation' => 'currency', 'format' => 'currency', 'hidden' => true],
		'loan_purpose' => ['list' => Axowl_list_se::loan_purpose, 'validation' => 'list'],
		'social_number' => ['text' => true, 'validation' => 'socialnumber', 'digits' => 11],
		'privateloan' => ['text' => true, 'validation' => 'currency', 'format' => 'currency', 'hidden' => true],
		'creditloan' => ['text' => true, 'validation' => 'currency', 'format' => 'currency', 'hidden' => true],

		'div2' => ['class' => 'em-co-applicant em-lower', 'page' => '4', 'page_class' => 'em-hidden'], 

		'div50' => ['class' => 'em-co-applicant-title', 'html' => '<h4 class="em-co-applicant-h4">Medsökandes personuppgifter</h4>'],
		'/div50' => [],

		'living_together' => ['checkbox' => true, 'yes' => true, 'show' => 'no: em-element-co_applicant_living_conditions'],
		'co_applicant_social_number' => ['text' => true, 'validation' => 'socialnumber', 'digits' => 11],
		
		'co_applicant_mobile_number' => ['text' => true, 'validation' => 'phone', 'digits' => 8],
		'co_applicant_email' => ['text' => true, 'validation' => 'email'],
		'co_applicant_employment_type' => ['list' => Axowl_list_se::employment_type, 'validation' => 'list'],
		'div12' => ['class' => 'em-employ'],
		'co_applicant_employer' => ['text' => true, 'hidden' => true, 'validation' => 'empty'],

		'div13' => [],
		'div8' => ['class' => 'em-date'],
		'co_applicant_employment_since_year' => ['list' => Axowl_list_se::years, 'validation' => 'list', 'hidden' => true],
		'co_applicant_employment_since_month' => ['list' => Axowl_list_se::months, 'validation' => 'list', 'hidden' => true],
		'/div8' => [],
		'div9' => ['class' => 'em-date'],
		'co_applicant_employment_last_year' => ['list' => Axowl_list_se::lastyears, 'validation' => 'list', 'hidden' => true],
		'co_applicant_employment_last_month' => ['list' => Axowl_list_se::months, 'validation' => 'list', 'hidden' => true],
		'/div9' => [],
		'/div13' => [],

		'/div12' => [],
		// 'co_applicant_work_number' => ['text' => true, 'hidden' => true, 'validation' => 'phone', 'type' => 'tel'],
		'co_applicant_monthly_income' => ['text' => true, 'validation' => 'currency', 'format' => 'currency'],
		
		'co_applicant_civilstatus' => ['list' => Axowl_list_se::civilstatus, 'validation' => 'list'],
		
		'co_applicant_living_conditions' => ['list' => Axowl_list_se::living_conditions, 'validation' => 'list', 'hidden' => true],
		'co_applicant_rent' => ['hidden' => true, 'text' => true, 'validation' => 'currency', 'format' => 'currency'],
		'div10' => ['class' => 'em-date em-date-co_applicant_living_conditions'],
		'co_applicant_address_since_year' => ['list' => Axowl_list_se::years, 'validation' => 'list', 'hidden' => true],
		'co_applicant_address_since_month' => ['list' => Axowl_list_se::months, 'validation' => 'list', 'hidden' => true],
		'/div11' => [],


		'/div2' => '',
		// '/div98' => '',
		'/div99' => ''
	];






}