module.exports = function(app){
  require('./users')(app);
  require('./home')(app);
};
