/**
 * INDEX
 * 
 */


var sendGa = function(label, value = 0) {

	// sending ga via gtm
	try {
		var action = $('#abtesting-post').val() ? $('#abtesting-post').val() : 'na';
		if ("ga" in window) {
		    tracker = ga.getAll()[0];
		    if (tracker) tracker.send('event', 'axo form', action, label, value);
		}
	}
	catch (e) { console.log('ga failed') }
};

// VALIDATION AND EVENTS
(function($) {
	var validColor = 'green';
	var invalidColor = 'red';

	var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);

	var mobile = function() { return $(window).width() < 901 }
	var desktop = function() { return $(window).width() > 900 }

	var numb = function(n) { 
		if (!n) return null;
		return parseInt(String(n).replace(/[^0-9,.]/g, '')); 
	}

	var kroner = function(n) {
		n = numb(n);

		if (n === 0) return '0 kr';
		if (n == '' || !n) return '';

		return String(n).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")+' kr';
	}

	var cost = function(i) {
		i = i / 12;

		var p = numb($('.em-i-loan_amount').val()) + 950;
		var n = numb($('.em-i-tenure').val())*12;

		if (i == 0.22)
			n = 12;

		return Math.round(p / ((1 - Math.pow(1 + i, -n)) / i)) + 30;
	}

	var creditcardinterest = 0.22;
    var monthlyRate = creditcardinterest / 12;
    var minPay = 250;
    var cardPay = 0.03;
    var cardFee = 30;

	var payment = function() {
		try { 
			var p = numb($('.em-i-loan_amount').val());
			var n = numb($('.em-i-tenure').val())*12;

			// credit card payment simulation
			var carddebt = p;
		    var interest = Math.round(carddebt * monthlyRate);
		    var saldo = Math.round(carddebt + interest);
		    var payment = Math.round(Math.min(Math.max(minPay, saldo * cardPay), saldo) + cardFee);
		    var minsaldo = Math.round(saldo - payment + cardFee);
		    
		    var add = interest;
	        
	        var i = 1;
	        var paymentaverage = payment;
	        while(saldo > 0){
	            interest = Math.round(minsaldo * monthlyRate);
	            saldo = Math.round(minsaldo + interest);
	            payment = Math.round(Math.min(Math.max(minPay, saldo * cardPay), saldo) + cardFee);
	            minsaldo = Math.round(saldo - payment + cardFee);
	            add += interest;
	            if(i < 12){
	                paymentaverage += payment;
	            }
	            i++;
	        }
	        
	        paymentaverage = Math.floor(paymentaverage / 12);

			$('.em-if-monthly_cost').val(kroner(cost(0.079)));
			$('.em-compare-amount').html(kroner(p));

			$('.em-compare-kk').html(paymentaverage);
			$('.em-compare-monthly').html(kroner(cost(0.079)));
			$('.em-compare-tenure').html(numb($('.em-i-tenure').val()));


			// var save = parseInt($('.em-compare-kk').html()) - parseInt(numb($('.em-if-monthly_cost').val()));
			var save = paymentaverage - parseInt(numb($('.em-if-monthly_cost').val()));

			$('.em-compare-save').html(kroner(save));


		} catch (e) { console.error('Cost calculation: '+e) }
	};

	payment();

	$.fn.extend({
		validate: function() { try { return this[0].val() } catch (e) { return true } },
		validation: function() { try { return validation.call(this[0]) } catch (e) { } }
	});

	var val = {
		list: function() { return /.+/.test(this.value) },
		
		number: function() { return /^\d+$/.test(this.value) },
		
		phone: function() { return /^07\d{8}$/.test(this.value.replace(/\s/g, '')) },
		
		email: function() { return /.+\@.+\..{2,}/.test(this.value) },
		
		currency: function() { return /^\d+$/.test(this.value.replace(/[kr\.\s]/g, '')) },
		
		text: function() { return /^[A-ZÅÄÖa-zåäö\s]+$/.test(this.value) },
		
		empty: function() { return /.+/.test(this.value) },
		
		check: function() { return this.checked },
		
		socialnumber: function() {

			var v = this.value.replace(/\D/g, '');

			if (!(/10|12/.test(v.length))) return false;

			if (v.length == 12) v = v.substring(2);

			var c = [2, 1, 2, 1, 2, 1, 2, 1, 2];
			v = v.split('');

			var add = function(n) {
				if (n < 10) return n;

				var b = String(n).split('');

				var c = 0;
				for (var i in b)
					c += parseInt(b[i]);

				return c;
			}

			var t = 0;
			for (var i in c) {
				var n = c[i] * parseInt(v[i]);

				t += parseInt(add(n));
			}

			var x = 10 - (t % 10);
			var y = v.slice(-1);

			if (x == y) return true;

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
			if (c.length == 10) validation.call(this);
			else if (c.length > 10) this.value = v.substring(0, v.length-1); 
		},

		email: function() {},

		currency: function() {},

		text: function() { this.value = this.value.replace(/[^A-ZØÆÅa-zøæå\s]/g, '') },

		notempty: function() {},

		check: function() { if (!this.val()) invalid.call(this); else valid.call(this) },

		// bankaccount: function() {
		// 	this.value = this.value
		// 					.replace(/[^\d\.\s]/g, '')
		// 					.replace(/\.{2,}/g, '.')
		// 					.replace(/\s{2,}/g, ' ');

		// 	var c = this.value.replace(/[\s\. ]/g, '');
		// 	if (c.length == 11) validation.call(this);
		// 	else if (c.length > 11) this.value = this.value.substring(0, this.value.length-1); 
		// },

		socialnumber: function() {
			var v = this.value;
			var c = v.replace(/\D/g, '');

			// var p = v.replace(/-/, '%FD%');

			// p = p.replace(/\D|(%FD%)/g, '').replace('%FD%', '-');
			function removeDup(string, regex) {
			  var count = 0
			  var replaceWith = ''
			  return string.replace(regex, function (match) {
			    count++
			    if (count === 1) {
			      return match
			    } else {
			      return replaceWith
			    }
			  })
			}


			this.value = v.replace(/[^0-9-+]/g, '');
			this.value = removeDup(this.value, /-|\+/g);

			if (!/^(\d{6})|(\d{8})(-|\+)?\d*$/.test(this.value)) this.value = this.value.replace(/\D/g, '');
			// if (/^\d{7}|\d{9}(-|\+)?.+/.test(this.value)) this.value = this.value.replace(/\D/g, '');

			if (c.length > 12) this.value = v.substring(0, v.length-1); 

			// if valid length, then check number
			var c = v.replace(/\D/g, '');  
			if (/10|12/.test(c.length)) validation.call(this);
		}
	}

	var focus = {
		list: function() {},
		number: function() { this.value = this.value.replace(/[\D]/g, ''); },
		email: function() {},
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
			// dont do anything if spaces already put in
			if (/\s/.test(this.value)) return;

			// convert to number with spaces
			var v = this.value.replace(/\D/g, '');
			this.value = v.replace(/(\d)(?=(\d{2})+(?!\d))/g, '$1 ');
			// this.value = v.replace(/^(\d{3})+$/, '$1 ');
			// var m = v.match(/^(\d{3})(\d{2})(\d{3})/); 
			// if (m) this.value = m[1]+' '+m[2]+' '+m[3];
		},
		email: function() {},
		currency: function() {
			if (this.value == '') return;
			this.value = kroner(this.value);
		},
		text: function() {},
		empty: function() {},
		check: function() {
		},
		bankaccount: function() {
			var d = this.value.replace(/[\D]/g, '');
			var m = d.match(/^(\d{4})(\d{2})(\d{5})$/);
			if (m) this.value = m[1]+' '+m[2]+' '+m[3];
		},
		socialnumber: function() {

			var d = this.value.replace(/\D/, '');

			if (d.length == 12) this.value = d.replace(/(\d{8})(\d{4})/, '$1-$2');
			else if (d.length == 10) this.value = d.replace(/(\d{6})(\d{4})/, '$1-$2');

			// var d = this.value.replace(/[\D]/g, '');
			// var m = d.match(/^(\d{6})(\d{5})$/);
			// if (m) this.value = m[1]+' '+m[2];
		}
	}

	// validation on focus out
	var validation = function() {
		try {
			// validation not required or validation = true
			if (this.val == undefined || this.val()) {
				valid.call(this);
				return true;
			}
			invalid.call(this);
			return false;
		} catch (e) {
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

			// $(this).focus(function() {

			// 	var c = $(this)[0].className;

			// 	if (/tenure/.test(c)) return;

			// 	var m = /em-i-.*?(?: |$)/.exec($(this)[0].className);

			// 	if (!m || !m[0]) return;

			// 	c = m[0].replace(/em-i-/, '');

			// 	$.post(emurl.ajax_url, {
			// 		action: 'gdoc_se',
			// 		type: 'focus',
			// 		name: c
			// 	}, function(data) {
			// 		// console.log(data);
			// 	}); 
			// });

			// $(this).focusout(function() {

			// 	var c = $(this)[0].className;

			// 	if (/tenure/.test(c)) return;

			// 	var m = /em-i-.*?(?: |$)/.exec($(this)[0].className);

			// 	if (!m || !m[0]) return;

			// 	c = m[0].replace(/em-i-/, '');

			// 	$.post(emurl.ajax_url, {
			// 		action: 'gdoc_se',
			// 		type: 'unfocus',
			// 		name: c
			// 	}, function(data) {
			// 		// console.log(data);
			// 	}); 
			// });


			// var validlive = function() {
			// 	if ($(this).validate()) $(this).off('focusout', validlive);
			// 	else return;

			// 	var c = $(this)[0].className;

			// 	if (/tenure/.test(c)) return;

			// 	var m = /em-i-.*?(?: |$)/.exec($(this)[0].className);

			// 	if (!m || !m[0]) return;

			// 	c = m[0].replace(/em-i-/, '');

			// 	$.post(emurl.ajax_url, {
			// 		action: 'gdoc_se',
			// 		type: 'valid',
			// 		name: c
			// 	}, function(data) {
			// 		// console.log(data);
			// 	}); 
			// }

			// $(this).on('focusout', validlive);


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
				$(this).on('input', input.socialnumber).focusout(focusout.socialnumber);
				// $(this).on('input', input.socialnumber).focus(focus.socialnumber).focusout(focusout.socialnumber);
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
				$(this).on('change', input.list);
				break;
			
			case 'check': 
				$(this)[0].val = val.check;
				$(this).on('input', input.check);
				break;

			case 'empty':
				$(this)[0].val = val.empty;
				break;
		}
	});


	$('.em-i-income').focusout(function() {
		if (numb($(this).val()) < 200000) {

			if (!$('.em-income-alert')[0]) {
				$(this).parent().append('<div class="em-income-alert">Viktig! Sjekk at du har skrevet riktig brutto årslønn.<button type="button" class="em-income-button">OK</button></div>');
				$('.em-income-button').one('click touch', function() {
					$(this).parent().slideUp(300, function() {
						$(this).remove();
					})
				});
			}
		}
	});

	$('#pop-phone')[0].val = val.phone;
	$('#pop-phone').on('input', input.phone).focusout(focusout.phone).focusout(validation);

	$('#pop-email')[0].val = val.email;
	$('#pop-email').on('input', input.email).focusout(focusout.email).focusout(validation);


	/***************************
		MONTHLY COST UPDATING
	 ***************************/

	$('.em-slider-loan_amount').slider({
		value: 250000,
		range: 'min',
		max: parseInt($('.em-slider-loan_amount').attr('data-max')),
		min: parseInt($('.em-slider-loan_amount').attr('data-min')),
		step: parseInt($('.em-slider-loan_amount').attr('data-step')),
		slide: function(event, ui) { 
			$('.em-i-loan_amount').val(kroner(ui.value));
			payment(); 
		},
		animate: true
	});

	$('.em-i-loan_amount').on('input', function() {
		$('.em-slider-loan_amount').slider('value', numb($(this).val()));

		var val = numb($(this).val());
		var max = numb($(this).attr('data-max'));	
		if (max < val) $(this).val(kroner(max));

		payment();
	});


	$('.em-i-loan_amount').focusout(function() {
		var val = numb($(this).val());
		var min = numb($(this).attr('data-min'));

		if (min > val) $(this).val(kroner(min));
	});

	$('.em-i-tenure').change(function() {
		payment();
	});




	/**************
		BUTTONS
	***************/


	var unload = function(e) {
		e.preventDefault();
		e.returnValue = '';

		// for gdcos live view
		$(':focus').blur();
	}

	// FIRST NESTE
	var showNeste = function() {
		$('.em-element-neste').remove();

		$('.em-part-1-grid > .em-hidden, .em-b-container').each(function() {
			$(this).slideDown(600, function() {
				$('.em-i-tenure').focus();
			}).removeClass('em-hidden');
		});

		window.addEventListener('beforeunload', unload);

		sendGa('neste', 0);

	}
	$('.em-b-neste').one('click', showNeste);



	// SECOND NESTE
	$('.em-b-next').on('click', function() {

		var valid = true;
		$('.em-part-1-grid *[data-val]').each(function() {
			if (!$(this).validation()) valid = false;
		});

		// if (!valid) return;

		location.hash = 'form';
		$.post(emurl.ajax_url, {
			action: 'wlinc_se',
			'contact_accept': $('.em-check-contact_accept')[0].checked ? '1' : '0',
			'email': $('.em-i-email').val(),
			'mobile_number': $('.em-i-mobile_number').val().replace(/[\D]/g, '')
		}, function(data) {
			console.log(data);
		}); 
		
		// sendGa('incomplete', 0);


		$('.content-post > div:not(.em-form-container)').each(function() {
			$(this).fadeOut();
		});

		$('.emtheme-footer-container').slideUp(100);

		$('.em-b-next, .forside-overskrift, .forside-overtext').slideUp(800);

		if ($('.mobile-icon-container')[0]) $('.mobile-icon-container').hide();
		else $('.navbar-menu').fadeTo(0, 0);

		if (desktop()) {
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

				$('.em-element-tenure, .em-element-collect_debt, .em-element-monthly_cost').css({
					'margin': '0',
					'top': '.3rem'
				});
				
				$('.em-i-tenure, .em-cc-collect_debt, .em-if-monthly_cost').css({
					'width': '15rem'
				});

				$('.em-lc-tenure').addClass('em-lc-lower');


				$('.em-compare-text').css('font-size', '2rem');

				$('.em-element-axo_accept, .em-element-contact_accept').hide(50, function() {
					$('.em-slidedown').slideDown(800, function() {
						if (!$('.em-i-social_number').is(':focus')) $('.em-i-social_number').focus();
					}).removeClass('em-hidden');
				});

			});
		
			$('.em-b-endre').click(function() {
					$('.em-part-1-grid').slideToggle();
					$('.em-b-endre').text($('.em-b-endre').text() == 'Endre Lånebeløp' ? 'Skjul Lånebeløp' : 'Endre Lånebeløp');
					window.scrollTo(0, 0);
			});
		}



		if (mobile()) {
			$('.em-element-mobile_number').detach().prependTo('.em-part-2');
			$('.em-element-email').detach().prependTo('.em-part-2');
			$('.em-part-2 .em-part-title').detach().prependTo('.em-part-2');
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
				});
			});
		}


	});



	// SEND BUTTON
	$('.em-b-send').on('click', function() {
		var data = {};
		var valid = true;

		var clid = function() {
			var match = /(?:gclid=|msclkid=)(.*?)(?:&|$)/.exec(location.search);
			if (match) return match[1];

			match = /(?:^|;| )(?:clid=)(.*?)(?:;|$)/.exec(document.cookie);
			if (match) return match[1];

			return false;
		};

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

		if (!valid) return;
		
		data['contact_accept'] = $('.em-check-contact_accept')[0].checked ? '1' : '0';
		data['axo_accept'] = $('.em-check-axo_accept')[0].checked;

		data['clid'] = clid();

		$(this).off('click');
		$(this).html('Søknad Sendes ...');

		$.post(emurl.ajax_url, {
			action: 'axowl_se',
			data: data
		}, function(d) {

			if (d === 'Validation Error') {
				alert('Teknisk Feil - last inn siden på nytt og prøv igjen eller kontakt oss på epost.');
				return;
			}

			if (d === 'Technical Error') {
				alert('Teknisk Feil - Feil hos Axo Finans. Prøv igjen seinere eller kontakt oss på epost.');
				return;				
			}

			if (d === '1') sendGa('accepted', 1200);

			if (d === '0') sendGa('rejected', 0);

			$('.emowl-form').slideUp(800, function() {
				$('.em-popup-x').one('click', function() { $('.em-popup').slideUp(); })
				$('.em-form-container').css('margin-bottom', '4rem');
				$('.em-popup').slideDown(800, function() {

					$('.content-post > div:not(.top-container), .em-icons-container').each(function() {
						$(this).fadeIn(500);
					});

					if ($('.mobile-icon-container')[0]) $('.mobile-icon-container').show();
					else $('.navbar-menu').fadeTo(0, 1);
				});
			});

			window.removeEventListener('beforeunload', unload);
		});
	});

})(jQuery);


