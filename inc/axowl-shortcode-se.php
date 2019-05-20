<?php 

defined('ABSPATH') or die('Blank Space');


require_once 'axowl-shortcode-parts-se.php';
require_once 'axowl-inputs-se.php';

final class Axowl_shortcode_se {
	/* singleton */
	private static $instance = null;

	private static $parts;

	public static function get_instance() {
		if (self::$instance === null) self::$instance = new self();

		return self::$instance;
	}

	private function __construct() {
		self::$parts = Axowl_shortcode_parts_se::get_instance(); 		

		$this->hooks();
	}

	/**
	 * [hooks description]
	 */
	private function hooks() {
		add_shortcode('axowl-se', [$this, 'shortcode']);

		add_shortcode('axowl-delete-se', [$this, 'delete']);
	}


	/**
	 * for AB testing
	 * @param  [type] $atts    [description]
	 * @param  [type] $content [description]
	 * @return [type]          [description]
	 */
	public function shortcode($atts, $content = null) {

		if (!isset($atts[0])) return $this->shortcode_1($atts, $content);

		switch ($atts[0]) {
			case '1': return $this->shortcode_1($atts, $content); break;
			// case '2': return $this->shortcode_2($atts, $content); break;
		}
	}
	/**
	 * [shortcode description]
	 * @param  [type] $atts    [description]
	 * @param  [type] $content [description]
	 * @return [type]          [description]
	 */
	public function shortcode_1($atts, $content = null) {

		add_action('wp_enqueue_scripts', [$this, 'sands']);
		add_filter('google_link', [$this, 'fonts']);

		// if (!is_user_logged_in()) 
			// if (get_transient('axowl_se_sc1')) return get_transient('axowl_se_sc1');

		// shortcode-parts.php
		$p = self::$parts;
		global $post;


		$data = get_option('em_axowl_se');
		if (!is_array($data)) $data = [];
		$data = $this->sanitize($data);
		$inputs = AXOWL_inputs_se::$inputs;

		$lock = '<div class="em-lock" title="Kryptert og sikker kommunikasjon"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24"><g fill="none"><path d="M0 0h24v24H0V0z"/><path opacity=".87" d="M0 0h24v24H0V0z"/></g><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg></div>';
		$lock = '';

		$epop = '<div class="em-glass"></div>
				 <div class="email-popup"><div class="email-popup-grid">

				 	<h2 class="pop-title">VIL DU FYLLE UT SØKNADSSKJEMA SENERE?</h2>

				 	<div class="pop-input-container pop-phone-container">
					 	<label for="pop-phone" class="pop-label-phone">Telefon</label>
					 	<input type="text" class="em-i em-pop-phone" name="pop-phone" id="pop-phone">
				 	</div>

				 	<div class="pop-input-container pop-email-container">
					 	<label for="pop-email" class="pop-label-email">E-Post</label>
					 	<input type="text" class="em-i em-pop-email" name="pop-email" id="pop-email">
					</div>
				 	
				 	<button type="button" class="em-b pop-neste">Neste</button>

				 	<div class="pop-text">'.(isset($data['popup_text']) ? $data['popup_text'] : '').'</div>

				 	</div><buttton type="button" class="em-pop-email-x"><img class="em-close" src="'.EM_AXOWL_SE_PLUGIN_URL.'assets/img/close.png"></buttton>
				 </div>';

		$html = sprintf(
			'<div class="em-form-container" style="opacity: 0;%s">%s%s<form class="emowl-form">%s',
			
			isset($atts['style']) ? $atts['style'] : '',
			$p->popup(),
			$epop,
			$lock
		);

		$html .= '<input type="hidden" name="fax">';

		$html .= '<div class="em-part-container">';

		$html .= $p->page_top(1);
		
		foreach($inputs as $key => $value) {
			if (is_array($value)) $value['help'] = true;
			// if new page
			if (isset($value['page'])) $html .= '</div>'.$p->page_top($value['page'], (isset($value['page_class']) ? $value['page_class'] : null));
			
			// page content
			$html .= $p->element($key, $value, $data);
		}
			
		// ends last page and ends part container
		$html .= '</div></div>';

		$html .= '<div class="em-b-container">
			<button type="button" class="em-b em-b-next">Neste</button>
			<button type="button" class="em-b em-b-endre">Endre Lånebeløp</button>
			<button type="button" class="em-b em-b-send">Send Søknad</button>
			<div class="em-b-text">Du mottar et helt uforpliktende tilbud som er gyldig i 30 dager.</div>
			</div>';

		$html .= '<div class="em-loan-example">Nominell rente fra 6,39% til 21,95%. Effektiv rente fra 6,81% til 24,4%. Eff. rente 13,2%, 150.000 o/10 år, kostnad: 112.573, Totalt: 262573.</div></form></div>';

		$html .= '<input type="hidden" id="abtesting-sc" value="1">';
		$html .= '<input type="hidden" id="abtesting-name" value="'.$post->post_name.'">';

		// TODO set transient
		// if (!is_user_logged_in()) 
			// set_transient('axowl_se_sc1', $html);
			// 
		return $html;
	}







