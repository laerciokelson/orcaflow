export type ClientType = 'individual' | 'company';
export type ClientStatus = 'active' | 'inactive';

export type ClientSummary = {
    id: number;
    display_name: string;
    type: ClientType;
    tax_number: string | null;
    email: string | null;
    phone: string | null;
    mobile: string | null;
    status: ClientStatus;
};

export type ClientDetails = ClientSummary & {
    name: string | null;
    legal_name: string | null;
    billing_address: string | null;
    billing_postal_code: string | null;
    billing_city: string | null;
    billing_country: string | null;
    notes: string | null;
};

export type ClientFormData = {
    type: ClientType;
    name: string;
    legal_name: string;
    tax_number: string;
    email: string;
    phone: string;
    mobile: string;
    billing_address: string;
    billing_postal_code: string;
    billing_city: string;
    billing_country: string;
    notes: string;
};

export type ClientTypeOption = {
    value: ClientType;
    label: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedClients = {
    data: ClientSummary[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};
