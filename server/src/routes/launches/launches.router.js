const express = require('express');
const {httpGetAllLaunches, httpAddNweLaunch, httpAbortLaunch} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNweLaunch);
launchesRouter.delete('/:id',httpAbortLaunch);

module.exports=launchesRouter;