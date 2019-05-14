/**
 * INDEX
 * qs(s) helper function: document.querySelector
 * qsa(s) helper function: document.querySelectorAll
 *
 * var current: current part of form showing
 * var isIE: whether browser is internet explorer or not
 *
 * kroner(v) : converts value to currency
 * numb(v) : converts value to number
 * payment() : updates monthly cost field
 * val{v} : validator
 * v(v) : validator with visual feedback
 * progress() : updates progressbar when fields with validation is filled
 *
 * init() initializes all event listeners
 * 
 */

// VALIDATION AND EVENTS
(function($) {
	var validColor = 'green';
	var invalidColor = 'red';

	var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);

	var mobile = function() { return $(window).width() < 816 }
	var desktop = function() { return $(window).width() > 815 }

	var numb = function(n) { 
		if (!n) return null;
		return parseInt(String(n).replace(/[^0-9]/g, '')); 
	}

	var kroner = function(n) {
		n = numb(n);

		if (n == '' || !n) return '';
		return parseInt(n).toLocaleString(
							// 'sv-SE', 
							'nb-NO', 
							{
								style: 'currency', 
								// currency: 'SEK',
								currency: 'NOK',
								minimumFractionDigits: 0
							});
	}

	var cost = function(i) {
		i = i / 12;

		var p = numb($('.em-i-loan_amount').val());
		var n = numb($('.em-i-tenure').val())*12;

		return Math.floor(p / ((1 - Math.pow(1 + i, -n)) / i))
	}

	var payment = function() {
		try { 
			var p = numb($('.em-i-loan_amount').val());
			var n = numb($('.em-i-tenure').val())*12;

			$('.em-if-monthly_cost').val(kroner(cost(0.068)));
			$('.em-compare-amount').html('kr '+p);

			$('.em-compare-kk').html(cost(0.220));
			$('.em-compare-monthly').html(cost(0.068));
			$('.em-compare-tenure').html(numb($('.em-i-tenure').val()));


			var save = parseInt($('.em-compare-kk').html()) - parseInt(numb($('.em-if-monthly_cost').val()));

			$('.em-compare-save').html('<span>kr </span><span>'+save+'</span>');

		} catch (e) { console.error('Cost calculation: '+e) }
	};

	payment();

	$.fn.extend({
		validate: function() { try { return this[0].val() } catch (e) { } },
		validation: function() { return validation.call(this[0]) }
	});

	var val = {
		list: function() { if (this.value == '') return false; return true },
		
		number: function() { if (/^\d+$/.test(this.value)) return true; return false },
		
		phone: function() {
			if (!this.value) return false;

			var n = this.value.replace(/\D/g, '');
			if (/^\d+$/.test(n) && n.length == 8) return true; 
			return false 
		},
		
		email: function() { if (/.+\@.+\..{2,}/.test(this.value)) return true; return false },
		
		currency: function() { 
			if (!this.value) return false;
			if (/^\d+$/.test(this.value.replace(/[kr\.\s]/g, ''))) return true; return false 
		},
		
		text: function() { if (/^[A-ZØÆÅa-zøæå\s]+$/.test(this.value)) return true; return false },
		
		empty: function() { if (/.+/.test(this.value)) return true; return false },
		
		check: function() { return this.checked },
		
		bankaccount: function() { 
			if (!this.value) return false;

			var n = this.value.replace(/[^0-9]/g, '');
			if (!n) return false;

			if (n.length == 11) {

				var cn = [2,3,4,5,6,7];
				var cnp = -1;
				var ccn = function() {
					cnp++;
					if (cnp == cn.length) cnp = 0;
					return cn[cnp];
				}

				var control = n.toString().split('').pop();

				var c = n.substring(0, n.length-1);

				var sum = 0;
				for (var i = c.length-1; i >= 0; i--)
					sum += c[i] * ccn();


				sum = sum % 11;
				sum = 11 - sum;

				if (sum == control) return true;
			}

			return false;
		},
		
		socialnumber: function() {
			if (!this.value) return false;

			var d = this.value.replace(/[^0-9]/g, '');

			if (d.length == 11) {
				
				// special rule
				if (d == '00000000000') return false;
				var f = d.split('');
			    
			    // first control number
			    var k1 = (11 - (((3 * f[0]) + (7 * f[1]) + (6 * f[2])
			            + (1 * f[3]) + (8 * f[4]) + (9 * f[5]) + (4 * f[6])
			            + (5 * f[7]) + (2 * f[8])) % 11)) % 11;
			    
			    // second control number
			    var k2 = (11 - (((5 * f[0]) + (4 * f[1]) + (3 * f[2])
			            + (2 * f[3]) + (7 * f[4]) + (6 * f[5]) + (5 * f[6])
			            + (4 * f[7]) + (3 * f[8]) + (2 * k1)) % 11)) % 11;
			    
			    if (k1 == 11) k1 = 0;

			    // failed validation
			    if (k1 != f[9] || k2 != f[10]) return false;
			    
			    // success
			    return true;
			}

			return false;
		}
	}

	// formats
	var input = {
		list: function() { validation.call(this) },
		number: function() { this.value = this.value.replace(/[^0-9]/g, '') },
		phone: function() { 
			var v = this.value;
			this.value = v.replace(/[^0-9\s]/g, '');

			var c = v.replace(/\s/g, '');  
			if (c.length == 8) validation.call(this);
			else if (c.length > 8) this.value = v.substring(0, v.length-1); 
		},
		email: function() {},
		currency: function() {},
		text: function() { this.value = this.value.replace(/[^A-ZØÆÅa-zøæå\s]/g, '') },
		notempty: function() {},
		check: function() { if (!this.val()) invalid.call(this); else valid.call(this) },
		bankaccount: function() {
			this.value = this.value
							.replace(/[^\d\.\s]/g, '')
							.replace(/\.{2,}/g, '.')
							.replace(/\s{2,}/g, ' ');
		},
		socialnumber: function() {
			var v = this.value;
			this.value = v.replace(/[^0-9\s]/g, '');

			var c = v.replace(/\s/g, '');  
			if (c.length == 11) validation.call(this);
			else if (c.length > 11) this.value = v.substring(0, v.length-1); 
		}
	}

	var focus = {
		list: function() {

			// this.value = '';
		},
		number: function() { this.value = this.value.replace(/[\D]/g, ''); },
		// phone: function() { this.value = this.value.replace(/[\D]/g, ''); this.select() },
		email: function() {},
		// currency: function() { 
		// 	this.value = parseInt(this.value.replace(/[\D]/g, ''));  
		// 	// $(this).attr('type', 'number');
		// 	// this.value = this.value;
		// 	this.select();
		// },
		text: function() {},
		empty: function() {},
		check: function() {},
		bankaccount: function() {},
		socialnumber: function() {}
	}

	var focusout = {
		list: function() {},
		number: function() { },
		phone: function() {
			// dont do anything of spaces already put in
			if (/\s/.test(this.value)) return;

			// convert to number with spaces
			var v = this.value.replace(/\D/g, '');
			var m = v.match(/^(\d{3})(\d{2})(\d{3})/); 
			if (m) this.value = m[1]+' '+m[2]+' '+m[3];
		},
		email: function() {},
		currency: function() {
			// $(this).attr('type', 'text');
			if (this.value == '') return;
			this.value = numb(this.value)
							.toLocaleString(
								// 'sv-SE', 
								'nb-NO', 
								{
									style: 'currency', 
									// currency: 'SEK',
									currency: 'NOK',
									minimumFractionDigits: 0
							});
		},
		text: function() {},
		empty: function() {},
		check: function() {
		},
		bankaccount: function() {
			var d = this.value.replace(/[\D]/g, '');
			var m = d.match(/^(\d{4})(\d{2})(\d{5})$/);
			if (m) this.value = m[1]+'.'+m[2]+'.'+m[3];
		},
		socialnumber: function() {
			var d = this.value.replace(/[\D]/g, '');
			var m = d.match(/^(\d{6})(\d{5})$/);
			if (m) this.value = m[1]+' '+m[2];
		}
	}

	// validation on focus out
	var validation = function() {
		try {
			// if (this.val == undefined) return true;
			// console.log(this);
			if (this.val == undefined || this.val()) {
				valid.call(this);
				return true;
			}
			invalid.call(this);
			return false;
		} catch (e) {
			console.log(e);
			return true;
		}
	}

	var valid = function() {
		if (this.type == 'checkbox') $(this).siblings('label').css('color', 'inherit');
		else if (!$(this).hasClass('em-i-tenure') && !$(this).hasClass('em-i-loan_amount')) $(this).removeClass('em-invalid-border').addClass('em-valid-border');

		$(this).siblings('.em-error').slideUp(300);
	}

	var invalid = function() { 
		if (this.type == 'checkbox') $(this).siblings('label').css('color', invalidColor);
		else $(this).removeClass('em-valid-border').addClass('em-invalid-border');
		
		$(this).siblings('.em-error').slideDown(300);
	}


	$('.emowl-form input').each(function() {
		$(this).keyup(function(e) {
			if (e.keyCode == 13) $(this).blur();
		});
	});



	/******************************
		ELEMENTS WITH VALIDATION
	 ******************************/
	$('.emowl-form *[data-val]').each(function() { 

		try {
			$(this).focusout(validation);
			$(this).focus(function() { $(this).removeClass('em-valid-border em-invalid-border') });
		} catch (e) { console.error(e) }


		switch ($(this).attr('data-val')) {
			case 'currency': 
				focusout.currency.call(this);
				$(this)[0].val = val.currency;
				$(this).focus(focus.number).focusout(focusout.currency).on('input', input.number); 
				break;
			
			case 'phone':
				$(this)[0].val = val.phone;
				$(this).on('input', input.phone).focusout(focusout.phone);
				break;
			
			case 'email': $(this)[0].val = val.email; break;
			
			case 'number': $(this)[0].val = val.number; break;
			
			case 'text': $(this)[0].val = val.text; break;
			
			case 'socialnumber': 
				$(this)[0].val = val.socialnumber;
				$(this).on('input', input.socialnumber).focus(focus.number).focusout(focusout.socialnumber);
				break;
			
			case 'bankaccount': 
				$(this)[0].val = val.bankaccount;
				$(this).focusout(focusout.bankaccount).on('input', input.bankaccount);
				break;
			
			case 'name': 
				$(this)[0].val = val.name; 
				break;
			
			case 'ar': 
				$(this)[0].val = val.ar;
				break;
			
			case 'list': 
				$(this)[0].val = val.list; 
				// $(this).click(function() { $(this).val('') });
				$(this).on('change', input.list);
				break;
			
			case 'check': 
				$(this)[0].val = val.check;
				$(this).on('input', input.check);
				break;

			case 'empty':
				$(this)[0].val = val.empty;
				break;

			// default: $(this)[0].val = function() { return true; }
		}
	});


	$('#pop-phone')[0].val = val.phone;
	$('#pop-phone').on('input', input.phone).focusout(focusout.phone).focusout(validation);

	$('#pop-email')[0].val = val.email;
	$('#pop-email').on('input', input.email).focusout(focusout.email).focusout(validation);


	/***************************
		MONTHLY COST UPDATING
	 ***************************/

	$('.em-i-loan_amount').on('input', function() { payment() });
	
	if (!isIE)  $('.em-r-loan_amount').on('input', function() { 
					$('.em-i-loan_amount').val(kroner($(this).val()));
					payment();
				});
	
	else 		$('.em-r-loan_amount').on('change', function() { 
					$('.em-i-loan_amount').val(kroner($(this).val()));
					payment();
				});

	$('.em-i-tenure').on('change', function() {
		payment();
	});



	/**************
		BUTTONS
	***************/
	var showNeste = function() {
		$('.em-element-neste').remove();

		$('.em-part-1-grid > .em-hidden, .em-b-container').each(function() {
			$(this).slideDown(600).removeClass('em-hidden');
		});		
	}
	$('.em-b-neste').one('click', showNeste);



	$('.em-b-next').on('click', function() {

		var valid = true;
		$('.em-part-1-grid *[data-val]').each(function() {
			if (!$(this).validation()) valid = false;
		});

		// if (!valid) return;

		location.hash = 'form';

		if ($('.em-check-contact_accept')[0].checked)
			$.post(emurl.ajax_url, {
				action: 'wlinc',
				'contact_accept': $('.em-check-contact_accept').val(),
				'email': $('.em-i-email').val(),
				'mobile_number': $('.em-i-mobile_number').val().replace(/[\D]/g, '')
			}, function(data) {
				console.log(data);
			}); 

		$('.content-post > div:not(.em-form-container)').each(function() {
			$(this).fadeOut();
		});
		$('.emtheme-footer-container').slideUp(100);

		$('.em-b-next, .forside-overskrift, .forside-overtext').slideUp(800);

		if (desktop()) {
			$('.navbar-menu').fadeTo(0, 0);
			$('.em-part-1-grid').slideUp(800, function() {

				$('.content, .main').css('margin-bottom', '0');
				$('.em-form-container').css('margin-bottom', '0');
				$('.emowl-form').css('width', 'auto');
				$('.em-element-loan_amount').css('margin-bottom', '0');
				$('.em-element-mobile_number').detach().prependTo('.em-part-2');
				$('.em-element-email').detach().prependTo('.em-part-2');
				$('.em-b-container').detach().appendTo('.em-part-5').css('margin', '0');


				$('.em-b-endre, .em-b-send, .em-b-text').show();
				$('.em-part-2 .em-part-title').detach().prependTo('.em-part-2');

				$('.em-part-1-grid').addClass('em-part-1-grid-2');
				// $('.em-part-1-grid').css({
				// 	'grid-template-columns': '2fr 1fr 1fr 1fr',
				// 	'grid-template-areas': '"loan tenure refinancing monthly" "compare compare compare compare"',
				// 	'grid-column-gap': '2rem',
				// 	'padding': '4rem 6rem'
				// });

				$('.em-element-tenure, .em-element-collect_debt, .em-element-monthly_cost').css({
					'align-self': 'center',
					'justify-self': 'center',
					'margin': '0'
				});
				
				$('.em-i-tenure, .em-cc-collect_debt, .em-if-monthly_cost').css({
					'width': '15rem'
				});


				$('.em-compare-text').css('font-size', '2rem');

				$('.em-element-axo_accept, .em-element-contact_accept').hide(50, function() {
					$('.em-slidedown').slideDown(800).removeClass('em-hidden');
				});

			});
		
			$('.em-b-endre').click(function() {
				// $('html').animate({'scrollTop': 0}, 1000, 'swing', function() {
					$('.em-part-1-grid').slideToggle();
					$('.em-b-endre').text($('.em-b-endre').text() == 'Endre Lånebeløp' ? 'Skjul Lånebeløp' : 'Endre Lånebeløp');
					window.scrollTo(0, 0);
				// });
			});
		}



		if (mobile()) {
			$('.mobile-icon-container').hide();
			// $('.navbar-menu, .mobile-icon-container').hide();
			$('.em-element-mobile_number').detach().prependTo('.em-part-2');
			$('.em-element-email').detach().prependTo('.em-part-2');
			$('.em-b-container').detach().appendTo('.em-part-5').css('margin', '0');
			$('.em-element-axo_accept, .em-element-contact_accept').hide(0);
			$('.em-slidedown').slideDown(800).removeClass('em-hidden');
			$('.em-part-1-grid').slideUp(800);
			$('.em-b-endre, .em-b-send, .em-b-text').show();

			window.scrollTo(0, 0);
			$('.em-b-endre').click(function() {
				$('html').animate({'scrollTop': 0}, 1000, 'swing', function() {
					$('.em-part-1-grid').slideToggle();
					$('.em-b-endre').text($('.em-b-endre').text() == 'Endre Lånebeløp' ? 'Skjul Lånebeløp' : 'Endre Lånebeløp');
				// window.scrollTo(0, 0);
				});
			});
		}


	});

	$('.em-b-send').on('click', function() {
		var data = {};
		var valid = true;

		console.log($('.emowl-form .em-i:not(button), .emowl-form .em-c').length);

		$('.emowl-form .em-i:not(button), .emowl-form .em-c').each(function() {
			if ($(this).parents('.em-hidden').length != 0) return;
			var value = $(this).val();

			if (!$(this).validation()) valid = false;

			switch ($(this).attr('data-val')) {
				case 'socialnumber':
				case 'bankaccount':
				case 'currency':
				case 'number':
				case 'phone': value = numb(value); break;
			}


			data[$(this).attr('name')] = value;
		});

		data['contact_accept'] = $('.em-check-contact_accept')[0].checked;
		data['axo_accept'] = $('.em-check-axo_accept')[0].checked;

		// if (!valid) return;

		console.log(data);

		$.post(emurl.ajax_url, {
			action: 'axowl',
			data: data
		}, function(d) {

			$('.emowl-form').slideUp(800, function() {
				$('.em-popup-x').one('click', function() { $('.em-popup').slideUp(); })
				$('.em-form-container').css('margin-bottom', '4rem');
				$('.em-popup').slideDown(800, function() {

					$('.content-post > div:not(.em-form-container)').each(function() {
						$(this).fadeIn(2000);
					});

					if (mobile()) $('.mobile-icon-container').show();
					// if (mobile()) $('.navbar-menu, .mobile-icon-container').show();

					if (desktop())  $('.navbar-menu').fadeTo(0, 1);

				});
			});


			console.log(d);
		});
	});

})(jQuery);






















