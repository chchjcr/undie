import User from './models/user';
import express, {
	Request,
	Response,
	NextFunction
} from 'express';
import bcrypt from 'bcrypt';

const Package = require('../package.json');

const app = express();
const port = 8080;
const saltRounds = 10;

app.use(express.json());
app.use(express.urlencoded());
app.use((req: Request, res: Response, next: NextFunction): void => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	next();
});

app.get('/', (req: Request, res: Response): Response => {
	return res.send('Hello world');
});

app.post('/login', async (req: Request, res: Response): Promise<Response> => {
	let data = req.body;
	let { username, password } = data;
	try {
		await User.sync();
		let user = await User.findOne({
			where: { uniqueID: username.toLowerCase() }
		}).catch(() => {
			throw new Error('No such user ' + username);
		});
		if (!user) throw new Error('No such user ' + username);
		let hash = await user.password;
		if (!hash) throw new Error('Please reset your password');
		let verified = await bcrypt.compare(password, hash);
		if (!verified) throw new Error('Incorrect password');
		return res.sendStatus(204);
	} catch (e) {
		return res.status(400).send(JSON.stringify(e, null, 4));
	}
})

app.post('/register', async (req: Request, res: Response): Promise<Response> => {
	let data = req.body;
	let { username, password } = data;
	try {
		await User.sync();
		let uniqueID = username.toLowerCase();
		let existingUsers = await User.findAll({ where: { uniqueID: username.toLowerCase() }});
		if (existingUsers.length) throw new Error('Username ' + username + ' already exists!');
		await User.create({
			uniqueID, username,
			password: await bcrypt.hash(password, saltRounds)
		});
		return res.sendStatus(204);
	} catch (e) {
		return res.status(400).send(JSON.stringify(e, null, 4));
	}
})

Promise.resolve()
	.then(async () => {
		//TODO: Load Tournaments from database
	})
	.then(async () => {
		return new Promise((res) => app.listen(port, res));
	})
	.then(() => {
		console.log('Using v' + Package.version + ' of chess-swiss-backend');
		console.log(`App listening on port ${port}!`);
	});