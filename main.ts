export class SSKV<TData extends Record<string, unknown>> {
	private readonly defaultData: TData;
	private data: TData;
	private readonly _load?: () => TData;
	private readonly _save?: (currentData: TData, defaultData: TData) => void;

	constructor(
		defaultData: Required<TData>,
		persistence?: {
			load?: () => TData;
			save?: (currentData: TData, defaultData: TData) => void;
		}
	) {
		this.defaultData = defaultData;
		this.data = defaultData;
		this._load = persistence?.load;
		this._save = persistence?.save;
		if (persistence?.load !== undefined) {
			this.load();
		}
	}

	public load() {
		if (this._load === undefined) {
			console.warn(
				"SSKV WARN: load undefined in constructor, cannot performing load operation"
			);
		} else {
			this.data = this._load();
		}
		return this;
	}

	public save() {
		if (this._save === undefined) {
			console.warn(
				"SSKV WARN: save undefined in constructor, cannot performing save operation"
			);
		} else {
			this._save(this.data, this.defaultData);
		}
		return this;
	}

	public get<TKey extends keyof TData>(key: TKey, load = false) {
		if (load) {
			this.load();
		}
		if (key in this.data) {
			return this.data[key];
		}
		return this.defaultData[key];
	}

	public set<TKey extends keyof TData>(
		key: TKey,
		value: TData[TKey],
		save = false
	) {
		this.data[key] = value;
		if (save) {
			this.save();
		}
		return this;
	}
}
