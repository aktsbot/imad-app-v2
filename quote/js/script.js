// get time of day - hrs (0 -23)
// http://www.w3schools.com/jsref/jsref_gethours.asp
var current_date = new Date();
var current_hour = current_date.getHours();
//console.log(current_hour);

var greeting = "Greetings";
if(current_hour < 12) {
	greeting = "Good Morning";
} else if(current_hour < 16) {
	greeting = "Good Afternoon";
} else {
	greeting = "Good evening";
}

console.log(greeting);

// read fortunes.json and get our fortunes
var quote_json = JSON.parse(data);
var quote_json_length = quote_json.length;
//console.log(quote_json[0]);

function quote_update() {
	// https://www.freecodecamp.com/challenges/generate-random-whole-numbers-with-javascript#?solution=%0Avar%20randomNumberBetween0and19%20%3D%20Math.floor(Math.random()%20*%2020)%3B%0A%0Afunction%20randomWholeNum()%20%7B%0A%0A%20%20%2F%2F%20Only%20change%20code%20below%20this%20line.%0A%0A%20%20return%20Math.random()%3B%0A%7D%0A
	var random_num = Math.random() * quote_json_length;
	random_num = Math.floor(random_num);
	//console.log(quote_json[random_num]);

	var quote = quote_json[random_num].quote;
	var by = quote_json[random_num].by;

	document.getElementById('quote_content_div').innerHTML = "<b>\"</b>" + quote + "<b>\"</b>" + "<br /><b> -- " + by + "</b>";
}


quote_update();

document.getElementById('quote_btn_id').onclick = function() {
	quote_update();
};