// BEHAVIOUR
(function($) {

	var desktop = function() {
		return $(window).width() > 815;
	}

	var mobile = function() {
		return $(window).width() < 816;
	}

	$.fn.extend({
		down: function() {
			this.slideDown(300);
			this.removeClass('em-hidden');

		},

		up: function() {
			this.slideUp(300);
			this.addClass('em-hidden');
		}
	});


	$('.em-ht-mark').mouseenter(function() {
		if (desktop()) {
			$(this).parent().siblings('.em-ht').fadeIn(300);

			$(this).one('mouseleave', function() {
					var $this = $(this);
					var timer = setTimeout(function() { $this.parent().siblings('.em-ht').fadeOut(300) }, 300);

					$(this).one('mouseenter', function() {
						clearTimeout(timer);
					})

			});
		}
	});

	$('.em-ht-q').click(function() {

		$(this).siblings('.em-ht').slideToggle(300);

	});

	// CHECKBOXES
	$('.emowl-form [data-show]').each(function() {
		var ele = '.'+$(this).attr('data-show').replace(/^no:( |)/, '');

		var $input = $(this);

		var no = $(this).attr('data-show').match(/^no:/) ? true : false;

		var show = function() { $(ele).down() }
		var hide = function() { $(ele).up() }


		$(this).parent().find('.em-cc-yes').click(function() {

			$input.val(1);

			// co_applicant
			if (ele == '.em-part-4') {
				if (desktop()) {
					$('.em-part-lower-container').css('grid-template-areas', '"title title title title" "two three four five"');
					$('.em-part-lower-container').find('.em-part').animate({
						width: '25rem'
					});
					$('.em-part-4').show().removeClass('em-hidden');
				}

				$('.em-element-spouse_income:not(.em-hidden)').each(function() {
					$(this).slideUp(300).addClass('em-hidden');
				});
			}


			else {
				if (!no) show();
				else hide();
			}

			$(this).addClass('em-cc-green');
			$(this).siblings('.em-cc-no').removeClass('em-cc-green');
		});

		$(this).parent().find('.em-cc-no').click(function() {

			$input.val(0);

			// co_applicant
			if (ele == '.em-part-4') {

				if (desktop()) {
					$('.em-part-lower-container').find('.em-part:not(.em-part-4)').animate({
						width: '30rem'
					});

					$('.em-part-4').animate({
						width: '0rem'
					}, function() {
						$(this).hide().addClass('em-hidden');
						$('.em-part-lower-container').css('grid-template-areas', '"title title title" "two three five"');
					});	
				}

				switch ($('.em-i-civilstatus').val()) {
					case 'Gift/partner':
					case 'Samboer':
						$('.em-element-spouse_income').slideDown(300).removeClass('em-hidden'); 
						break;
				}
			}


			else {
				if (no) show();
				else hide();
			}

			$(this).addClass('em-cc-green');
			$(this).siblings('.em-cc-yes').removeClass('em-cc-green');
		});
	});


	// LISTS 
	$('.em-i-education').change(function() {
		switch ($(this).val()) {
			case 'Høysk./universitet 1-3 år':
			case 'Høysk./universitet 4+år': $('.em-element-education_loan').down(); break;
			default: $('.em-element-education_loan').up();			
		}
	});

	$('.em-i-employment_type').change(function() {
		switch ($(this).val()) {
			case 'Fast ansatt (privat)':
			case 'Fast ansatt (offentlig)':
			case 'Midlertidig ansatt/vikar':
			case 'Selvst. næringsdrivende':
			case 'Langtidssykemeldt': 
				$('.em-element-employment_since, .em-element-employer').down(); break;

			default: $('.em-element-employment_since, .em-element-employer').up();
		}
	});

	$('.em-i-civilstatus').change(function() {
		switch ($(this).val()) {
			case 'Gift/partner':
			case 'Samboer':
				if ($('.em-c-co_applicant').val() == 0)
					$('.em-element-spouse_income').down(); break;
			
			default: $('.em-element-spouse_income').up();
		}
	});

	$('.em-i-living_conditions').change(function() {
		switch ($(this).val()) {
			case 'Leier':
			case 'Bor hos foreldre':
				$('.em-element-rent').down();
				$('.em-element-rent_income, .em-element-mortgage').up();
				break;

			case 'Akjse/andel/borettslag':
			case 'Selveier': 
				$('.em-element-rent, .em-element-rent_income, .em-element-mortgage').down();
				break;

			case 'Enebolig':
				$('.em-element-rent_income, .em-element-mortgage').down();
				$('.em-element-rent').up();
				break;

			default:
				$('.em-element-rent, .em-element-rent_income, .em-element-mortgage').up();
		}
	});

	$('.em-i-number_of_children').change(function() {
		if ($(this).val() > 0) $('.em-element-allimony_per_month').down();
		else $('.em-element-allimony_per_month').up() ;
	});


	$('.em-i-total_unsecured_debt').on('input', function() {
		if ($(this).val()) $('.em-element-total_unsecured_debt_balance').down();
		else $('.em-element-total_unsecured_debt_balance').up();
	});


})(jQuery);





