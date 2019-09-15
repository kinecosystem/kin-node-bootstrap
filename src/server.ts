import {createApp} from "./app";
import {config} from "./config/environment";

createApp(config).then((app) => {
	const port = process.env.PORT || 3000;
	app.listen(port, () => console.log(`Listening on port ${port}...`));
});
