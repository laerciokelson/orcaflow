import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    ClientDetails,
    ClientFormData,
    ClientType,
    ClientTypeOption,
} from '@/types';

const emptyForm: ClientFormData = {
    type: 'individual',
    name: '',
    legal_name: '',
    tax_number: '',
    email: '',
    phone: '',
    mobile: '',
    billing_address: '',
    billing_postal_code: '',
    billing_city: '',
    billing_country: '',
    notes: '',
};

function initialData(client?: ClientDetails): ClientFormData {
    if (!client) {
        return emptyForm;
    }

    return {
        type: client.type,
        name: client.name ?? '',
        legal_name: client.legal_name ?? '',
        tax_number: client.tax_number ?? '',
        email: client.email ?? '',
        phone: client.phone ?? '',
        mobile: client.mobile ?? '',
        billing_address: client.billing_address ?? '',
        billing_postal_code: client.billing_postal_code ?? '',
        billing_city: client.billing_city ?? '',
        billing_country: client.billing_country ?? '',
        notes: client.notes ?? '',
    };
}

export default function ClientForm({
    client,
    types,
    submitUrl,
    method,
}: {
    client?: ClientDetails;
    types: ClientTypeOption[];
    submitUrl: string;
    method: 'post' | 'put';
}) {
    const form = useForm<ClientFormData>(initialData(client));
    const isCompany = form.data.type === 'company';

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.submit(method, submitUrl, { preserveScroll: true });
    }

    function changeType(type: ClientType) {
        form.setData((data) => ({
            ...data,
            type,
            legal_name: type === 'individual' ? '' : data.legal_name,
        }));
    }

    return (
        <form onSubmit={submit} className="space-y-8">
            <section className="space-y-4">
                <div>
                    <h2 className="text-base font-semibold">Tipo de cliente</h2>
                    <p className="text-sm text-muted-foreground">
                        Selecione o tipo para adaptar os dados de identificação.
                    </p>
                </div>
                <div className="grid gap-2 sm:max-w-sm">
                    <Label htmlFor="type">Tipo</Label>
                    <select
                        id="type"
                        data-test="client-type"
                        value={form.data.type}
                        onChange={(event) =>
                            changeType(event.target.value as ClientType)
                        }
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                        {types.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    <InputError message={form.errors.type} />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-base font-semibold">Identificação</h2>
                <div className="grid gap-5 md:grid-cols-2">
                    {isCompany && (
                        <Field
                            id="legal_name"
                            label="Nome da empresa"
                            required
                            value={form.data.legal_name}
                            error={form.errors.legal_name}
                            onChange={(value) =>
                                form.setData('legal_name', value)
                            }
                        />
                    )}
                    <Field
                        id="name"
                        label={isCompany ? 'Nome comercial' : 'Nome'}
                        required={!isCompany}
                        value={form.data.name}
                        error={form.errors.name}
                        onChange={(value) => form.setData('name', value)}
                    />
                    <Field
                        id="tax_number"
                        label="NIF"
                        value={form.data.tax_number}
                        error={form.errors.tax_number}
                        onChange={(value) => form.setData('tax_number', value)}
                    />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-base font-semibold">Contactos</h2>
                <div className="grid gap-5 md:grid-cols-3">
                    <Field
                        id="email"
                        label="Email"
                        type="email"
                        value={form.data.email}
                        error={form.errors.email}
                        onChange={(value) => form.setData('email', value)}
                    />
                    <Field
                        id="phone"
                        label="Telefone"
                        value={form.data.phone}
                        error={form.errors.phone}
                        onChange={(value) => form.setData('phone', value)}
                    />
                    <Field
                        id="mobile"
                        label="Telemóvel"
                        value={form.data.mobile}
                        error={form.errors.mobile}
                        onChange={(value) => form.setData('mobile', value)}
                    />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-base font-semibold">Morada de faturação</h2>
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="billing_address">Morada</Label>
                        <textarea
                            id="billing_address"
                            value={form.data.billing_address}
                            onChange={(event) =>
                                form.setData(
                                    'billing_address',
                                    event.target.value,
                                )
                            }
                            className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        />
                        <InputError message={form.errors.billing_address} />
                    </div>
                    <Field
                        id="billing_postal_code"
                        label="Código postal"
                        value={form.data.billing_postal_code}
                        error={form.errors.billing_postal_code}
                        onChange={(value) =>
                            form.setData('billing_postal_code', value)
                        }
                    />
                    <Field
                        id="billing_city"
                        label="Cidade"
                        value={form.data.billing_city}
                        error={form.errors.billing_city}
                        onChange={(value) =>
                            form.setData('billing_city', value)
                        }
                    />
                    <Field
                        id="billing_country"
                        label="País"
                        value={form.data.billing_country}
                        error={form.errors.billing_country}
                        onChange={(value) =>
                            form.setData('billing_country', value)
                        }
                    />
                </div>
            </section>

            <section className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="notes">Observações</Label>
                    <textarea
                        id="notes"
                        value={form.data.notes}
                        onChange={(event) =>
                            form.setData('notes', event.target.value)
                        }
                        className="min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                    <InputError message={form.errors.notes} />
                </div>
            </section>

            <div className="flex justify-end">
                <Button disabled={form.processing} data-test="save-client">
                    {form.processing ? 'A guardar…' : 'Guardar cliente'}
                </Button>
            </div>
        </form>
    );
}

function Field({
    id,
    label,
    value,
    error,
    required = false,
    type = 'text',
    onChange,
}: {
    id: keyof ClientFormData;
    label: string;
    value: string;
    error?: string;
    required?: boolean;
    type?: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                value={value}
                required={required}
                onChange={(event) => onChange(event.target.value)}
            />
            <InputError message={error} />
        </div>
    );
}
