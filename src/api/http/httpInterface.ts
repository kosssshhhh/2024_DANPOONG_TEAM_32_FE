import { ICommunication } from './http';

export class HttpInterface {
	private defaultOptions: Record<string, any>;

	constructor(private apiClient: ICommunication) {
		this.apiClient = apiClient;
		this.defaultOptions = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
	}

	// 사용 예시
	// async getStyles(params: any) {
	// 	return this.apiClient.get('style/filter', { searchParams: params });
	// }
}