// BEHAVIOUR
(function($) {

	var desktop = function() {
		return $(window).width() > 900;
	}

	var mobile = function() {
		return $(window).width() < 901;
	}

	$.fn.extend({
		down: function() {
			this.slideDown(300, function() {
				$(this).removeClass('em-hidden');
			});

		},

		up: function() {
			this.slideUp(300, function() {
				$(this).addClass('em-hidden');
			});
		}
	});


	var htClick = function() {
		$(this).siblings('.em-ht').slideToggle(300);
	}

	$('.em-ht-mark').mouseenter(function() {
		if (desktop() && !$('.mobile-icon-container')[0]) {
			$(this).parent().off('click', htClick);
			$(this).parent().siblings('.em-ht').fadeIn(300);

			$(this).one('mouseleave', function() {
					$(this).parent().click(htClick);
					var $this = $(this);
					var timer = setTimeout(function() { $this.parent().siblings('.em-ht').fadeOut(300) }, 300);

					$(this).one('mouseenter', function() {
						clearTimeout(timer);
					})

			});
		}
	});


	$('.em-ht-q').click(htClick);

	// CHECKBOXES
	$('.emowl-form [data-show]').each(function() {
		var ele = '.'+$(this).attr('data-show').replace(/^no:( |)/, '');

		var $input = $(this);

		var no = $(this).attr('data-show').match(/^no:/) ? true : false;

		var show = function() { $(ele).down() }
		var hide = function() { $(ele).up() }


		$(this).parent().find('.em-cc-yes').click(function() {

			$input.val(1);
			$(this).addClass('em-cc-green');
			$(this).siblings('.em-cc-no').removeClass('em-cc-green');
			// co_applicant
			if (ele == '.em-part-4') {
				if (desktop()) {
					$('.em-part-lower-container').css('grid-template-areas', '"title title title title" "two three four five"');
					$('.em-part-lower-container').find('.em-part').animate({
						width: '20rem'
						// width: '25rem'
					});
					$('.em-part-4').show().removeClass('em-hidden');
				}
				else show();

			}


			else {
				if (!no) show();
				else hide();
			}
		});

		$(this).parent().find('.em-cc-no').click(function() {

			$input.val(0);
			$(this).addClass('em-cc-green');
			$(this).siblings('.em-cc-yes').removeClass('em-cc-green');

			// co_applicant
			if (ele == '.em-part-4') {

				if (desktop()) {
					$('.em-part-lower-container').find('.em-part:not(.em-part-4)').animate({
						width: '25rem'
					});

					$('.em-part-4').animate({
						width: '0rem'
					}, function() {
						$(this).hide().addClass('em-hidden');
						$('.em-part-lower-container').css('grid-template-areas', '"title title title" "two three five"');
					});	
				} else hide();

			}


			else {
				if (no) show();
				else hide();
			}

		});
	});

	$('.em-element-living_together .em-cc-yes').click(function() {
		$(this).parent().parent().find('.em-c').val(1);

		$(this).addClass('em-cc-green');
		$(this).siblings('.em-cc-no').removeClass('em-cc-green');

		$('.em-element-co_applicant_address_since_year, .em-element-co_applicant_address_since_month, .em-element-co_applicant_rent').up();

	});	

	$('.em-element-living_together .em-cc-no').click(function() {
		$(this).parent().parent().find('.em-c').val(0);

		$(this).addClass('em-cc-green');
		$(this).siblings('.em-cc-yes').removeClass('em-cc-green');

		$('.em-element-co_applicant_address_since_year, .em-element-co_applicant_address_since_month').down();

		switch ($('.em-i-co_applicant_living_conditions').val()) {
			case 'Hyresrätt':
			case 'Bostadsrätt':
			case 'Inneboende': $('.em-element-co_applicant_rent').down();
		} 

	});


	// collect debt, loan purpose etc
	$('.em-element-collect_debt .em-cc-yes').click(function() {
		$('.em-element-credit_loan_amount').down();
		$('.em-element-loan_purpose').up();

		if ($('.em-i-credit_loan_amount').val())
			$('.em-element-privatloan, .em-element-creditloan').down();
	});

	$('.em-element-collect_debt .em-cc-no').click(function() {
		$('.em-element-loan_purpose').down();
		$('.em-element-credit_loan_amount, .em-element-privatloan, .em-element-creditloan').up();
	});

	$('.em-check-span').on('keypress', function(e) {
		if (e.keyCode == 13 || e.keyCode == 32) {
			e.preventDefault();
			var $check = $(this).parent().prev();
			$check.prop('checked', !$check.attr('checked'));
		}
	});

	$('.em-i-credit_loan_amount').keyup(function() {
		if ($(this).val()) $('.em-element-privatloan, .em-element-creditloan').down();
		else $('.em-element-privatloan, .em-element-creditloan').up();

	});



	// LISTS 

	$('.em-i-employment_type').change(function() {
		switch ($(this).val()) {
			case 'Vikariat':
				$('.em-element-employment_since_year, .em-element-employment_since_month').up();
				$('.em-element-employment_last_year, .em-element-employment_last_month, .em-element-employer, .em-element-work_number').down(); 
				break;
			case 'Fast anställd':
			case 'Egen rörelse': 
				$('.em-element-employment_last_year, .em-element-employment_last_month').up(); 
				$('.em-element-employment_since_year, .em-element-employment_since_month, .em-element-employer, .em-element-work_number').down(); 
				break;

			default: $('.em-element-employment_since_year, .em-element-employment_since_month, .em-element-employment_last_year, .em-element-employment_last_month, .em-element-employer, .em-element-work_number').up();
		}
	});

	$('.em-i-co_applicant_employment_type').change(function() {
		switch ($(this).val()) {
			case 'Vikariat':
				$('.em-element-co_applicant_employment_since_year, .em-element-co_applicant_employment_since_month').up();
				$('.em-element-co_applicant_employment_last_year, .em-element-co_applicant_employment_last_month, .em-element-co_applicant_employer, .em-element-co_applicant_work_number').down(); 
				break;
			case 'Fast anställd':
			case 'Egen rörelse': 
				$('.em-element-co_applicant_employment_last_year, .em-element-co_applicant_employment_last_month').up(); 
				$('.em-element-co_applicant_employment_since_year, .em-element-co_applicant_employment_since_month, .em-element-co_applicant_employer, .em-element-co_applicant_work_number').down(); 
				break;

			default: $('.em-element-co_applicant_employment_since_year, .em-element-co_applicant_employment_since_month, .em-element-co_applicant_employment_last_year, .em-element-co_applicant_employment_last_month, .em-element-co_applicant_employer, .em-element-co_applicant_work_number').up();
		}
	});

	$('.em-i-living_conditions').change(function() {
		console.log($(this).val());
		switch ($(this).val()) {
			case 'Hyresrätt':
			case 'Bostadsrätt':
			case 'Inneboende': $('.em-element-rent').down(); break;
			default: $('.em-element-rent').up();
		}
	});

	$('.em-i-co_applicant_living_conditions').change(function() {
		console.log($(this).val());
		switch ($(this).val()) {
			case 'Hyresrätt':
			case 'Bostadsrätt':
			case 'Inneboende': $('.em-element-co_applicant_rent').down(); break;
			default: $('.em-element-co_applicant_rent').up();

		}
	});

})(jQuery);


