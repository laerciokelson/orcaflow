import { Head } from '@inertiajs/react';
import ClientForm from '@/components/clients/client-form';
import Heading from '@/components/heading';
import { index, update } from '@/routes/clients';
import type { ClientDetails, ClientTypeOption } from '@/types';

export default function EditClient({
    client,
    types,
}: {
    client: ClientDetails;
    types: ClientTypeOption[];
}) {
    return (
        <>
            <Head title={`Editar ${client.display_name}`} />
            <div className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6">
                <Heading
                    title="Editar cliente"
                    description="Atualize os dados de identificação, contactos e faturação."
                />
                <ClientForm
                    client={client}
                    types={types}
                    submitUrl={update.url(client.id)}
                    method="put"
                />
            </div>
        </>
    );
}

EditClient.layout = {
    breadcrumbs: [{ title: 'Clientes', href: index() }],
};
