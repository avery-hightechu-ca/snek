const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#DFFF00',
  }

  return response.json(data)
})
//--------------------------------------------------------------------------------------------------

// Handle POST request to '/move'
app.post('/move', (request, response) => {


  //get closest food object
var _x = request.body.you.body[0].x;
var _y = request.body.you.body[0].y;
var newpos = {
  x : _x,
  y : _y
}
  var nextmove = "";
  //console.log(request);
  var food = request.body.board.food;
  var target = food[0];
  var snake = [];



  // if the x values are not the same
  if (target.x != _x) { 
  // if the x value is greater then move
  if (target.x > _x) {
    nextmove = "right";
    //+1
  // if the x value is smaller then move
  } else if (target.x < _x) {
    nextmove = "left";
    //-1
    }
  } else {
    // if the y value is greater then move
    if (target.y > _y) {
      nextmove = "down";
      //+1
    // if the y value is smaller then move
    } else if (target.y < _y) {
      nextmove = "up";
      // -1
    }
  }

  if (nextmove == "up") {
    newpos.y = _y - 1;
  } else if (nextmove == "down") {
    newpos.y = _y + 1;
  } else if (nextmove == "left") {
    newpos.x = _x - 1;
  } else {
    newpos.x = _x + 1;
  }

  for(var i = 0; i < request.body.you.body.length; i += 1) {
    snake[i] = request.body.you.body[i];
    if (snake[i].x === newpos.x && snake[i].y === newpos.y) {

      
      //if colliding direction is left
      if (nextmove == "right") {
       var ran = Math.random();
       if (ran < 0.50) {
         nextmove = "up";
       } else  {
         nextmove = "down";
       }
   }
  

       //if colliding direction is left
       if (nextmove == "up") {
        var ran = Math.random();
        if (ran < 0.50) {
          nextmove = "left";
        } else  {
          nextmove = "right";
        }
    }

        //if colliding direction is left
        if (nextmove == "down") {
          var ran = Math.random();
          if (ran < 0.50) {
            nextmove = "left";
          } else  {
            nextmove = "right";
          }
      }
    

         //if colliding direction is left
         if (nextmove == "left") {
          var ran = Math.random();
          if (ran < 0.50) {
            nextmove = "up";
          } else  {
            nextmove = "down";
          }
      }
      
    }
 
    }
    
   
  

  console.log("current pos ",_x,_y);
  console.log("next pos",newpos.x,newpos.y);

  // Response data
  var data = {
    move: nextmove, // one of: ['up','down','left','right']
  }

  
  //console.log("food ",target.x,target.y);
  //console.log("snek ",_x,_y);
  return response.json(data)
})

//---------------------------------------------------------------------------------------------------------
app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
