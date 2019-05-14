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



(function() {
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

	var qsa = function(e) {
		var t = document.querySelectorAll(e);

		if (!t) return [];

		return t;
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

	var payment = function() {
		var i = 0.0681/12;
		try { 
			var p = numb(qs('.em-i-loan_amount').value);
			var n = numb(qs('.em-i-tenure').value)*12;

			qs('.em-if-monthly_cost').value = kroner(Math.floor(p / ((1 - Math.pow(1 + i, -n)) / i))) 
		} catch (e) { console.error('Cost calculation: '+e) }
	};

	var val = {
		numbersOnly: function(d) {
			if (/^\d+$/.test(d)) return true;
			return false
		},

		textOnly: function(d) {
			return true;
		},

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
			// var pa = e.parentNode.parentNode;

			// var mark = pa.querySelector('.em-val-marker');
			// removing postfix
			if (format && format.indexOf('postfix:') -1) {
				var temp = format.replace('postfix:', '');

				data = e.value.replace(temp, '');
			}

			if (e.getAttribute('type') == 'checkbox')
				data = e.checked;

			// validating
			if (!val[valid](data)) {
				// console.log(e.type);
				if (e.type == 'checkbox') pa.style.backgroundColor = 'hsl(0, 80%, 70%)';
				// console.log(e.type);
				// switch (e.type) {
				else {
					pa.querySelector('.em-marker-valid').classList.add('em-hidden');
					pa.querySelector('.em-marker-invalid').classList.remove('em-hidden');
				}
				// qs('.em-marker-valid').classList.add('em-hidden');
				// qs('.em-marker-invalid').classList.remove('em-hidden');
				// if (mark) {
					// mark.classList.remove('em-val-marker-yes');
					// mark.classList.add('em-val-marker-no');
				// }
				return false;
			} 
			
			else { 
				if (e.type == 'checkbox') pa.style.backgroundColor = 'transparent';
				else {
					pa.querySelector('.em-marker-valid').classList.remove('em-hidden');
					pa.querySelector('.em-marker-invalid').classList.add('em-hidden');
				}
				// qs('.em-marker-valid').classList.remove('em-hidden');
				// qs('.em-marker-invalid').classList.add('em-hidden');
				// pa.style.backgroundColor = 'transparent';
				// if (mark) {
					// mark.classList.remove('em-val-marker-no');
					// mark.classList.add('em-val-marker-yes');
				// }
				return true;
			}
		}

		catch (e) { console.error('Error during validation: '+e) }
	}


	var progress = function() {
		return;
		
		var li = qsa('.em-i:not(button)');
		// var li = document.querySelectorAll('.em-i:not(button)');

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

		if (ab) document.cookie = 'abname='+ab+'; expires='+date.setDate(date.getDate() + 60);
		if (abid) document.cookie = 'abid='+abid+'; expires='+date.setDate(date.getDate() + 60);

		// if (ab) setcookie('abname', ab, date.setDate(date.getDate() + 30))
		// if (abid) setcookie('abid', abid, date.setDate(date.getDate() + 30))
	}

	// AB2
	var showFirstPagePart = function(e) {
		try {
			
			e.target.style.display = 'none';

			qs('.em-element-tenure').style.display = 'block';
			qs('.em-element-email').style.display = 'block';
			qs('.em-element-mobile_number').style.display = 'block';
			qs('.em-element-collect_debt').style.display = 'block';
			qs('.em-b-container').style.display = 'grid';

		} catch (e) { console.error(e) }
	}




	var init = function() {
		// AB 2
		// try { qs('.em-b-show').addEventListener('click', showFirstPagePart);
		// } catch (e) { console.error(e) }

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
			
				// var mark = e.target.parentNode.querySelector('.em-val-marker');
				// console.log(e.target.parentNode);
				// mark.classList.remove('em-val-marker-yes');
				// mark.classList.remove('em-val-marker-no');

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
				n.addEventListener('input', function(e) { v(e.target, format, valid) });
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
				case 'em-i-tenure':
				case 'em-i-loan_amount': 
					n.addEventListener('input', function(e) { payment() });
					n.addEventListener('focusout', function(e) { payment() });
					break;

				case 'em-i-email':
					n.addEventListener('input', function(e) {
						var l = e.target.value.length;
						var s = function(p) { e.target.style.fontSize = p }

						if (l > 10) s('18px');
						if (l > 20) s('16px');
						if (l > 30) s('14px');
						if (l > 40) s('12px');

					});
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
		var checkboxInput = qsa('.em-cc');
		for (var i = 0; i < checkboxInput.length; i++) (function() {
			var c = checkboxInput[i];

			var yes = c.querySelector('.em-cc-yes');
			var no = c.querySelector('.em-cc-no');
			var input = c.querySelector('.em-c');

			var show = input.getAttribute('data-show');


			yes.addEventListener('click', function(e) {

				input.value = 1;

				if (show) {
					var c = show.replace(/^(yes:\s?)|(no:\s?)/, '');

					var temp = qs('.'+c);

					if (show.indexOf('no:') != -1) temp.classList.add('em-hidden');
					else temp.classList.remove('em-hidden');

				}

				yes.classList.add('em-cc-green');
				no.classList.remove('em-cc-green');

				progress();

			});

			no.addEventListener('click', function(e) {

				input.value = '';

				if (show) {
					var c = show.replace(/^(yes:\s?)|(no:\s?)/, '');

					var temp = qs('.'+c);

					if (show.indexOf('no:') != -1) temp.classList.remove('em-hidden');
					else temp.classList.add('em-hidden');
					
				}

				yes.classList.remove('em-cc-green');
				no.classList.add('em-cc-green');

				// special rule
				// try {
				// 	var co = e.target.parentNode.parentNode.querySelector('.em-c-co_applicant');
				// 	if (co) {
				// 		var hInput = qs('.em-c-co_applicant_norwegian'); 
				// 		hInput.value = '1';
				// 		hInput.parentNode.querySelector('.em-cc-yes').classList.add('em-cc-green');
				// 		hInput.parentNode.querySelector('.em-cc-no').classList.remove('em-cc-green');

				// 		qs('.em-co-applicant-norwegian').classList.add('em-hidden');
				// 	}
				// } catch (e) { console.error(e) }
				progress();

			});
		})();
		


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
						qs(o[i]).classList.remove('em-hidden');
					
				} catch (e) {}
			}

			// hiding html element
			var hide = function(o) {
				try {
					for (var i = 0; i < o.length; i++) 
						qs(o[i]).classList.add('em-hidden');
					
				} catch (e) {}
			}

			// SPECIAL RULES
			switch (n.classList[1]) {

				// EDUCATION
				case 'em-i-education':
					n.addEventListener('change', function(e) {
						switch (e.target.value) {
							case 'Høysk./universitet 1-3 år':
							case 'Høysk./universitet 4+år': show(['.em-element-education_loan']); break;
							default: hide(['.em-element-education_loan']);
						}
					})
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
				var test = current.querySelectorAll('.em-i');
				var success = true;

				for (var i = 0; i < test.length; i++) (function() {
					var n = test[i];

					var p = n.parentNode.parentNode;

					if (p.classList.contains('em-hidden')) return;

					if (p.parentNode.classList.contains('em-hidden')) return;

					if (n.getAttribute('data-val')) {
						var val = n.getAttribute('data-val');
						var f = n.getAttribute('format');
						var ver = v(n, null, val);

						if (!ver) success = false;
					}
				})();

				// exit ramp
				if (!success) {
					// success = true;
					// return;
				}
				
				// hiding current part
				current.style.display = 'none';

				try {
					// showing next part
					current.nextSibling.style.display = 'block';
		
					// showing prev button
					qs('.em-b-back').classList.remove('em-hidden');

					// replace next button with submit button if no more parts
					if (!current.nextSibling.nextSibling) {
						e.target.classList.add('em-hidden');
						qs('.em-b-submit').classList.remove('em-hidden');
					}

					current = current.nextSibling;

					current.querySelector('.em-i').focus();

					// current.querySelector('.em-part-title').classList.add('em-part-title-slide');

				} catch (e) { console.error(e) }

			});

			qs('.em-b-next').addEventListener('click', incomplete);

		} catch (e) {}

		// back button
		try {
			qs('.em-b-back').addEventListener('click', function(e) {
				try {
					current.style.display = 'none';

					var p = current.previousSibling;

					p.style.display = 'block';

					if (!p.previousSibling) e.target.classList.add('em-hidden');

					qs('.em-b-next').classList.remove('em-hidden');
					qs('.em-b-submit').classList.add('em-hidden');

					current = p;

					current.querySelector('.em-i').focus();
					
				} catch (e) {}
			});
		} catch (e) {}

		// SUBMIT BUTTON
		try {
			var post = function() {

				var data = '';

				var valid = true;

				// var inputs = qsa('input.em-i:not(.em-check), .em-c, select.em-i');
				var inputs = qsa('input.em-i, .em-c, select.em-i');

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

				var cookie = document.cookie.split('; ');
				for (var i in cookie) {
					if (cookie[i].indexOf('=') == -1) continue;

					var temp = cookie[i].split('=');
					if (temp[0] == '_ga') data += '&data[ga]='+temp[1];
				}

				data += abtesting();

				qs('.em-b-submit').removeEventListener('click', post);

				var close = function(e) { e.target.parentNode.style.display = 'none' }

				qs('.em-popup-button').addEventListener('click', close);
				qs('.em-popup-x').addEventListener('click', close);

				qs('.em-b-submit').innerHTML = 'Sendes...';

				var xhttp = new XMLHttpRequest();

				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {

						try {
							qs('.em-b-submit').style.display = 'none';

							qs('.em-popup').classList.add('em-popup-show');
						} catch (e) {}

						console.log(this.responseText);
					}
				}

				// sending to server
				xhttp.open('POST', emurl.ajax_url, true);
				xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhttp.send('action=axowl'+data);
				// console.log(data);

			}

			qs('.em-b-submit').addEventListener('click', post);

		} catch (e) { console.error(e) }


		// helper text
		// var hm = document.querySelectorAll('.em-ht-q');
		var hm = qsa('.em-ht-q');
		for (var i = 0; i < hm.length; i++) 
			(function() { 
				var q = hm[i];
				var p = q.parentNode;

				q.addEventListener('mouseover', function(e) {
					try { p.querySelector('.em-ht').classList.remove('em-hidden');
					} catch (e) {}
				});

				q.addEventListener('mouseout', function(e) {
					try { p.querySelector('.em-ht').classList.add('em-hidden');
					} catch (e) {}
				});

				q.addEventListener('click', function(e) {
					try { p.querySelector('.em-ht').classList.toggle('em-hidden');
					} catch (e) {}

				});
			})();
		

		var inputs = qsa('input.em-i:not(.em-check)');
		var selects = qsa('select.em-i, input.em-check');

		for (var i = 0; i < inputs.length; i++) (function() {
			inputs[i].addEventListener('focusout', function() { progress() });
		})();

		for (var i = 0; i < selects.length; i++) (function() {
			selects[i].addEventListener('change', function() { progress() });
		})();

		qs('.em-i-loan_amount').focus();



	} // end of init

	// console.log(abtesting());

	// document.cookie = 'test=hi';
	// console.log(document.cookie);


	setCookie();
	payment();
	init();
	progress();

	// var ajatest = new XMLHttpRequest();

	// ajatest.onreadystatechange = function() {
	// 	if (this.readyState == 4 && this.status == 200) {
	// 		console.log(this.responseText);
	// 	}
	// }

	// // sending to server
	// ajatest.open('POST', emurl.ajax_url, true);
	// ajatest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	// ajatest.send('action=wlinc');


})();