/***********
	POPUP
 **********/

(function($) {


	var showPopup = function(e) {

		// not all things on top of body is in body
		// so do nothing if pointer has not left the window
		if (e.clientX > 100 && e.clientY > 100) return;

		$('body').off('mouseleave', showPopup);

		$('.email-popup, .em-glass').fadeIn(1000);

		$('.em-pop-email-x').one('click', function() {
			$('.email-popup, .em-glass').fadeOut(500);
		});

		var click = function() {
			var valid = true;
			if (!$('#pop-phone').validation()) valid = false;
			if (!$('#pop-email').validation()) valid = false;
			if (!valid) return;
			
			var decodedCookie = decodeURIComponent(document.cookie);
			var cookies = decodedCookie.split(';');
			var ga = null;

			for (var i in cookies){
				var c = cookies[i].trim();
				if (/^_ga=/.test(c)) {
					ga = c.replace(/^_ga=/, '');
					break;
				}
			}

			$('.pop-neste').off('click', click);
			$('.email-popup, .em-glass').fadeOut(500);

			$.post(emurl.ajax_url, 
				{
					action: 'popup',
					'ga': ga,
					'ab-name': $('#abtesting-name').val(),
					'ab-sc': $('#abtesting-sc').val(),
					'pop-email': $('#pop-email').val(),
					'pop-phone': $('#pop-phone').val()
				}, 
				function(data) {
					console.log(data);
				}
			);
		}
		$('.pop-neste').on('click', click);

		// cookie
		var date = new Date();
		date.setTime(date.getTime() + (20*24*60*60*1000));
		document.cookie = 'em_popup=done; expires='+date.toUTCString();
	}


	// Check cookies first
	if (!/(^| )em_popup=/.test(document.cookie))  
		$('body').on('mouseleave', showPopup);

})(jQuery);


