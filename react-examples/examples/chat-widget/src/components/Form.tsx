import { useRef } from 'react';

export default function Form({ onSubmit }: { onSubmit: (args: { name: string; email: string }) => void }) {
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);

	const handleFormData = () => {
		const name = nameRef.current?.value;
		const email = emailRef.current?.value;
		if (name && email) {
			onSubmit({ name, email });
		}
	};

	return (
		<div className="mx-auto rounded-md bg-white p-6 shadow-sm">
			<div className="space-y-4">
				<div className="relative">
					<input
						className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-blue-400 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						id="name"
						placeholder="Enter your name"
						type="text"
						ref={nameRef}
					/>
				</div>
				<div className="relative">
					<input
						className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-blue-400 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						id="email"
						placeholder="Enter your email"
						type="email"
						ref={emailRef}
					/>
				</div>
				<button
					className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					type="button"
					onClick={handleFormData}
				>
					Submit
				</button>
			</div>
		</div>
	);
}
