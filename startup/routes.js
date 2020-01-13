const testRouter = require('../routes/test');
const mainRouter = require('../routes/mianRoutes');
const taskRouter = require('../routes/taskRouter');


module.exports = app => {
    app.use('/api/test', testRouter);
    app.use('/api/users', mainRouter);
    app.use('/api/task', taskRouter);
};
