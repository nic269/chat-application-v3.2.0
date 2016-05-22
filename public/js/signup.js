define([
	'text!templates/signup.tpl',
	'popup',
	'jQuery'
], function(SignupTemplate, Popup) {

	function signUp() {
		this._$signup_action = $('.js-act-signup');
		this._$signup = $('.js-sign-up');
		//this._signup_url = 'http://dev.node:7000/signup/';
	}

	signUp.prototype.init = function() {
		var that = this;

		this._$signup_action.on('click', function() {
			var popup = new Popup();
			var data = {
				'title': 'Sign Up',
				'content': SignupTemplate
			};

			popup.init({
				class: 'signup-popup',
				data: data
			});

			var $signup = $('.signup-popup');
			var $btn_signup = $signup.find('.js-btn-signup');
			var $avatar_img = $signup.find('.js-avatar-list img');
			var $user_name_field = $signup.find('.js-user-name');
			var $password_field = $signup.find('.js-password');
			var $re_password_field = $signup.find('.js-re-password');

			that._$signup = $signup.find('.js-sign-up');

			$avatar_img.on('click', function() {
				$('.js-avatar-list img.selected').removeClass('selected');
				$(this).addClass('selected');
			});

			$btn_signup.on('click', function() {
				var $avatar_field = $signup.find('.js-avatar-list img.selected');
				var user_name_input = $user_name_field.val(),
					password_input = $password_field.val(),
					re_password_input = $re_password_field.val(),
					avatar_input = $avatar_field.attr('src');

				if (user_name_input === '' || password_input === '' || re_password_input === '' || avatar_input === '') {
					that.addError('Please fill all field!!');
					return;
				} else if (password_input !== re_password_input) {
					that.addError('password and re-password don\'t match');
					return;
				}

				// console.log('user: ' + user_name_input + ' pass: ' + password_input + ' re-pass: ' + re_password_input + ' avatar: ' + avatar_input);

				$.post('http://dev.node:7000/signup', {
					user_name: user_name_input,
					password: password_input,
					re_password: re_password_input,
					avatar: avatar_input
				}, function(res) {
					if (res === 'done') {
						popup.closePopup();
					} else {
						that.addError(res);
						return;
					}
				});

			});
		});
	};

	signUp.prototype.addError = function(error) {
		var error_area = $('<p/>', {
			class: 'error'
		}).html(error + '<span class="error-close"><i class="fa fa-times" aria-hidden="true"></i></span>');
		this._$signup.prepend(error_area);
	};

	return new signUp();
});