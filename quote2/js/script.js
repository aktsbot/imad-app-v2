function addItem(select_box, name, value) {
	var optn = document.createElement("option");
	optn.text = name;
	optn.value = value;
	select_box.options.add(optn);
}

var sel_json = document.getElementById("selected_info_div").innerHTML;
var sel_user_id = JSON.parse(sel_json).user_id;
var sel_tag_id = JSON.parse(sel_json).tag_id;

function makeUsersDropDown(user_json, selected) {
	var user_list_json = JSON.parse(user_json);
	// alert(user_list_json);
	var user_select = document.getElementById("soflow-user-select");

	for(var i=0; i<user_list_json.length; i++) {
		addItem(user_select, user_list_json[i].user_name, user_list_json[i].id);
	}

	if(selected != "none") {
		user_select.value = selected;
	}

	return;
}

function makeTagsDropDown(tag_json, selected) {
	var tag_list_json = JSON.parse(tag_json);
	//alert(tag_list_json[0].tag_name);

	var tag_select = document.getElementById("soflow-tag-select");
	for(var i=0; i<tag_list_json.length; i++) {
		addItem(tag_select, tag_list_json[i].tag_name, tag_list_json[i].id);
	}

	if(selected != "none") {
		tag_select.value = selected;
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
		    makeUsersDropDown(xhr.responseText, sel_user_id);
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
		    makeTagsDropDown(xhr.responseText, sel_tag_id);
		    //tag_list_json = xhr.responseText;
		}
	}
	xhr.send(null);

	return;
}



setTags();
setUsers();

var submit_btn = document.getElementById("quote_btn_id");
submit_btn.onclick = function() {

	var ps_tag_id = document.getElementById("soflow-tag-select").value;
	var ps_user_id = document.getElementById("soflow-user-select").value;

	//alert(JSON.parse(sel_json).tag_id);
	window.location = "/quote2?user_id="+ps_user_id+"&tag_id="+ps_tag_id;
};