// -----------------------
function addItem(select_box, name, value) {
	var optn = document.createElement("option");
	optn.text = name;
	optn.value = value;
	select_box.options.add(optn);
}

function makeUsersDropDown(user_json) {
	var user_list_json = JSON.parse(user_json);
	// alert(user_list_json);
	var user_select = document.getElementById("soflow-user-select");

	for(var i=0; i<user_list_json.length; i++) {
		addItem(user_select, user_list_json[i].user_name, user_list_json[i].id);
	}

	return;
}

function makeTagsDropDown(tag_json) {
	var tag_list_json = JSON.parse(tag_json);
	//alert(tag_list_json[0].tag_name);

	var tag_select = document.getElementById("soflow-tag-select");
	for(var i=0; i<tag_list_json.length; i++) {
		addItem(tag_select, tag_list_json[i].tag_name, tag_list_json[i].id);
	}

	return;
}

//
function setUsers() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/quote2/fetch-users", true);

	xhr.onreadystatechange = function() {//Call a function when the state changes.
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			//alert(xhr.responseText);
		    //document.getElementById("user_list_div").innerHTML = xhr.responseText;
		    makeUsersDropDown(xhr.responseText);
		    //user_list_json = xhr.responseText;
		}
	}
	xhr.send(null);

	return;
}

function setTags() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/quote2/fetch-tags", true);

	xhr.onreadystatechange = function() {//Call a function when the state changes.
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			//alert(xhr.responseText);
		    //document.getElementById("tag_list_div").innerHTML = xhr.responseText;
		    makeTagsDropDown(xhr.responseText);
		    //tag_list_json = xhr.responseText;
		}
	}
	xhr.send(null);

	return;
}

function modalDisplay(db_add_status) {
	var status_message = "<b><i>Zoinks!</i></b>, <br>&emsp;Quote addition failed!";
	var modal = document.getElementById('modal-msg-box');
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	var modal_text = document.getElementById("modal-text");

	if (db_add_status == 0) {
		status_message = "<b><i>Thank you</i></b>, <br>&emsp;Quote inserted successfully.";
		document.getElementById('add-quote-content-text').value = "";
		document.getElementById('q_by').value = "";
	}

	modal_text.innerHTML = status_message;

	modal.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
	return;
}
// -----------------------

setTags();
setUsers();

var add_quote_btn = document.getElementById("add_quote_btn_id");

add_quote_btn.onclick = function() {
	//alert('hello');

	var modal = document.getElementById('modal-msg-box');
	var modal_text = document.getElementById("modal-text");
	var span = document.getElementsByClassName("close")[0];

	var fields_ok = 1;

	// validate all input fields
	var quote_textarea = document.getElementById("add-quote-content-text");
	if(quote_textarea.value == "") {
		quote_textarea.style.borderColor = "#ef2929";
		quote_textarea.placeholder = "Enter a quote!";
		fields_ok = 0;
	} else {
		quote_textarea.style.borderColor = "#aaa";
		quote_textarea.placeholder="Tough times never last, but tough people do"
	}

	var quote_by_field = document.getElementById("q_by");
	if(quote_by_field.value == "") {
		quote_by_field.style.borderColor = "#ef2929";
		quote_by_field.placeholder = "Quote by?"
		fields_ok = 0;
	} else {
		quote_by_field.style.borderColor = "#aaa";
		quote_by_field.placeholder = "Robert H Schuller";
	}

	if(fields_ok == 0) {
		return;
	}

	var user = ""; 
	user = document.getElementById("q_user").value;
	var tag = ""; 
	tag = document.getElementById("q_tag").value;
	var tag_id = document.getElementById("soflow-tag-select").value;
	var user_id = document.getElementById("soflow-user-select").value;

	if(user != "" && user_id != "1") {
		modal_text.innerHTML = "Yikes! I know this is a design error.<br>The value of <i><b>\"Contributed by\"</b></i> will only be taken, if user choice is <i><b>\"anon\"</b></i>.";

		modal.style.display = "block";

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
		    modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
		    if (event.target == modal) {
		        modal.style.display = "none";
		    }
		}

		return;
	}

	if(tag != "" && tag_id != "1") {
		modal_text.innerHTML = "Ahem! This might be a design error.<br>The value of <i><b>\"Tagged as\"</b></i> will only be taken, if user choice is <i><b>\"untagged\"</b></i>.";

		modal.style.display = "block";

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
		    modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
		    if (event.target == modal) {
		        modal.style.display = "none";
		    }
		}

		return;
	}

	if(user == "") {
		user = "none";
	}

	if(tag == "") {
		tag = "none";
	}

	var post_string = "quote="+quote_textarea.value+"&quote_by="+quote_by_field.value+"&user="+user+"&tag_id="+tag_id+"&tag="+tag+"&user_id="+user_id;

	//console.log(post_string);
    add_quote_btn.disabled = true;
    var loading_anim = document.getElementById("loading-anim");
	loading_anim.style.display = "block";

	var xhr = new XMLHttpRequest();
	xhr.open('POST', "/quote2/add-quote-submit", true);

	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() {//Call a function when the state changes.
	    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
	        // Request finished. Do processing here.
	        //alert(xhr.responseText);
	        if(xhr.responseText == "ok") {
	        	modalDisplay(0);	
	        } else {
	        	modalDisplay(1);
	        }
	        setTags();
			setUsers();
	        add_quote_btn.disabled = false;
	        loading_anim.style.display = "none";
	    }
	}
	// "quote=foo&quote_by=12&user=mokoogugksxtax&tag=2"
	xhr.send(post_string); 

}