export default interface ICacheProvider {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	save(key: string, value: any): Promise<void>;
	recover<T>(key: string): Promise<T | null>;
	invalidade(key: string): Promise<void>;
	invalidadePrefix(prefix: string): Promise<void>;
}