	public function delete($atts, $content = null) {
		add_action('wp_enqueue_scripts', [$this, 'sands_delete']);

		return '<div class="axodel-container">
				<div class="axodel-form">
					<h2>Slett meg</h2>
					<p>Skriv inn epost eller telefonnummer og din personelig informasjon vil bli slettet fra Norsk Finans.</p>
					<input class="axodel-input" name="axodel">
					<button class="axodel-send" type="button">Send inn</button>
				</div>
				<div class="axodel-message">
				    <h2>Informasjonen er slettet</h2>
					Din personelig informasjon (<span class="axodel-info"></span> m.m.) har nå bli slettet og du vil ikke få flere meldinger fra Norsk Finans.
					<br>Dette er ikke en bekreftelse på at <span class="axodel-info"></span> fantes, men at hvis den eksisterte i vår database så er den nå slettet.
				</div>
			</div>
			<script>
				(function($) {
					var click = function() {

						var val = $(".axodel-input").val();

						if (!val) return;

						if (!/^\d{8}$/.test(val) && !/^.+@.+\..{2,}/.test(val)) {
							alert("Ugyldig input, må være et telefonnummer eller epost addresse.");
							return;
						}
						$.post(emurl.ajax_url, {
							action: "del",
							data: $(".axodel-input").val()
							}, function(data) {

								console.log(data);
								if (data != "success") {
									alert("Feil i maskineriet. Prøv igjen seinere eller kontakt oss på epost.");
									return;
								}

								$(".axodel-send").off("click", click);

								$(".axodel-info").html($(".axodel-input").val());

								$(".axodel-form").fadeOut(200, function() {
									$(".axodel-message").fadeIn(200);
								});

							}
						);

					}

					$(".axodel-send").on("click", click);

					$(".axodel-input").keypress(function(e) {

						if (e.keyCode == 13) click();

						//console.log(e.keyCode);
					});

					var css = "<style>.axodel-container { margin: 4rem 0; } .axodel-input { font-size: 1.6rem; padding: .5rem; min-width: 30rem; border: solid 2px #333; } .axodel-send { display: block; margin: 2rem 0; border: none; outline: none; background-color: #fc6; font-size: 1.6rem; padding: .6rem; border: solid 2px #333; } .axodel-message { display: none; }  @media only screen and (max-width: 949px) { }</style>";
					// var css = "<style>@media only screen and (min-width: 950px) { .axodel-container { margin: 4rem 0; } .axodel-input { font-size: 1.6rem; padding: .5rem; min-width: 30rem; border: solid 2px #333; } .axodel-send { display: block; margin: 2rem 0; border: none; outline: none; background-color: #fc6; font-size: 1.6rem; padding: .6rem; border: solid 2px #333; } .axodel-message { display: none; } } @media only screen and (max-width: 949px) { }</style>";

					$("head").append(css);

				})(jQuery);
			</script>
			';
	
	}


	public function sands_delete() {

        wp_enqueue_script('jquery');
        wp_enqueue_script('axodel-se', EM_AXOWL_SE_PLUGIN_URL.'assets/js/pub/axodel.js', [], '0.0.1');
		wp_localize_script('axodel-se', 'emurl', ['ajax_url' => admin_url( 'admin-ajax.php')]);
	}










	/**
	 * [sanitize description]
	 * @param  [type] $data [description]
	 * @return [type]       [description]
	 */
	public static function sanitize($data) {
		if (!is_array($data)) return sanitize_text_field($data);

		$d = [];
		foreach($data as $key => $value)
			$d[$key] = Axowl_settings_se::sanitize($value);

		return $d;
	}

	public function sands() {
        wp_enqueue_style('jqslid', '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css', false);
        wp_enqueue_style('emaxowl-se-style', EM_AXOWL_SE_PLUGIN_URL.'assets/css/pub/emaxo-se.css', array(), '0.0.1', '(min-width: 901px)');
        wp_enqueue_style('emaxowl-se-mobile', EM_AXOWL_SE_PLUGIN_URL.'assets/css/pub/emaxo-mobile-se.css', array(), '0.0.1', '(max-width: 900px)');
        
        wp_enqueue_script('jquery-touch');

        wp_enqueue_script('emaxowl-se', EM_AXOWL_SE_PLUGIN_URL.'assets/js/pub/emaxo-se.js', [], '0.0.1', true);
		
		wp_localize_script( 'emaxowl-se', 'emurl', ['ajax_url' => admin_url( 'admin-ajax.php')]);
	}


	public function fonts($data) {
		return $data[] = ['Merriweather' => [400, 900], 'Montserrat' => [300, 400, 700]];
	}

}