/***********
	POPUP
 **********/

(function($) {

	var numb = function(n) { return n.replace(/\D/g, '') }

	var showPopup = function(e) {

		if ($(window).width() < 901) return;

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

			$('.pop-neste').off('click', click);
			$('.email-popup, .em-glass').fadeOut(500);

			$.post(emurl.ajax_url, 
				{
					action: 'popup_se',
					'ab-name': $('#abtesting-post').val(),
					'ab-sc': $('#abtesting-sc').val(),
					'pop-email': $('#pop-email').val(),
					'pop-phone': numb($('#pop-phone').val())
				}, 
				function(data) {
				}
			);

			sendGa('popup', 0);

			// cookie
			var date = new Date();
			date.setTime(date.getTime() + (20*24*60*60*1000));
			document.cookie = 'em_popup=done; expires='+date.toUTCString();
		}
		$('.pop-neste').on('click', click);

	}


	// Check cookies first
	setTimeout(function() {
		if (!/(^| |;)em_popup=/.test(document.cookie)) {  
			$('body').on('mouseleave', showPopup);
			$('.em-b-next').one('click', function() { $('body').off('mouseleave', showPopup) });
		}
	}, 5000);

})(jQuery);


/*****************
	BACK BUTTON
 *****************/
(function($) {
	if (/.+/.test(location.hash)) history.replaceState(null, null, ' ');

	var hash = '';
	$(window).on('hashchange', function() {
		if (!location.hash && hash == '#form') location.reload();

		hash = location.hash;
	});
})(jQuery);


