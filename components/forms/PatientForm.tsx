'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import CustomFormField from '../CustomFormField';
import SubmitButton from '../SubmitButton';
import { useState } from 'react';
import { UserFormValidation } from '@/lib/validation';
import { useRouter } from 'next/navigation';

export enum FormFieldType {
	INPUT = 'input',
	TEXTAREA = 'textarea',
	PHONE_INPUT = 'phoneInput',
	CHECKBOX = 'checkbox',
	DATE_PICKER = 'datePicker',
	SELECT = 'select',
	SKELETON = 'skeleton',
}

const PatientForm = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof UserFormValidation>>({
		resolver: zodResolver(UserFormValidation),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
		},
	});

	async function onSubmit({
		name,
		email,
		phone,
	}: z.infer<typeof UserFormValidation>) {
		setIsLoading(true);

		try {
			// const userData = { name, email, phone };
			// const user = await createUser(userData);
			// if (user) {
			// 	router.push(`/patients/${user.id}/register`);
			// }
		} catch (err) {
			console.log(err);
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 flex-1 '
			>
				<section className='mb-12 space-y-4'>
					<h1 className='header'>Hi There 👋</h1>
					<p className='text-dark-700'>Schedule your first appointment.</p>
				</section>

				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.INPUT}
					name={'name'}
					label={'Full Name'}
					placeholder={'John Doe'}
					iconSrc={'/assets/icons/user.svg'}
					iconAlt={'user'}
				/>

				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.INPUT}
					name={'email'}
					label={'Email'}
					placeholder={'johndoe@gmail.com'}
					iconSrc={'/assets/icons/email.svg'}
					iconAlt={'email'}
				/>

				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.PHONE_INPUT}
					name={'phone'}
					label={'Phone Number'}
					placeholder={'+91 876 287 7891'}
				/>

				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	);
};

export default PatientForm;