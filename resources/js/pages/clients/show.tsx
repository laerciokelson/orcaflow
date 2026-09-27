import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import StatusAction from '@/components/clients/status-action';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { edit, index, updateStatus } from '@/routes/clients';
import type { ClientDetails } from '@/types';

export default function ShowClient({ client }: { client: ClientDetails }) {
    return (
        <>
            <Head title={client.display_name} />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                        <Heading
                            title={client.display_name}
                            description={
                                client.type === 'individual'
                                    ? 'Cliente particular'
                                    : 'Cliente empresa'
                            }
                        />
                        <Badge
                            variant={
                                client.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                            }
                            data-test="client-status"
                        >
                            {client.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button asChild variant="outline">
                            <Link
                                href={edit(client.id)}
                                data-test="edit-client-link"
                            >
                                <Pencil />
                                Editar
                            </Link>
                        </Button>
                        <StatusAction
                            status={client.status}
                            url={updateStatus.url(client.id)}
                        />
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <InfoCard title="Identificação">
                        {client.type === 'company' && (
                            <Info
                                label="Nome da empresa"
                                value={client.legal_name}
                            />
                        )}
                        <Info
                            label={
                                client.type === 'company'
                                    ? 'Nome comercial'
                                    : 'Nome'
                            }
                            value={client.name}
                        />
                        <Info label="NIF" value={client.tax_number} />
                    </InfoCard>
                    <InfoCard title="Contactos">
                        <Info label="Email" value={client.email} />
                        <Info label="Telefone" value={client.phone} />
                        <Info label="Telemóvel" value={client.mobile} />
                    </InfoCard>
                    <InfoCard title="Morada de faturação">
                        <Info label="Morada" value={client.billing_address} />
                        <Info
                            label="Código postal"
                            value={client.billing_postal_code}
                        />
                        <Info label="Cidade" value={client.billing_city} />
                        <Info label="País" value={client.billing_country} />
                    </InfoCard>
                    <InfoCard title="Observações">
                        <Info label="Observações" value={client.notes} />
                    </InfoCard>
                </div>
            </div>
        </>
    );
}

function InfoCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
            </CardContent>
        </Card>
    );
}

function Info({ label, value }: { label: string; value: string | null }) {
    return (
        <div>
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {label}
            </dt>
            <dd className="mt-1 text-sm">{value || '—'}</dd>
        </div>
    );
}

ShowClient.layout = {
    breadcrumbs: [{ title: 'Clientes', href: index() }],
};