/*************
	COOKIES
 *************/
(function($) {
	var date = new Date();
	date.setTime(date.getTime() + (120*24*60*60*1000));
	date = date.toUTCString();

	(function() { 

		// CLICK ID
		var match = /(?:gclid=|msclkid=)(.*?)(?:&|$)/.exec(location.search);
		if (!match || !match[1]) return;

		// id
		document.cookie = 'clid='+match[1]+'; expires='+date;

		match = /gclid|msclkid/.exec(location.search);
		if (!match || !match[0]) return;

		// clid source (gclid or msclkid)
		document.cookie = 'clid_source='+match[0]+'; expires='+date;

	})();


	// REFERRER COOKIE
	(function() {

		if (!!location.referrer) return;

		if (!new RegExp(location.hostname).test(document.referrer)) 
			document.cookie = 'referrer='+document.referrer+'; expires='+date;

	}());

})(jQuery);


/**************
	QA BOXES
 **************/
(function($) {
  $('.em-qa-title').each(function() {
    $(this).on('click touch', function() {
    	$(this).next('.em-qa-box').slideToggle();
    });
  });
})(jQuery);



/*********************
	MODAL LINK
 *********************/
(function($) {

	$('.modal-link').on('click', function(e) {

		e.preventDefault();

		if (!$(this).attr('href')) return;

		$.get($(this).attr('href'), function(data) {
			var ien = data.indexOf('article')-1;
			var ito = data.indexOf('/article')+9;

			if (ien == -1 || ito == -1) return;

			var m = data.substring(ien, ito)

			$('body').append('<div class="modal-popup"><button type="button" class="modal-close">Lukk</button>'+m+'<button type="button" class="modal-close pvc2">Lukk</button></div>');

			$('.modal-popup, .em-glass').fadeIn(500);

			$('.modal-close').one('click', function() {

				if (!$('.email-popup').is(':visible')) $('.em-glass').fadeOut(500);

				$('.modal-popup').fadeOut(500, function() {
					$(this).remove();
				});

			});
		});

	});

})(jQuery);