import { Head } from '@inertiajs/react';
import ClientForm from '@/components/clients/client-form';
import Heading from '@/components/heading';
import { create, index, store } from '@/routes/clients';
import type { ClientTypeOption } from '@/types';

export default function CreateClient({ types }: { types: ClientTypeOption[] }) {
    return (
        <>
            <Head title="Novo cliente" />
            <div className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6">
                <Heading
                    title="Novo cliente"
                    description="Registe a identificação, os contactos e a morada de faturação."
                />
                <ClientForm
                    types={types}
                    submitUrl={store.url()}
                    method="post"
                />
            </div>
        </>
    );
}

CreateClient.layout = {
    breadcrumbs: [
        { title: 'Clientes', href: index() },
        { title: 'Novo cliente', href: create() },
    ],
};
