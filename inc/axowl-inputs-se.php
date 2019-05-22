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
		'monthly_cost' => ['text_field' => 'Månedskostnad fra', 'notInput' => true],
		'loan_amount' => ['text' => true, 'range' => true, 'validation' => 'currency', 
						  'format' => 'currency', 'max' => 500000, 'min' => 10000, 'default' => 250000, 'step' => 10000],
		'tenure' => ['list' => Axowl_list_se::tenure, 'validation' => 'list', 'empty' => false, 'start' => 5, 'key_as_value' => true, 'hidden' => true],
		'collect_compare' => ['compare' => true],
		'collect_debt' => ['checkbox' => true, 'no' => true, 'hidden' => true, 'show' => 'em-element-collect_compare'],
		'mobile_number' => ['text' => true, 'type' => 'tel', 'validation' => 'phone', 'digits' => 8, 'hidden' => true],
		'email' => ['text' => true, 'type' => 'email', 'validation' => 'email', 'hidden' => true],
		'axo_accept' => ['check' => true, 'validation' => 'check', 'hidden' => true],
		'contact_accepted' => ['check' => true, 'hidden' => true],
		'neste' => ['button' => true, 'button_text' => 'Neste'],
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
		'privatloan' => ['text' => true, 'validation' => 'currency', 'format' => 'currency', 'hidden' => true],
		'creditloan' => ['text' => true, 'validation' => 'currency', 'format' => 'currency', 'hidden' => true],

		'/div98' => '',
		'/div99' => ''
	];



	// public static $inputs2 = [
	// 	'div0' => ['class' => 'em-part-1-grid'],
	// 	'monthly_cost' => ['text_field' => 'Månedskostnad fra', 'notInput' => true],
	// 	'loan_amount' => ['text' => true, 'range' => true, 'validation' => 'currency', 
	// 					  'format' => 'currency', 'max' => 500000, 'min' => 10000, 'default' => 250000, 'step' => 10000],
	// 	'tenure' => ['list' => Axowl_list::tenure, 'validation' => 'list', 'empty' => false, 'start' => 5, 'key_as_value' => true, 'hidden' => true],
	// 	'collect_compare' => ['compare' => true],
	// 	'collect_debt' => ['checkbox' => true, 'no' => true, 'hidden' => true, 'show' => 'em-element-collect_compare'],
	// 	'mobile_number' => ['text' => true, 'type' => 'tel', 'validation' => 'phone', 'digits' => 8, 'hidden' => true],
	// 	'email' => ['text' => true, 'type' => 'email', 'validation' => 'email', 'hidden' => true],
	// 	'axo_accept' => ['check' => true, 'validation' => 'check', 'hidden' => true],
	// 	'contact_accept' => ['check' => true, 'hidden' => true],
	// 	'neste' => ['button' => true, 'button_text' => 'Neste'],
	// 	'/div0' => '',
		
	// 	'/div55' => [],


	// 	'div98' => ['class' => 'em-slidedown em-hidden'],
	// 	'div99' => ['class' => 'em-part-lower-container'],
	// 	'div100' => ['class' => 'em-lower-titles'],
	// 	// '/div100' => [],
	// 	'social_number' => ['text' => true, 'page' => '2', 'validation' => 'socialnumber', 'digits' => 11],
	// 	'employment_type' => ['list' => Axowl_list::employment_type, 'validation' => 'list'],
	// 	'employment_since' => ['hidden' => true, 'list' => Axowl_list::years, 'validation' => 'list'],
	// 	'employer' => ['text' => true, 'hidden' => true, 'validation' => 'empty'],
	// 	'education' => ['list' => Axowl_list::education, 'validation' => 'list'],

	// 	'education_loan' => ['hidden' => true, 'text' => true, 'validation' => 'currency', 'format' => 'currency'],

	// 	'norwegian' => ['checkbox' => true, 'yes' => true, 'show' => 'no: em-norwegian'],

	// 	'div' => ['class' => 'em-norwegian em-lower', 'hidden' => true], 
	// 	'years_in_norway' => ['key_as_value' => true, 'list' => Axowl_list::years_in_norway, 'validation' => 'list'],
	// 	'country_of_origin' => ['key_as_value' => true, 'list' => Axowl_list::country_of_origin, 'validation' => 'list'],
	// 	'/div' => '',

	// 	'income' => ['text' => true, 'validation' => 'currency', 'format' => 'currency'],

	// 	'co_applicant' => ['checkbox' => true, 'page' => '3', 'no' => true, 'show' => 'em-part-4'],
	// 	'civilstatus' => ['list' => Axowl_list::civilstatus, 'validation' => 'list'],
	// 	'spouse_income' => ['hidden' => true, 'text' => true, 'validation' => 'currency', 'format' => 'currency'],
	// 	'living_conditions' => ['list' => Axowl_list::living_conditions, 'validation' => 'list'],
	// 	'rent_income' => ['hidden' => true, 'text' => true, 'validation' => 'currency', 'format' => 'currency'],
	// 	'mortgage' => ['hidden' => true, 'text' => true, 'validation' => 'currency', 'format' => 'currency'],
	// 	'rent' => ['hidden' => true, 'text' => true, 'validation' => 'currency', 'format' => 'currency'],
	// 	'address_since' => ['list' => Axowl_list::years, 'validation' => 'list'],
	// 	'car_boat_mc_loan' => ['text' => true, 'validation' => 'currency', 'format' => 'currency'],
	// 	'number_of_children' => ['key_as_value' => true, 'list' => Axowl_list::number_of_children, 'validation' => 'list'],
	// 	'allimony_per_month' => ['text' => true, 'hidden' => true, 'validation' => 'currency', 'format' => 'currency'],

	// 	'div2' => ['class' => 'em-co-applicant em-lower', 'page' => '4', 'page_class' => 'em-hidden'], 
	// 	'co_applicant_name' => ['text' => true, 'validation' => 'empty'],
	// 	'co_applicant_social_number' => ['text' => true, 'validation' => 'socialnumber', 'digits' => 11],
	// 	'co_applicant_mobile_number' => ['text' => true, 'validation' => 'phone', 'digits' => 8],
	// 	'co_applicant_email' => ['text' => true, 'validation' => 'email'],
	// 	'co_applicant_employment_type' => ['list' => Axowl_list::employment_type, 'validation' => 'list'],
	// 	'co_applicant_employment_since' => ['list' => Axowl_list::years, 'validation' => 'list', 'hidden' => true],
	// 	'co_applicant_employer' => ['text' => true, 'hidden' => true, 'validation' => 'empty'],
	// 	'co_applicant_education' => ['list' => Axowl_list::education, 'validation' => 'list'],
	// 	'co_applicant_norwegian' => ['checkbox' => true, 'yes' => true, 'show' => 'no:em-co-applicant-norwegian'],

	// 	'div3' => ['class' => 'em-co-applicant-norwegian em-lower', 'hidden' => true],
	// 	'co_applicant_years_in_norway' => ['list' => Axowl_list::years_in_norway, 'validation' => 'list'],
	// 	'co_applicant_country_of_origin' => ['key_as_value' => true, 'list' => Axowl_list::country_of_origin, 'validation' => 'list'],
	// 	'/div3' => '',

	// 	'co_applicant_income' => ['text' => true, 'validation' => 'currency', 'format' => 'currency'],
	// 	'/div2' => '',

	// 	'total_unsecured_debt' => ['text' => true, 'page' => '5', 'validation' => 'currency', 'format' => 'currency', 'show' => 'unsecured_debt_balance'],
	// 	'unsecured_debt_balance' => ['text' => true, 'hidden' => true, 'validation' => 'currency', 'format' => 'currency'],
	// 	// 'total_unsecured_debt_balance' => ['text' => true, 'hidden' => true, 'validation' => 'currency', 'format' => 'currency'],
	// 	// 'unsecured_debt_balance[]' => ['text' => true, 'validation' => 'currency'],
	// 	'account_number' => ['text' => true, 'validation' => 'bankaccount', 'digits' => '11'],
	// 	'/div98' => '',
	// 	// '/div98' => '',
	// 	'/div99' => ''
	// ];



}