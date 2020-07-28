import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
	constructor() {
		this.ormRepository = getRepository(Appointment);
	}

	private ormRepository: Repository<Appointment>;

	public async findByDate(
		date: Date,
		provider_id: string,
	): Promise<Appointment | undefined> {
		const findAppoinntment = await this.ormRepository.findOne({
			where: { date, provider_id },
		});

		return findAppoinntment;
	}

	public async findAllInMonthFromProvider({
		provider_id,
		month,
		year,
	}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
		const parsedMonth = String(month).padStart(2, '0');

		const findAppointments = await this.ormRepository.find({
			where: {
				provider_id,
				date: Raw(
					fieldName =>
						`to_char(${fieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
				),
			},
			order: { date: 'ASC' },
		});

		return findAppointments;
	}

	public async findAllInDayFromProvider({
		provider_id,
		day,
		month,
		year,
	}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
		const parsedDay = String(day).padStart(2, '0');
		const parsedMonth = String(month).padStart(2, '0');

		const findAppointments = await this.ormRepository.find({
			where: {
				provider_id,
				date: Raw(
					fieldName =>
						`to_char(${fieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
				),
			},
			order: { date: 'ASC' },
			relations: ['user'],
		});

		return findAppointments;
	}

	public async create({
		provider_id,
		user_id,
		date,
	}: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = this.ormRepository.create({
			provider_id,
			user_id,
			date,
		});

		await this.ormRepository.save(appointment);
		return appointment;
	}
}
export default AppointmentsRepository;
