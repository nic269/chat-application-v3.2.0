define([
	'text!templates/popup.tpl',
	'jQuery',
	'underscore'
], function(PopupTemplate) {

	function Popup() {
		this._$body = $('body');
		var options_default = {
			class : null,
			data: null,
			callback: null
		};
		this._settings = options_default;
	}

	Popup.prototype.init = function(options) {
		this._settings = $.extend(true, this._settings, options);

		if (this._settings.data === null) {
			alert('Data Popup is null');
			return;
		} else {
			this._$body.prepend(this.createPopupHtml(this._settings.data));

			this._$popup = $('.js-popup');
			this._$popup_box = $('.js-popup-box');
				
			if (this._settings.class) {
				this._$popup.addClass(this._settings.class);
			}

			this.showPopup();
			this.clickToClose();

			if (typeof this._settings.callback == 'function') {
				this._settings.callback(this);
			}
		}
	};

	Popup.prototype.createPopupHtml = function(data) {
		var template = _.template(PopupTemplate);
		var popup_html = template(data);

		return popup_html;
	};

	Popup.prototype.showPopup = function() {
		this._$popup_box.hide();
		this._$popup.addClass('is-show');
		this._$popup_box.slideDown('slow');
		this._$body.addClass('is-show-popup');
	};

	Popup.prototype.closePopup = function() {
		var that = this;

		this._$popup_box.slideUp(800);

		setTimeout(function() {
			that._$popup.removeClass('is-show');
			that._$body.removeClass('is-show-popup');
			that._$popup.remove();
		}, 800);
		
	};

	Popup.prototype.isBox = function(e) {
		if (($(e.target).closest('.js-popup-box').length) > 0) {
			return true;
		} else {
			return false;
		}
	};

	Popup.prototype.clickToClose = function() {
		var that = this;
		var $icon_close = this._$popup.find('.js-icon-close');

		this._$popup.on('click', function(e) {
			if (that.isBox(e) === false) {
				that.closePopup();
			}  else {
				return;
			}
		});

		$icon_close.on('click', function() {
			that.closePopup();
		});
	};

	return Popup;
});