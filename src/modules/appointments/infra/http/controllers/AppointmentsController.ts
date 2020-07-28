import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
	public async create(req: Request, res: Response): Promise<Response> {
		const { provider_id, date } = req.body;

		const createAppointment = container.resolve(CreateAppointmentService);

		const appointment = await createAppointment.execute({
			provider_id,
			user_id: req.user.id,
			date,
		});
		return res.json({ message: 'appointment-add-success', appointment });
	}
}
