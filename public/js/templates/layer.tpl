<div class="js-layer-header layer-header b-layout">
	<h3 class="js-receiver receiver layout-left"><%= receiver %><!-- Receiver is here --></h3>
	<span class="js-layer-close-icon layer-close-icon layout-right"><i class="fa fa-times"></i></span>
</div><!-- End Div.layer-header -->

<div class="js-layer-content layer-content">
	<%= private_entries %><!-- Private message is here -->
</div>

<div class="layer-footer">
	<div class="new-msg-wrap">
		<input type="text" class="js-new-msg new-msg" data-receiver="<%= receiver %>" placeholder="Write the message...">
		<button class="js-btn-send btn btn-send"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
	</div>
</div>