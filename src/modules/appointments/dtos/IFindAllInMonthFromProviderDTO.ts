import { IMonthsDTO } from '@shared/dtos/IDateDTO';

export default interface IFindAllInMonthFromProviderDTO {
	provider_id: string;
	month: IMonthsDTO;
	year: number;
}
