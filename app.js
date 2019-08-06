var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const {
    actionssdk,
    Image,
  } = require('actions-on-google')

var port = process.env.PORT || 8888;
require('./config')(app);
app.get('/', function(req, res) {
    res.render('index.html');
});
const dialogflow = require('dialogflow');
const uuid = require('uuid');


var onlineUser=[];
io.on('connection', function(socket) {
    io.to(socket.id).emit('sendUserId', "Send ID");
    socket.on('setUserId', function(id) {
        var isPresent = 0;
        var index = 0;
        for (var i = 0; i < onlineUser.length; i++) {
            if (onlineUser[i].userId == id) {
                isPresent = 1;
                index = i;
                break;
            }
        }
        if (isPresent == 1) {
            onlineUser[index].socketId = socket.id;
        } else {
            var user = {};
            user['userId'] = id;
            user['socketId'] = socket.id;
            onlineUser.push(user);
        }
        console.log("Added: " + JSON.stringify(onlineUser));
    });
    socket.on('chat', function(msg) {
         console.log(msg);
      // io.to(socket.id).emit('chat message', msg);
      if (typeof msg != "undefined" &&
            typeof msg.userId != "undefined" &&
            typeof msg.message != "undefined"){
                if(msg.message=="call db"){
                    run();
                }else{
                    runSample(msg.message,msg.userId,function(messageContent){
                        for (var i = 0; i < onlineUser.length; i++) {
                            if (onlineUser[i].userId == messageContent.sessionId) {
                                io.to(onlineUser[i].socketId).emit('chat',
                                    messageContent.content);
                                break;
                            }
                        }
                    });
                }
            }else{
                socket.emit("UserId not matched");
            }

    });
    socket.on('disconnect',function(id){
        for (var i = 0; i < onlineUser.length; i++) {
            if (onlineUser[i].socketId == id) {
                onlineUser.splice(i, 1);
                break;
            }
        }
    })
});

async function runSample(content,sessionVal,callback) {
    // A unique identifier for the given session
    const sessionId = uuid.v4();
  
    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath("aatyacustomer", sessionId);
  
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: content,
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      },
    };
  
    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    var messageContent = {};
    messageContent['content'] = result.fulfillmentText;
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);    
        messageContent['intentName'] = result.intent.displayName;
    } else {
        console.log(`  No intent matched.`);
        messageContent['intentName'] = "No Intent Method";
    
    }
    messageContent['sessionId'] = sessionVal;
    callback(messageContent);
}

// Create an app instance
const appAction = actionssdk()

appAction.intent('actions.intent.TEXT', (conv, input) => {
  if (input === 'bye' || input === 'goodbye') {
    return conv.close('See you later!')
  }
  conv.ask(`I didn't understand. Can you tell me something else?`)
})

http.listen(port, function() {
    process.env.GOOGLE_APPLICATION_CREDENTIALS=__dirname+"/AatyaCustomer-12cc4659796c.json"
    console.log('cred value:' + process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('listening on *:' + port);
});
