import express from 'express'
import fs, { createReadStream, stat } from 'fs'

import env from '../_environnement'
import { resolve } from 'path'
import { promisify } from 'util'

const router = express.Router();



router.use((req, res, next) => {
	if (!req.headers.range)
		return next(404);
	next();
});

router.get('/play', async (req, res) => {

	const readdir = fs.readdirSync(env.DIR);
	const video = resolve('videos', env.DIR + '/' + readdir[0]);

	const range = req.headers.range;

	const parts = range.replace('bytes=', '').split('-');
	const start = parseInt(parts[0], 10);

	const vstat = await promisify(stat)(video);
	const end = parts[1] ? parseInt(parts[1], 10): vstat.size - 1;

	res.setHeader('Content-Range', `bytes ${start}-${end}/${vstat.size}`);
	res.setHeader('Accept-Range', 'bytes');
	res.setHeader('Content-Length', (end - start) + 1)

	res.writeHead(206, {});

	createReadStream(video, {start, end}).pipe(res);

});

export default router;