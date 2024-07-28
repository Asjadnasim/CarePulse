'use server';

import { revalidatePath } from 'next/cache';
import { ID } from 'node-appwrite';

import {
	APPOINTMENT_COLLECTION_ID,
	DATABASE_ID,
	databases,
} from '../appwrite.config';
import { formatDateTime, parseStringify } from '../utils';

export const createAppointment = async (
	appointment: CreateAppointmentParams
) => {
	try {
		const newAppointment = await databases.createDocument(
			DATABASE_ID!,
			APPOINTMENT_COLLECTION_ID!,
			ID.unique(),
			appointment
		);

		revalidatePath('/admin');
		return parseStringify(newAppointment);
	} catch (error) {
		console.error('An error occurred while creating a new appointment:', error);
	}
};
