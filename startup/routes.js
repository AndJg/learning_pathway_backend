const userRouter = require('../routes/userRoutes');
const taskRouter = require('../routes/taskRouter');
const pathRouter = require('../routes/pathRoutes');


module.exports = app => {
    app.use('/api/users', userRouter);
    app.use('/api/task', taskRouter);
    app.use('/api/path', pathRouter);
};
