import { Head, Link, router } from '@inertiajs/react';
import { Search, UserPlus } from 'lucide-react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { create, index, show } from '@/routes/clients';
import type { ClientSummary, PaginatedClients } from '@/types';

export default function ClientsIndex({
    clients,
    filters,
}: {
    clients: PaginatedClients;
    filters: { search: string };
}) {
    function search(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const value = String(data.get('search') ?? '').trim();

        router.get(index.url(), value ? { search: value } : {}, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="Clientes" />
            <div className="space-y-6 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Clientes"
                        description="Consulte e mantenha os dados dos seus clientes."
                    />
                    <Button asChild>
                        <Link href={create()} data-test="create-client-link">
                            <UserPlus />
                            Novo cliente
                        </Link>
                    </Button>
                </div>

                <form
                    onSubmit={search}
                    className="flex max-w-xl flex-col gap-2 sm:flex-row"
                    role="search"
                >
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            name="search"
                            defaultValue={filters.search}
                            aria-label="Pesquisar clientes"
                            placeholder="Nome, NIF, email ou telefone"
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="outline">
                        Pesquisar
                    </Button>
                </form>

                {clients.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-14 text-center">
                            <h2 className="font-medium">
                                {filters.search
                                    ? 'Nenhum cliente encontrado'
                                    : 'Ainda não existem clientes'}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {filters.search
                                    ? 'Experimente pesquisar por outros dados.'
                                    : 'Crie o primeiro cliente para começar.'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="hidden overflow-hidden rounded-lg border md:block">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-left">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Nome
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Tipo
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            NIF
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Telefone
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {clients.data.map((client) => (
                                        <ClientRow
                                            key={client.id}
                                            client={client}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid gap-3 md:hidden">
                            {clients.data.map((client) => (
                                <ClientCard key={client.id} client={client} />
                            ))}
                        </div>

                        <Pagination clients={clients} />
                    </>
                )}
            </div>
        </>
    );
}

function ClientRow({ client }: { client: ClientSummary }) {
    return (
        <tr>
            <td className="px-4 py-3 font-medium">{client.display_name}</td>
            <td className="px-4 py-3">{typeLabel(client.type)}</td>
            <td className="px-4 py-3">{client.tax_number ?? '—'}</td>
            <td className="px-4 py-3">{client.email ?? '—'}</td>
            <td className="px-4 py-3">
                {client.phone ?? client.mobile ?? '—'}
            </td>
            <td className="px-4 py-3">
                <StatusBadge status={client.status} />
            </td>
            <td className="px-4 py-3 text-right">
                <Button asChild variant="ghost" size="sm">
                    <Link href={show(client.id)}>Consultar</Link>
                </Button>
            </td>
        </tr>
    );
}

function ClientCard({ client }: { client: ClientSummary }) {
    return (
        <Card>
            <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="font-medium">{client.display_name}</h2>
                        <p className="text-sm text-muted-foreground">
                            {typeLabel(client.type)} · NIF{' '}
                            {client.tax_number ?? '—'}
                        </p>
                    </div>
                    <StatusBadge status={client.status} />
                </div>
                <div className="text-sm text-muted-foreground">
                    <p>{client.email ?? 'Sem email'}</p>
                    <p>{client.phone ?? client.mobile ?? 'Sem telefone'}</p>
                </div>
                <Button asChild variant="outline" className="w-full">
                    <Link href={show(client.id)}>Consultar cliente</Link>
                </Button>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: ClientSummary['status'] }) {
    return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
    );
}

function Pagination({ clients }: { clients: PaginatedClients }) {
    if (clients.last_page === 1) {
        return null;
    }

    return (
        <nav
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            aria-label="Paginação"
        >
            <p className="text-sm text-muted-foreground">
                {clients.from}–{clients.to} de {clients.total} clientes
            </p>
            <div className="flex flex-wrap gap-1">
                {clients.links.map((link, position) => (
                    <Button
                        key={`${link.label}-${position}`}
                        asChild={Boolean(link.url)}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        disabled={!link.url}
                    >
                        {link.url ? (
                            <Link href={link.url} preserveScroll>
                                {link.label}
                            </Link>
                        ) : (
                            <span>{link.label}</span>
                        )}
                    </Button>
                ))}
            </div>
        </nav>
    );
}

function typeLabel(type: ClientSummary['type']): string {
    return type === 'individual' ? 'Particular' : 'Empresa';
}

ClientsIndex.layout = {
    breadcrumbs: [{ title: 'Clientes', href: index() }],
};
