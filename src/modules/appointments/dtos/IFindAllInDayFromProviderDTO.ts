import { IMonthsDTO } from '@shared/dtos/IDateDTO';

export default interface IFindAllInMonthFromProviderDTO {
	provider_id: string;
	day: number;
	month: IMonthsDTO;
	year: number;
}
