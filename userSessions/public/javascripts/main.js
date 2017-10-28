$(document).ready(function() {
	// body...
	$('.deleteUser').on('click',deleteUser);
});

function deleteUser(){
	event.preventDefault();

	var confirmation = confirm('Are you sure?');

	if(confirmation){
		$.ajax({
			type: 'DELETE',
			url: '/user/'+ $('.deleteUser').data('username')
		}).done(function(response){
			window.location.replace('/');
		});
	} else {
		return false;
	}
}