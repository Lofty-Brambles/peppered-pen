import "dotenv/config";

interface getParams {
	key: string;
	fall: string;
	imp?: boolean;
}

const errorHandler = ({ key, fall, imp = false }: getParams): void => {
	if (imp)
		throw new Error(
			`Config Error: ${key} is not defined. Please add it to the .env file to continue.`
		);
	else
		console.log(
			`Warning: ${key} is not defined. By default, ${fall} is used.`
		);
};

class EnvVars {
	private _getVars({ key, fall, imp = false }: getParams): string {
		const variable = process.env[key];
		errorHandler({ key, fall, imp });
		return variable ?? fall;
	}

	public _port: string;
	public url: string;
	public title: string;
	public author: string;

	constructor() {
		this._port = this._getVars({ key: "PORT", fall: "3000" });
		this.url = this._getVars({ key: "VERCEL_URL", fall: "" });
		this.title = this._getVars({ key: "TITLE", fall: "🌶 | Peppered Pen!" });
		this.author = this._getVars({ key: "AUTHOR", fall: "Lofty Brambles" });
	}

	public site(): string {
		const devURL = `http://localhost:${this._port}`;
		const prodURL = `http://${this.url}`;

		return import.meta.env.DEV ? devURL : prodURL;
	}
}

export const CONSTANTS = new EnvVars();
