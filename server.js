var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pg = require('pg');
var Pool = require('pg').Pool;
var bp = require('body-parser');

var app = express();
app.use(morgan('combined'));

// for parsing POST
app.use(bp.json()); // support json encoded bodies
app.use(bp.urlencoded({ extended: true })); // support encoded bodies

// database connectivity
var config = {
  user: 'aktsbot', //env var: PGUSER
  database: 'aktsbot', //env var: PGDATABASE
  password: process.env.DB_PASSWORD, //env var: PGPASSWORD
  host: 'db.imad.hasura-app.io', // Server hosting the postgres database
  port: 5432 //env var: PGPORT
};
// var config = {
//   user: 'akts_db_user', //env var: PGUSER
//   database: 'akts_db', //env var: PGDATABASE
//   password: 'password', //env var: PGPASSWORD
//   host: 'localhost', // Server hosting the postgres database
//   port: 5432 //env var: PGPORT
// };

var pool = new Pool(config);

function generateHTMLFrame(selected_json, quote, quote_by) {
  
  var html_frame = `
  
<!DOCTYPE html>
<html>
<head>
  <title>Get a quote | IMAD Exercise</title>
  <link rel="stylesheet" type="text/css" href="/quote2/css/style2.css">
  <link rel="shortcut icon" href="/quote2/images/favicon.png" />
</head>
<body>

  <div id="main-container">
  <div id="main-header">
    <h1>Get a quote</h1>
  </div>

  <div id="main-side-menu-options">
    <div id="selections">
      Tags:<select id="soflow-tag-select">
      </select>
      <br>
      User:<select id="soflow-user-select">
      </select>

      <button id='quote_btn_id'>Go</button>
    </div>
  </div>

  <div id="main-content">
    <div id="main-content-quot">
      <p id="quote">${quote}</p>
      <p id="quot_by">${quote_by}</p>
    </div>  
  </div>
  
  <div id="selected_info_div" style="display:none">${selected_json}</div>

  <div id="main-footer">
    <ul>
      <li><a href="/quote2/add-quote">have a quote to share?</a></li>
      <li><a href="https://github.com/aktsbot/imad-app-v2">source</a></li>
      <li><a href="http://www.vim.org/">vim</a></li>
      <li><a href="http://www.imad.tech/">imad</a></li>
      <li><a href="http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines">tango</a></li>
    </ul>
  </div>

</div>

<script src='/quote2/js/script.js'></script>

</body>
</html>
  `;

  return html_frame;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/fortune', function (req, res) {
  res.sendFile(path.join(__dirname, 'fortune', 'index.html'));
});

app.get('/quote', function (req, res) {
  res.sendFile(path.join(__dirname, 'quote', 'index.html'));
});

// quote
app.get('/quote/css/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, '/quote/css/', 'style.css'));
});

app.get('/quote/js/script.js', function (req, res) {
  res.sendFile(path.join(__dirname, '/quote/js/', 'script.js'));
});

app.get('/quote/images/favicon.png', function (req, res) {
  res.sendFile(path.join(__dirname, '/quote/images/', 'favicon.png'));
});

app.get('/quote/js/quotes.json', function (req, res) {
  res.sendFile(path.join(__dirname, '/quote/js/', 'quotes.json'));
});
// end of quote

// fortune
app.get('/fortune/css/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, '/fortune/css/', 'style.css'));
});

app.get('/fortune/js/script.js', function (req, res) {
  res.sendFile(path.join(__dirname, '/fortune/js/', 'script.js'));
});

app.get('/fortune/js/fortunes.json', function (req, res) {
  res.sendFile(path.join(__dirname, '/fortune/js/', 'fortunes.json'));
});

app.get('/fortune/images/favicon.png', function (req, res) {
  res.sendFile(path.join(__dirname, '/fortune/images/', 'favicon.png'));
});
// end of fortune



// quote2
app.get('/quote2', function (req, res) {

  var user_id = "none";
  var tag_id = "none";

  if(req.param('user_id')) {
    user_id = req.param('user_id');
  }

  if(req.param('tag_id')) {
    tag_id = req.param('tag_id');
  }

  //console.log(user_id+' '+tag_id);

  var json = {};
  json.user_id = user_id;
  json.tag_id = tag_id;

  var selected_json = JSON.stringify(json);

  var query = ""; 
    
  if(user_id != "none" && tag_id != "none") {
    query = "SELECT content, quote_by FROM quote_table WHERE tag_id="+tag_id+" AND added_user_id="+user_id+" AND is_ok=1;";
  } else if(user_id == "none" && tag_id != "none") {
    query = "SELECT content, quote_by FROM quote_table WHERE tag_id="+tag_id+" AND is_ok=1;";
  } else if(user_id != "none" && tag_id == "none") {
    query = "SELECT content, quote_by FROM quote_table WHERE added_user_id="+user_id+" AND is_ok=1;";
  } else {
    query = "SELECT content, quote_by FROM quote_table WHERE is_ok=1;";
  }

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(query, function(err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);

      if(err) {
        return console.error('error running query', err);
      }
      
      var quote_count = result.rows.length;

      // this is a dirty hack :(
      if(quote_count < 1) {
        res.redirect('/quote2?user_id=1&tag_id=1');
        return;
      }

      var random_num = Math.random() * quote_count;
      random_num = Math.floor(random_num);

      var final_quote = result.rows[random_num].content;
      var final_quote_by = result.rows[random_num].quote_by;

      res.send(generateHTMLFrame(selected_json, final_quote, final_quote_by));
    });
  });

});

