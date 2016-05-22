<div class="user-info layout-left">
	<div class="avatar-img rounded">
		<img src="<%= avatar_img %>" alt="avatar-image">
	</div>
	<h3 class="name layout-middle"><%= sender %></h3>
</div>

<div class="msg layout-left">
	<p class="msg-content"><%= msg %></p>
	<time class="date" title="<%= created %>"><%= created %></time>
</div>