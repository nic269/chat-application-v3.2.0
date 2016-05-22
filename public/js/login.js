define([
	'text!templates/login.tpl',
	'popup',
	'jQuery'
], function(LoginTemplate, Popup) {

	function logIn() {
		this._$login_action = $('.js-act-login');
		this._$login = $('.js-log-in');
	}

	logIn.prototype.init = function() {
		var that = this;

		this._$login_action.on('click', function() {
			var popup = new Popup();
			var data = {
				'title': 'Log In',
				'content': LoginTemplate
			};

			popup.init({
				class: 'login-popup',
				data: data
			});

			var $login = $('.login-popup');
			var $btn_login = $login.find('.js-btn-login');
			var $user_name_field = $login.find('.js-user-name');
			var $password_field = $login.find('.js-password');

			that._$login = $login.find('.js-log-in');

			$btn_login.on('click', function() {
				$.post('http://dev.node:7000/login', {
					user_name: $user_name_field.val(),
					password: $password_field.val()
				}, function(res) {
					if (res === 'done') {
						popup.closePopup();
						var next = true;
						if (next) {
							window.location.href = '/';
						}
					} else {
						that.addError(res);
						return;
					}
				});
			});
		});

		
	};

	logIn.prototype.addError = function(error) {
		var error_area = $('<p/>', {
			class: 'error'
		}).html(error + '<span class="error-close"><i class="fa fa-times" aria-hidden="true"></i></span>');
		this._$login.prepend(error_area);
	};

	return new logIn();
});