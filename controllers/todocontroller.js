var bodyparser = require('body-parser');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://user:password@mongodb.catalyst1.svc:27017/todos');
//mongoose.connect('mongodb://admin:admin@ds135532.mlab.com:35532/todolist');

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})

var mongoURLLabel, mongoURL, mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
var mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
var mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
console.log("service host and port", mongoHost, mongoPort);
var mongoDatabase = process.env.MONGO_DATABASE;
mongoDatabase = 'admin';
var mongoPassword = process.env.MONGO_ROOT_PASSWORD;
var mongoUser = process.env.MONGO_ROOT_USERNAME;
console.log("Username and password", mongoUser, mongoPassword);
    
if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }

  //mongoURL = 'mongodb://username:password@mongodb-service.default:27017/admin';
  
  console.log('To connect at %s', mongoURL);

  mongoose.connect(mongoURL,{ useNewUrlParser: true });
  //mongoose.connect('mongodb://user:password@mongodb.catalyst1.svc:27017/todos');

// Create Schema
var todoschema = new mongoose.Schema({
  item: String
});

// Create Model
var TodoModel = mongoose.model("Todo", todoschema);

// Save Item in Model
// var firstItem = TodoModel({ item: "Sachin Tendular"}).save(function(error) {
//   if(error) throw error;
//
//   console.log("Item Saved");
// })


var urlencodedparser = bodyparser.urlencoded({ extended: false}); // ??


module.exports = function(app) {

app.get('/todo', function(request, response) {
  // Get todos from MongoDB
  TodoModel.find({}, function(error, data) {
    if(error) throw error

    response.render("todo", {todos: data});
  });

  // Im Memory
  // response.render("todo", {todos: data});
});

app.post('/todo', urlencodedparser, function(request, response) {
  // Insert todo into MongoDB
  var newTodo = TodoModel(request.body).save(function(error, data){
    if(error) throw error

    response.json(data);
    // Variants
    //     response.send() // ?
    //     response.render() // ?
  });

  // In Memory
  // data.push(request.body)
  // response.json(data);
});

app.delete('/todo/:item', function(request, response) {
  // Delete todo from MongoDB
  TodoModel.find({item: request.params.item.replace(/\-/g, ' ')}).remove(function(error, data) {
    if(error) throw error

    response.json(data);
  });

  // In Memory
  // data = data.filter(function(todo) {
  //   return todo.item.replace(/ /g, '-') !== request.params.item;
  // });
  //
  // response.json(data); // ?
});

};
