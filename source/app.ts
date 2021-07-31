import http from 'http';
import express from 'express';
import logging from './config/logging';
import config from './config/config';

const NAMESPACE = 'Server';
const app = express();

/** Logging the request */
app.use((req, res, next) => {
	logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

	res.on('finish', () => {
		logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
	});
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** Rules of our API */
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if (req.method === 'OPTION') {
		res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
		return res.status(200).json({});
	}
});

/** Routes */

/** Error Handling */
app.use((req, res, next) => {
	const error = new Error('not found');

	return res.status(404).json({
		message: error.message
	});
});

/** Create the server */
app.listen(config.server.port, () => {
	logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`);
});