app.get('/quote2/fetch-tags', function (req,res) {

  var tag_fetch_query = "SELECT id, tag_name FROM quote_tag_table ORDER BY id;";

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(tag_fetch_query, function(err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);

      if(err) {
        return console.error('error running query', err);
      }
      res.send(JSON.stringify(result.rows));
      //output: 1
    });
  });

});

app.get('/quote2/fetch-users', function (req,res) {

  var user_fetch_query = "SELECT id, user_name FROM quote_user_table ORDER BY id;";

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(user_fetch_query, function(err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);

      if(err) {
        return console.error('error running query', err);
      }
      res.send(JSON.stringify(result.rows));
      //output: 1
    });
  });

});


function insertQuote(quote, quote_by, user_id, tag_id) {


  var query = "INSERT INTO quote_table (tag_id, content, added_date, is_ok, added_user_id, quote_by) VALUES ("+tag_id+",'"+quote+"',now(),0,"+user_id+",'"+quote_by+"');";

  pool.connect(function(err, client, done) {
    if(err) {
      //res.send('database_busy');
      return 'database_busy';
    }
    
    client.query(query, function(err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
      done(err);

      if(err) {
        //res.send('database_entry_failed');
        return 'database_entry_failed';
      }
    });

  });

  return "ok";

}



app.post('/quote2/add-quote-submit', function (req, res) {

  if (! req.body.quote) {
    res.send('incomplete_info');
    return;
  }

  if (! req.body.quote_by) {
    res.send('incomplete_info');
    return;
  }

  if (! req.body.user) {
    res.send('incomplete_info');
    return;
  }

  if (! req.body.user_id) {
    res.send('incomplete_info');
    return;
  }

  if (! req.body.tag) {
    res.send('incomplete_info');
    return;
  }

  if (! req.body.tag_id) {
    res.send('incomplete_info');
    return;
  }

  var quote = req.body.quote;
  var quote_by = req.body.quote_by;
  var user_name = req.body.user;
  var user_id = req.body.user_id; // from drop_down
  var tag_name = req.body.tag;
  var tag_id = req.body.tag_id; // from drop_down
  
  var new_user_id = "";
  var new_quot_id = "";

  //res.send(req.body);


  if(user_name != "none" && user_id == "1" && tag_name == "none") {

    // we insert a new user and then pass the user_id and the tag_id we recieved to
    // the insertQuote function
    var insert_user_query = "INSERT INTO quote_user_table (user_name) VALUES ('"+user_name+"') RETURNING id;"

    pool.connect(function(err, client, done) {
      if(err) {
        res.send('database_busy');
        return;
      }

      client.query(insert_user_query, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return 'database_entry_failed';
        }

        //output: 1
        var new_user_id = result.rows[0].id.toString();
        
        res.send(insertQuote(quote, quote_by, new_user_id, tag_id));

      });
    });
    //res.send("first block");

    return;

  } else if(tag_name != "none" && tag_id == "1"  && user_name == "none") {
    
    // we insert a new user and then pass the user_id and the tag_id we recieved to
    // the insertQuote function
    pool.connect(function(err, client, done) {
      if(err) {
        res.send('database_busy');
        return;
      }
      var insert_tag_query = "INSERT INTO quote_tag_table (tag_name) VALUES ('"+tag_name+"') RETURNING id;";

      client.query(insert_tag_query, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return 'database_entry_failed';
        }

        //output: 1
        var new_tag_id = result.rows[0].id.toString();
        
        res.send(insertQuote(quote, quote_by, user_id, new_tag_id));

      });
    });
    //res.send("second block");
    return;

  } else if(user_name != "none" && tag_name != "none") {

    // create tag and user and then enter
    var insert_user_query = "INSERT INTO quote_user_table (user_name) VALUES ('"+user_name+"') RETURNING id;"

    pool.connect(function(err, client, done) {
      if(err) {
        res.send('database_busy');
        return;
      }

      client.query(insert_user_query, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
          return 'database_entry_failed';
        }

        //output: 1
        var new_user_id = result.rows[0].id.toString(); 

        pool.connect(function(err2, client2, done) {
          if(err2) {
            res.send('database_busy');
            return;
          }
          var insert_tag_query = "INSERT INTO quote_tag_table (tag_name) VALUES ('"+tag_name+"') RETURNING id;";

          client2.query(insert_tag_query, function(err2, result) {
            //call `done(err2)` to release the client back to the pool (or destroy it if there is an err2or)
            done(err2);

            if(err2) {
              return 'database_entry_failed';
            }

            //output: 1
            var new_tag_id = result.rows[0].id.toString();
            
            res.send(insertQuote(quote, quote_by, new_user_id, new_tag_id));

          });
        });
      });
    });

  } else {

    res.send(insertQuote(quote, quote_by, user_id, tag_id));
    //res.send("third block");
    return;
  }

});

app.get('/quote2/add-quote', function (req, res) {
  res.sendFile(path.join(__dirname, 'quote2/html', 'add_new.html'));
});

app.get('/quote2/css/style2.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'quote2/css', 'style2.css'));
});

app.get('/quote2/js/script.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'quote2/js', 'script.js'));
});

app.get('/quote2/js/script2.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'quote2/js', 'script2.js'));
});

app.get('/quote2/images/favicon.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'quote2/images', 'favicon.png'));
});

// end of quote2




app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
