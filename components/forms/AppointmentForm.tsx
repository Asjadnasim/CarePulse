'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import CustomFormField from '../CustomFormField';
import SubmitButton from '../SubmitButton';
import { Dispatch, SetStateAction, useState } from 'react';
import { getAppointmentSchema } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { FormFieldType } from './PatientForm';
import { Doctors } from '@/constants';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import { Appointment } from '@/types/appwrite.types';
import {
	createAppointment,
	updateAppointment,
} from '@/lib/actions/appointment.actions';

const AppointmentForm = ({
	userId,
	patientId,
	type,
	appointment,
	setOpen,
}: {
	userId: string;
	patientId: string;
	appointment?: Appointment;
	type: 'create' | 'cancel' | 'schedule';
	setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const AppointedFormValidation = getAppointmentSchema(type);

	const form = useForm<z.infer<typeof AppointedFormValidation>>({
		resolver: zodResolver(AppointedFormValidation),
		defaultValues: {
			primaryPhysician: appointment ? appointment?.primaryPhysician : '',
			schedule: appointment
				? new Date(appointment?.schedule!)
				: new Date(Date.now()),
			reason: appointment ? appointment.reason : '',
			note: appointment?.note || '',
			cancellationReason: appointment?.cancellationReason || '',
		},
	});

	async function onSubmit(values: z.infer<typeof AppointedFormValidation>) {
		setIsLoading(true);

		let status;
		switch (type) {
			case 'schedule':
				status = 'scheduled';
				break;
			case 'cancel':
				status = 'cancelled';
				break;
			default:
				status = 'pending';
		}

		try {
			if (type === 'create' && patientId) {
				const appointment = {
					userId,
					patient: patientId,
					primaryPhysician: values.primaryPhysician,
					schedule: new Date(values.schedule),
					reason: values.reason!,
					status: status as Status,
					note: values.note,
				};

				const newAppointment = await createAppointment(appointment);

				if (newAppointment) {
					form.reset();
					router.push(
						`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
					);
				}
			} else {
				const appointmentToUpdate = {
					userId,
					appointmentId: appointment?.$id!,
					appointment: {
						primaryPhysician: values.primaryPhysician,
						schedule: new Date(values.schedule),
						status: status as Status,
						cancellationReason: values.cancellationReason,
					},
					type,
				};

				const updatedAppointment = await updateAppointment(appointmentToUpdate);

				if (updatedAppointment) {
					setOpen && setOpen(false);
					form.reset();
				}
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	}

	let buttonLabel;

	switch (type) {
		case 'cancel':
			buttonLabel = 'Cancel Appointment';
			break;
		case 'create':
			buttonLabel = 'Create Appointment';
			break;
		case 'schedule':
			buttonLabel = 'Schedule Appointment';
			break;

		default:
			break;
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 flex-1 '
			>
				<section className='mb-12 space-y-4'>
					<h1 className='header'>New Appointment 📆</h1>
					<p className='text-dark-700'>
						Request a new appointment in 10 seconds.
					</p>
				</section>

				{type !== 'cancel' && (
					<>
						<CustomFormField
							fieldType={FormFieldType.SELECT}
							control={form.control}
							name='primaryPhysician'
							label='Doctor'
							placeholder='Select a doctor'
						>
							{Doctors.map((doctor, i) => (
								<SelectItem key={doctor.name + i} value={doctor.name}>
									<div className='flex cursor-pointer items-center gap-2'>
										<Image
											src={doctor.image}
											width={32}
											height={32}
											alt='doctor'
											className='rounded-full border border-dark-500'
										/>
										<p>{doctor.name}</p>
									</div>
								</SelectItem>
							))}
						</CustomFormField>

						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							control={form.control}
							name='schedule'
							label='Expected appointment date'
							showTimeSelect
							dateFormat='MM/dd/yyyy - h:mm aa'
						/>

						<div className='flex flex-col gap-6 xl:flex-row'>
							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								control={form.control}
								name='reason'
								label='Reason for appointment'
								placeholder='Enter reason for appointment'
							/>

							<CustomFormField
								fieldType={FormFieldType.TEXTAREA}
								control={form.control}
								name='note'
								label='Notes'
								placeholder='Enter notes '
							/>
						</div>
					</>
				)}

				{type === 'cancel' && (
					<CustomFormField
						fieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='cancellationReason'
						label='Reason for cancellation'
						placeholder='Enter reason for cancellation'
					/>
				)}

				<SubmitButton
					isLoading={isLoading}
					className={`${
						type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'
					} w-full`}
				>
					{buttonLabel}
				</SubmitButton>
			</form>
		</Form>
	);
};

export default AppointmentForm;