/*****************
	BACK BUTTON
 *****************/
(function($) {
	var hash = '';
	$(window).on('hashchange', function() {
		if (location.hash == '' && hash == '#form') location.reload();

		hash = location.hash;
	});
})(jQuery);










// back button
// popup
// mobile











































































































(function($) {
	return;

	"use strict";

	/**
	 * helper function for getting element and adding validation 
	 * @param  {String} e class, id or name
	 * @param  {String} v validation function
	 * @return {HTML element}   html element
	 */
	var qs = function(e) { 
		// get element
		var t = document.querySelector(e);

		// if element not found
		if (!t) return null;

		return t;
	}

	// qs('.em-i-tenure').val();

	// qs('.em-i-loan_amount').testfunc();
	var qsa = function(e) {
		var t = document.querySelectorAll(e);

		if (!t) return [];

		return t;
	}

	// true if mobile width
	var mob = function() {
		if ($(window).width() < 816) return true;
		return false;
	}

	// true if desktop width
	var desktop = function() {
		if ($(window).width() > 815) return true;
		return false;
	}

	var isHidden = function(n) {
		try {

			var p = n.parentNode.parentNode;

			if (p.classList.contains('em-hidden')) return true;

			if (p.parentNode.classList.contains('em-hidden')) return true;

		} catch (e) { console.error(e); return false; }


		return false;
	}

	var current = qs('.em-part');

	var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);

	var kroner = function(n) {
		if (!n) return '';

		n = String(n).replace(/[^0-9]/g, '');

		if (n == '' || !n) return '';

		return parseInt(n).toLocaleString(
							// 'sv-SE', 
							'nb-NO', 
							{
								style: 'currency', 
								// currency: 'SEK',
								currency: 'NOK',
								minimumFractionDigits: 0
							});
	}

	var numb = function(n) { return n.replace(/[^0-9]/g, '') }

	var cost = function(i) {
		i = i / 12;


		var p = numb(qs('.em-i-loan_amount').value);
		var n = numb(qs('.em-i-tenure').value)*12;
		// return Math.floor(p * i);
		return Math.floor(p / ((1 - Math.pow(1 + i, -n)) / i))
	}

	var payment = function() {
		// calculate(7.9);
		// calculate(21.83);
		try { 
			var p = numb(qs('.em-i-loan_amount').value);
			var n = numb(qs('.em-i-tenure').value)*12;


			$('.em-if-monthly_cost').val(kroner(cost(0.068)));
			$('.em-compare-amount').html('kr '+p);

			$('.em-compare-kk').html(cost(0.220));
			$('.em-compare-monthly').html(cost(0.068));
			$('.em-compare-tenure').html(numb($('.em-i-tenure').val()));


			var save = parseInt($('.em-compare-kk').html()) - parseInt(numb($('.em-if-monthly_cost').val()));
			// console.log(cost(0.22)+' ### '+cost(0.068));
			// console.log(cost(0.068));

			$('.em-compare-save').html('<span>kr </span><span>'+save+'</span>');

		} catch (e) { console.error('Cost calculation: '+e) }
	};

	// function calculate(i) {
	// 	var p = 300000;
	// 	var interest = i / 100 / 12;

	// 	var payments = 15 * 12;

	// 	console.log(Math.round(p * interest));
	// }


// 	function calculate2(i) {
//     // Get the user's input from the form. Assume it is all valid.
//     // Convert interest from a percentage to a decimal, and convert from
//     // an annual rate to a monthly rate. Convert payment period in years
//     // to the number of monthly payments.
//     // var principal = numb($('.em-i-loan_amount').val());
//     var principal = 300000;
//     var interest = i / 100 / 12;
//     // var payments = numb($('.em-i-tenure').val()) * 12;
//     var payments = 5 * 12;


//     // principal = parseInt(principal) + 950;

//     // Now compute the monthly payment figure, using esoteric math.
//     var x = Math.pow(1 + interest, payments);
//     var monthly = (principal*x*interest)/(x-1);

//     // Check that the result is a finite number. If so, display the results.
//     if (!isNaN(monthly) && 
//         (monthly != Number.POSITIVE_INFINITY) &&
//         (monthly != Number.NEGATIVE_INFINITY)) {
//     	console.log(round(monthly));
//         // document.loandata.payment.value = round(monthly);
//         // document.loandata.total.value = round(monthly * payments);
//         // document.loandata.totalinterest.value = round((monthly * payments) - principal);
//     }
//     // Otherwise, the user's input was probably invalid, so don't
//     // display anything.
//     // else {
//     //     document.loandata.payment.value = "";
//     //     document.loandata.total.value = "";
//     //     document.loandata.totalinterest.value = "";
//     // }
// }

// This simple method rounds a number to two decimal places.
function round(x) {
  return Math.round(x*100)/100;
}

	var val = {
		numbersOnly: function(d) {
			if (/^\d+$/.test(d)) return true;
			return false
		},

		textOnly: function(d) { return true	},

		list: function(d) {
			if (!d) return false;
			return true;
		},

		phone: function(d) {
			var n = val.numbersOnly(d);
			if (!n) return false;
			if (d.length == 8) return true;
			return false;
		},

		socialnumber: function(d) {
			var n = val.numbersOnly(d);

			if (!n) return false;

			if (d.length == 11) {
				
				// special rule
				if (d == '00000000000') return false;

				var f = d.split('');
			    
			    // first control number
			    var k1 = (11 - (((3 * f[0]) + (7 * f[1]) + (6 * f[2])
			            + (1 * f[3]) + (8 * f[4]) + (9 * f[5]) + (4 * f[6])
			            + (5 * f[7]) + (2 * f[8])) % 11)) % 11;
			    
			    // second control number
			    var k2 = (11 - (((5 * f[0]) + (4 * f[1]) + (3 * f[2])
			            + (2 * f[3]) + (7 * f[4]) + (6 * f[5]) + (5 * f[6])
			            + (4 * f[7]) + (3 * f[8]) + (2 * k1)) % 11)) % 11;
			    
			    if (k1 == 11) k1 = 0;

			    // failed validation
			    if (k1 != f[9] || k2 != f[10]) return false;
			    
			    // success
			    return true;
			}

			return false;
		},

		email: function(d) { return /.+@.+\..{2,}/.test(d) },

		name: function(d) { return true },

		currency: function(d) {
			d = d.replace(/\s/g, '');
			d = d.replace(/kr/, '');

			return val.numbersOnly(d);
		},

		ar: function(d) {
			d = d.replace(/\s/g, '');
			d = d.replace(/år/, '');

			return val.numbersOnly(d);
		},

		notEmpty: function(d) {
			if (d.length > 0) return true;
			return false;
		},

		check: function(d) { return d },

		bankAccount: function(d) {
			var n = val.numbersOnly(d);
			if (!n) return false;

			if (d.length == 11) {

				var cn = [2,3,4,5,6,7];
				var cnp = -1;
				var ccn = function() {
					cnp++;
					if (cnp == cn.length) cnp = 0;
					return cn[cnp];
				}

				var control = d.toString().split('').pop();

				var c = d.substring(0, d.length-1);

				var sum = 0;
				for (var i = c.length-1; i >= 0; i--)
					sum += c[i] * ccn();


				sum = sum % 11;
				sum = 11 - sum;

				if (sum == control) return true;
			}

			return false;
		}
	}

	var v = function(e, format, valid) {
		try { 
			var data = e.value;
			var pa = e.parentNode;

			// removing postfix
			if (format && format.indexOf('postfix:') -1) {
				var temp = format.replace('postfix:', '');

				data = e.value.replace(temp, '');
			}

			if (e.getAttribute('type') == 'checkbox')
				data = e.checked;

			// validating
			if (!val[valid](data)) {
				if (e.type == 'checkbox') e.nextSibling.nextSibling.style.color = 'hsl(0, 100%, 70%)';
				else {

					e.style.border = "solid 3px hsl(0, 70%, 60%)";
					var errEl = pa.querySelector('.em-error'); 
					if (errEl) errEl.classList.remove('em-hidden');
				}

				return false;
			} 
			
			else { 
				if (e.type == 'checkbox') e.nextSibling.nextSibling.style.color = 'hsl(0, 0%, 0%)';
				else {
					e.style.border = "solid 3px hsl(120, 70%, 30%)";
					
					var errEl = pa.querySelector('.em-error'); 
					if (errEl) errEl.classList.add('em-hidden');
				}
				return true;
			}
		}

		catch (e) { console.error('Error during validation: '+e) }
	}



	var progress = function() {
		var li = qsa('.em-i:not(button)');

		var t = 0;
		var c = 0;

		for (var i = 0; i < li.length; i++) {
			var n = li[i];
			if (n.parentNode.parentNode.classList.contains('em-hidden')) continue;
			if (n.parentNode.parentNode.parentNode.classList.contains('em-hidden')) continue;

			var a = n.getAttribute('data-val');


			if (!a) continue;

			t++;
			try {

				var value = n.value;

				if (n.getAttribute('type') == 'checkbox') value = n.checked;
				
				if (val[a](value)) c++;
			} catch (e) { console.error(e) }	
		}

		var p = qs('.em-progress');

		p.value = (c/t) * 100 ;

		try {
			qs('.em-progress-text').innerHTML = parseInt(p.value) + '%';
		} catch (e) { }
	}


	var incomplete = function(e) {
		console.log('incomplete stopped');
		return;

		e.target.removeEventListener('click', incomplete);

		var xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200)
				console.log(this.responseText);
		}

		var query = '';

		try {
			var email = qs('.em-i-email').value;
			var mobileNumber = qs('.em-i-mobile_number').value;
			var contactAccept = qs('.em-check-contact_accept').checked;
			
		 	if (!email && !mobileNumber) return;

		 	if (email) query += '&email='+email;
		 	if (mobileNumber) query += '&mobile_number='+mobileNumber;
		 	if (contactAccept) query += '&contact_accept='+contactAccept;

		 	var cookie = document.cookie.split('; ');
			for (var i in cookie) {
				if (cookie[i].indexOf('=') == -1) continue;

				var temp = cookie[i].split('=');
				if (temp[0] == '_ga') query += '&ga='+temp[1];
			}

		} catch (e) {}


		// sending to server
		xhttp.open('POST', emurl.ajax_url, true);
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send('action=wlinc'+query);
	}


	var abtesting = function() {
		var data = '';

		var ab = qs('#abtesting-name');
		if (ab) ab = ab.value;
		if (ab) data += '&abname='+ab;

		var abid = qs('#abtesting-sc');
		if (abid) abid = abid.value;
		if (abid) data += '&abid='+abid;
	
		return data;
	}

	var setCookie = function() {
		var ab = qs('#abtesting-name'); // name from wp settings
		if (ab) ab = ab.value;

		var abid = qs('#abtesting-sc'); // shortcode #
		if (abid) abid = abid.value;


		var date = new Date();
		date.setTime(date.getTime() + (90*24*60*60*1000));
		date = date.toUTCString();

		if (ab) document.cookie = 'abname='+ab+'; expires='+date;
		if (abid) document.cookie = 'abid='+abid+'; expires='+date;
	}

	// AB2
	var showFirstPagePart = function(e) {
		try {
			
			$('.em-element-neste').hide(0);

			var el = ['.em-element-tenure', '.em-element-email', '.em-element-mobile_number',
					  '.em-element-collect_debt', '.em-b-container', '.em-element-axo_accept',
					  '.em-element-contact_accept'];

			$(el).each(function() {
				$(this).fadeIn('slow');
			});				 

	        // for (var i in el) {
	        // 	var ele = qs(el[i]);

	        // 	ele.classList.remove('em-hidden');
	        // 	ele.classList.add('em-animate-show');
	        // }

	        // console.log('h');
			if (window.innerWidth > 1000) qs('.em-i-tenure').focus();

			// progress();

		} catch (e) { console.error(e) }
	}

	qs('.em-b-neste').addEventListener('click', showFirstPagePart);

	var init = function() {

		// TEXT INPUTS
		var textInput = qsa('.emowl-form input[type=text]');
		for (var i = 0; i < textInput.length; i++) (function() { // scoping for events
			var n = textInput[i];
			var format = n.getAttribute('data-format') ? n.getAttribute('data-format') : '';
			var min = n.getAttribute('min') ? parseInt(n.getAttribute('min')) : '';
			var max = n.getAttribute('max') ? parseInt(n.getAttribute('max')) : '';
			var valid = n.getAttribute('data-val') ? n.getAttribute('data-val') : '';
			var digits = n.getAttribute('data-digits') ? parseInt(n.getAttribute('data-digits')) : '';
			var show = n.getAttribute('data-show') ? n.getAttribute('data-show') : '';

			// hitting enter
			n.addEventListener('keypress', function(e) { if (e.keyCode == 13) e.target.blur() });

			// if input has a max attribute
			if (max) n.addEventListener('input', function(e) {
				if (max < numb(e.target.value)) e.target.value = max;
			});

			// if input has max digits 
			if (digits) n.addEventListener('input', function(e) {
				if (e.target.value.length > digits) e.target.value = e.target.value.slice(0, -1)
			});

			// if input has a min attribute
			if (min) n.addEventListener('focusout', function(e) {
				if (min > numb(e.target.value)) {
					// formating currency or not
					if (format == 'currency') 	e.target.value = kroner(min);
					else 						e.target.value = min;
				}
			});

			// formating currency
			if (format == 'currency') {
				// initial load
				n.value = kroner(n.value);

				// on focus - remove all but numbers
				n.addEventListener('focus', function(e) { e.target.value = numb(e.target.value) });

				// on focus out - convert number to currency
				n.addEventListener('focusout', function(e) { e.target.value = kroner(e.target.value) });
			}

			// inputs that is limited to numbers typed in
			switch (valid) {
				case 'currency':
				case 'numbersOnly':
				case 'phone':
				case 'ar':
				case 'bankAccount':
				case 'socialnumber': n.addEventListener('input', function(e) { e.target.value = numb(e.target.value) });
			}

			// formatting with postfix
			if (format.indexOf('postfix:') != -1) {
				// getting actual postfix value
				var pf = format.replace('postfix:', '');

				// initial load
				n.value = n.value.replace(/[^0-9]/g, '') + pf;

				// on focus - remove all but numbers
				n.addEventListener('focusout', function(e) { e.target.value = numb(e.target.value) + pf });

				// on focus out - convert number to value with postfix
				n.addEventListener('focus', function(e) { e.target.value = numb(e.target.value )});
			}

			// selecting all text when focusing input
			n.addEventListener('focus', function(e) { 
				e.target.select();
			});

			// if parent has range input
			var innerRange = n.parentNode.parentNode.querySelectorAll('input[type=range]');
			for (var j = 0; j < innerRange.length; j++) (function() {
				var r = innerRange[j];
				n.addEventListener('input', function(e) { r.value = numb(e.target.value) });
			})();

			// VALIDATION
			if (valid) {
				n.addEventListener('focusout', function(e) { v(e.target, format, valid) });
			}

			if (show) {
				n.addEventListener('input', function(e) {

					try {
						if (!e.target.value || e.target.value == 0) qs('.em-element-'+show).classList.add('em-hidden');
						else qs('.em-element-'+show).classList.remove('em-hidden'); 	

					} catch (e) { console.error(e) }
				});
			}

			// SPECIAL RULES
			switch (n.classList[1]) {
				case 'em-i-loan_amount': 
					n.addEventListener('input', function(e) { payment() });
					n.addEventListener('focusout', function(e) { payment() });
					break;

			}
		})();
		

		// RANGE INPUTS
		var rangeInput = qsa('.emowl-form input[type=range]');
		for (var i = 0; i < rangeInput.length; i++) (function() { 
			var r = rangeInput[i];

			// if range belongs to a text input
			var innerText = r.parentNode.querySelectorAll('input[type=text]');

			for (var j = 0; j < innerText.length; j++) (function() {
				var n = innerText[j];

				// fun for function -- changing text input value based on range input
				var fun = function(e) {
					var a = n.getAttribute('data-format');

					if (a == 'currency') 					n.value = kroner(e.target.value);
					else if (a.indexOf('postfix:') != -1) 	n.value = e.target.value+a.replace('postfix:', '');
					else 									n.value = e.target.value;
				}

				if (isIE) r.addEventListener('change', fun);
				else r.addEventListener('input', fun);
			})();
			
			var fun = function(e) { payment(); }

			switch (r.classList[1]) {
				case 'em-r-tenure':
				case 'em-r-loan_amount': 
					if (isIE) r.addEventListener('change', fun);
					else r.addEventListener('input', fun);

				break;
			}
		})();
		


		// CHECKBOX INPUTS

		$('.em-cc:not(.em-cc-co_applicant)').each(function() {

			var show = $(this).children('.em-c').attr('data-show');

			if (show == undefined) return;

			var yes = true;

			if (/no:/.test(show)) yes = false;

			show = show.replace(/no:( |)/, '');			


			var s = function(d) { $(d).slideDown('slow') }
			var h = function(d) { $(d).slideUp('slow') }
			var tno = function(d) { 
				$(d).children('.em-cc-no').addClass('em-cc-green');
				$(d).children('.em-cc-yes').removeClass('em-cc-green');
			}

			var tyes = function(d) { 
				$(d).children('.em-cc-yes').addClass('em-cc-green');
				$(d).children('.em-cc-no').removeClass('em-cc-green');
			}

			if (yes) {
				$(this).find('.em-cc-yes').click(function() { s('.'+show); tyes($(this).parent()) });
				$(this).find('.em-cc-no').click(function() { h('.'+show); tno($(this).parent()) });
			}
			else {
				$(this).find('.em-cc-no').click(function() { s('.'+show); tno($(this).parent()) });
				$(this).find('.em-cc-yes').click(function() { h('.'+show); tyes($(this).parent()) });
			}

		});

		$('.em-cc-co_applicant').each(function() {
			var show = $(this).children('.em-c').attr('data-show');

			if (show == undefined) return;

			var yes = true;

			if (/no:/.test(show)) yes = false;

			show = show.replace(/no:( |)/, '');

			$(this).find('.em-cc-yes').click(function() {

				$('.em-part-lower-container').css('grid-template-areas', '"title title title title" "two three four five"');

				$('.em-part-lower-container').find('.em-part').animate({
					width: '25rem'
				});
				$('.em-part-4').show();

				$(this).addClass('em-cc-green');
				$('.em-cc-co_applicant').find('.em-cc-no').removeClass('em-cc-green');			
			});



			$(this).find('.em-cc-no').click(function() {
				$('.em-part-lower-container').find('.em-part:not(.em-part-4)').animate({
					width: '30rem'
				});

				$('.em-part-4').animate({
					width: '0rem'
				}, function() {
					$(this).hide();
					$('.em-part-lower-container').css('grid-template-areas', '"title title title" "two three five"');

				});				

				$(this).addClass('em-cc-green');
				$('.em-cc-co_applicant').find('.em-cc-yes').removeClass('em-cc-green');			

			});

		});


		// CHECK INPUTS
		var checkInput = qsa('.em-check');
		for (var i = 0; i < checkInput.length; i++) (function() {
			var n = checkInput[i];

			if (!n.getAttribute('data-val')) return;
			n.addEventListener('change', function(e) {
				v(e.target, null, e.target.getAttribute('data-val'));
			});

		})();

		// LIST INPUTS
		var lists = qsa('.emowl-form select');
		for (var i = 0; i < lists.length; i++) (function() {
			var n = lists[i];
			var val = n.getAttribute('data-val');

			if (val) n.addEventListener('input', function(e) { v(e.target, null, val) });

			// showing html element
			var show = function(o) {
				try {
					for (var i = 0; i < o.length; i++) 
						jQuery(o[i]).slideDown(500, function(e) {
							this.classList.remove('em-hidden');
						});
					
				} catch (e) {}
			}

			// hiding html element
			var hide = function(o) {
				try {
					for (var i = 0; i < o.length; i++) 
						jQuery(o[i]).slideUp(500, function(e) {
							this.classList.add('em-hidden');
						});
					
				} catch (e) {}
			}

			// SPECIAL RULES
			switch (n.classList[1]) {

				case 'em-i-tenure':
					n.addEventListener('change', function(e) {
						payment();
					});
					break;
				// EDUCATION
				case 'em-i-education':
					n.addEventListener('change', function(e) {
						switch (e.target.value) {
							case 'Høysk./universitet 1-3 år':
							case 'Høysk./universitet 4+år': show(['.em-element-education_loan']); break;
							default: hide(['.em-element-education_loan']);
						}
					});
					break;

				// EMPLOYMENT TYPE
				case 'em-i-employment_type':
					n.addEventListener('change', function(e) {
						switch (e.target.value) {
							case 'Fast ansatt (privat)':
							case 'Fast ansatt (offentlig)':
							case 'Midlertidig ansatt/vikar':
							case 'Selvst. næringsdrivende':
							case 'Langtidssykemeldt': show(['.em-element-employment_since', '.em-element-employer']); break;
							default: hide(['.em-element-employment_since', '.em-element-employer']);
						}
					});
					break;

				// CIVIL STATUS
				case 'em-i-civilstatus':
					n.addEventListener('change', function(e) {
						switch (e.target.value) {
							case 'Gift/partner':
							case 'Samboer':
								try {
									if (qs('.em-c-co_applicant').value === '0') show(['.em-element-spouse_income']);
									else hide(['.em-element-spouse_income']);
								} catch (e) {}
								break;

							default: hide(['.em-element-spouse_income']);
						}
					});
					break;

				// LIVING CONDITIONS
				case 'em-i-living_conditions':
					n.addEventListener('change', function(e) {
						switch (e.target.value) {
							case 'Leier':
							case 'Bor hos foreldre': show(['.em-element-rent']); hide(['.em-element-rent_income', '.em-element-mortgage']); break;
							
							case 'Aksje/andel/borettslag':
							case 'Selveier': show(['.em-element-rent', '.em-element-rent_income', '.em-element-mortgage']); break;

							case 'Enebolig': show(['.em-element-rent_income', '.em-element-mortgage']); hide(['.em-element-rent']); break;

							default: hide(['.em-element-rent', '.em-element-rent_income', '.em-element-mortgage']);
						}
					});
					break;

				// NUMBER OF CHILDREN
				case 'em-i-number_of_children':
					n.addEventListener('change', function(e) {
						if (e.target.value && e.target.value != '0') show(['.em-element-allimony_per_month']);
						else hide(['.em-element-allimony_per_month']);
					});
					break;

				// CO APPLICANT: EMPLOYMENT TYPE
				case 'em-i-co_applicant_employment_type':
					n.addEventListener('change', function(e) {
						switch (e.target.value) {
							case 'Fast ansatt (privat)':
							case 'Fast ansatt (offentlig)':
							case 'Midlertidig ansatt/vikar':
							case 'Selvst. næringsdrivende':
							case 'Langtidssykemeldt': show(['.em-element-co_applicant_employment_since', '.em-element-co_applicant_employer']); break;
							default: hide(['.em-element-co_applicant_employment_since', '.em-element-co_applicant_employer']);
						}
					});
					break;
			} // end of switch

		})();
		




		// NEXT/PREV/SUBMIT BUTTONS
		try {
			qs('.em-b-next').addEventListener('click', function(e) {

				// VALIDATION OF CURRENT PART

				var valid = true;
				$('.em-part-1-grid .em-i:not(button)').each(function() { 

					if ($(this).attr('data-val') == undefined) return;

					console.log($(this)[0]);
					console.log($(this).attr('data-val'));

					// console.log(v($(this)[0], null, $(this).attr('data-val')));

				});


				// var test = current.querySelectorAll('.em-i');

				// for (var i = 0; i < test.length; i++) (function() {
				// 	var n = test[i];

				// 	var p = n.parentNode.parentNode;

				// 	if (p.classList.contains('em-hidden')) return;

				// 	if (p.parentNode.classList.contains('em-hidden')) return;

				// 	if (n.getAttribute('data-val')) {
				// 		var val = n.getAttribute('data-val');
				// 		var f = n.getAttribute('format');
				// 		var ver = v(n, null, val);

				// 		if (!ver) success = false;
				// 	}
				// })();

				// exit ramp
				// if (!success) return;

				$('body').off('mouseleave', showPopup);


				// $('.emtheme-footer-container, .navbar-menu').fadeOut(100);

				$('.emtheme-footer-container').slideUp(100);
				$('.navbar-menu, .mobile-icon-container').hide();

				$('.em-b-next, .forside-overskrift, .forside-overtext').slideUp(800);
				$('.em-part-1-grid').slideUp(800, function() {

					$('.emowl-form').css('width', 'auto');
					$('.em-element-loan_amount').css('margin-bottom', '0');
					$('.em-element-mobile_number').detach().prependTo('.em-part-2');
					$('.em-element-email').detach().prependTo('.em-part-2');
					$('.em-b-container').detach().appendTo('.em-part-5').css('margin', '0');

					$('.em-b-endre, .em-b-send, .em-b-text').show();
					$('.em-part-2 .em-part-title').detach().prependTo('.em-part-2');

					$('.em-part-1-grid').css({
						'grid-template-columns': '2fr 1fr 1fr 1fr',
						'grid-template-areas': '"loan tenure refinancing monthly" "compare compare compare compare"',
						'grid-column-gap': '2rem',
						'padding': '4rem 6rem'
					});

					$('.em-element-tenure, .em-element-collect_debt, .em-element-monthly_cost').css({
						'align-self': 'center',
						'justify-self': 'center',
						'margin': '0'
					});
					
					$('.em-i-tenure, .em-cc-collect_debt, .em-if-monthly_cost').css({
						'width': '15rem'
					});

					// $('.em-i-tenure, .em-c')



					$('.em-compare-text').css('font-size', '2rem');

					$('.em-element-axo_accept, .em-element-contact_accept').hide(50, function() {
						jQuery('.em-slidedown').slideDown(800);

					});

				});


				$('.em-b-endre').click(function() {
					$('.em-part-1-grid').slideToggle();
					$('.em-b-endre').text($('.em-b-endre').text() == 'Endre Lånebeløp' ? 'Skjul Lånebeløp' : 'Endre Lånebeløp');
				});



				qs('.em-form-container').style.borderBottom = 'none';


				var eles = qsa('.content-post > div:not(.em-form-container)');

				for (var i = 0; i < eles.length; i++)
					jQuery(eles[i]).fadeOut('fast');

				window.location.hash = 'form';

			});

			qs('.em-b-next').addEventListener('click', incomplete);

		} catch (e) {}



		// SUBMIT BUTTON
		try {
			var post = function() {

				var data = '';

				var valid = true;

				var inputs = qsa('.emowl-form input.em-i, .emowl-form .em-c, .emowl-form select.em-i');

				for (var i = 0; i < inputs.length; i++) {
					var n = inputs[i];

					if (isHidden(n)) continue;

					if (n.getAttribute('data-val')) {
						var val = n.getAttribute('data-val');
						var f = n.getAttribute('format');
						var ver = v(n, null, val);

						if (!ver) valid = false;
					}

					var value = n.value;
					// turning numeric values into numbers
					switch (n.getAttribute('data-val')) {
						case 'numbersOnly':
						case 'phone':
						case 'currency':
						case 'ar': value = numb(n.value); break;
					}

					// adding to query string
					data += '&data['+n.name+']='+value;
				}


				if (!valid) return;

				var cookie = document.cookie.split('; ');
				for (var i in cookie) {
					if (cookie[i].indexOf('=') == -1) continue;

					var temp = cookie[i].split('=');
					if (temp[0] == '_ga') data += '&data[ga]='+temp[1];
				}


				data += abtesting();

				qs('.em-b-send').removeEventListener('click', post);

				var close = function(e) { $('.em-popup').slideUp(1000) }

				qs('.em-popup-x').addEventListener('click', close);

				qs('.em-b-send').innerHTML = 'Søknad sendes ...';

				var xhttp = new XMLHttpRequest();

				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {

						try {
							$('.emowl-form').slideUp(800, function() {
								$('.em-popup').slideDown(800, function() {

									$('.content-post > div:not(.em-form-container)').each(function() {
										$(this).fadeIn(2000);
									});

									$('.navbar-menu, .emtheme-footer-container').show();

								});
							});
						} catch (e) { console.error(e) }

						console.log(this.responseText);
					}
				}


				// sending to server
				xhttp.open('POST', emurl.ajax_url, true);
				xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhttp.send('action=axowl'+data);

			}

			qs('.em-b-send').addEventListener('click', post);

		} catch (e) { console.error(e) }


		// helper text
		// var hm = qsa('.em-ht-mark');
		// for (var i = 0; i < hm.length; i++) 
		// 	(function() { 
		// 		var q = hm[i];
		// 		var p = $(q).parent().parent().find('.em-ht');


		// 		// if (desktop()) {
		// 			$(q).mouseenter(function() {
		// 				if (desktop()) $(p).fadeIn(100);
		// 			});

		// 			$(q).mouseleave(function() {
		// 				if (desktop()) $(p).fadeOut(200);
		// 			});
		// 		// }

		// 		$(q).on('click', function(e) {
		// 			// console.log(e);
		// 			// if (e.which == 13)
		// 			$(p).toggle();
		// 		});

			
		// 	})();
		

		var inputs = qsa('input.em-i:not(.em-check)');
		var selects = qsa('select.em-i, input.em-check');

	



	} // end of init




	window.addEventListener('hashchange', function() {

		if (window.location.hash == '') {
			$('.content-post > *:not(.em-form-container), .navbar-menu, .emtheme-footer-container').each(function() {
				$(this).fadeIn('fast');
			});
			$('.em-part-1-grid').slideDown();
			$('.em-b-endre').text($('.em-b-endre').text() == 'Endre Lånebeløp' ? 'Skjul Lånebeløp' : 'Endre Lånebeløp');
		}
	});

	if (window.location.hash == '#form') { showFirstPagePart() }

	setCookie();
	init();
	payment();

	var showPopup = function(e) {

		// not all things on top of body is in body
		// so do nothing if pointer has not left the window
		if (e.clientX > 100 && e.clientY > 100) return;

		$('body').off('mouseleave', showPopup);

		$('.email-popup, .em-glass').fadeIn(1000);

		$('.em-pop-email-x').one('click', function() {
			$('.email-popup, .em-glass').fadeOut(500);
		});

		var click = function() {

			var phone = $('#pop-phone').val();
			var email = $('#pop-email').val();

			var valid = true;

			if (!/\d{8}/.test(phone)) {
				$('#pop-phone').css('border-color', 'hsl(0, 80%, 60%');
				valid = false;
			}

			if (!/.+\@.+\..{2,3}/.test(email)) {
				$('#pop-email').css('border-color', 'hsl(0, 80%, 60%');
				valid = false;
			}

			if (!valid) {
				$('.pop-neste').one('click', click);
				return;
			}

			$('.email-popup, .em-glass').fadeOut(500);

			$.post(emurl.ajax_url, 
				{
					action: 'popup',
					'pop-email': $('#pop-email').val(),
					'pop-phone': $('#pop-phone').val()
				}, 
			
				function(data) {
					console.log(data);
				}
			);
		}
		$('.pop-neste').one('click', click);

		$('#pop-phone').on('input', function() {
	  		$(this).val($(this).val().substring(0, 8).replace(/[^0-9]/g, ''));
		});

		$('#pop-phone, #pop-email').focus(function(e) {
			e.target.style.borderColor = '#000';
		})
	
		// cookie
		var date = new Date();
		date.setTime(date.getTime() + (60*24*60*60*1000));
		document.cookie = 'em_popup=tester; expires='+date.toUTCString();
	}


	// Check cookies first
	if (!/(^| )em_popup=/.test(document.cookie))  
		$('body').on('mouseleave', showPopup);
		

})(jQuery);