const testRouter = require('../routes/test');
const userRouter = require('../routes/userRoutes');
const taskRouter = require('../routes/taskRouter');


module.exports = app => {
    app.use('/api/test', testRouter);
    app.use('/api/users', userRouter);
    app.use('/api/task', taskRouter);
};
