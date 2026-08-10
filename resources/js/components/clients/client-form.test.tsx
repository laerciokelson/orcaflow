import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ClientForm from '@/components/clients/client-form';

const types = [
    { value: 'individual' as const, label: 'Particular' },
    { value: 'company' as const, label: 'Empresa' },
];

describe('ClientForm', () => {
    it('adapts identification fields to the selected client type', async () => {
        const user = userEvent.setup();

        render(<ClientForm types={types} submitUrl="/clients" method="post" />);

        expect(screen.getByLabelText('Nome')).toBeRequired();
        expect(
            screen.queryByLabelText('Nome da empresa'),
        ).not.toBeInTheDocument();

        await user.selectOptions(screen.getByLabelText('Tipo'), 'company');

        expect(screen.getByLabelText('Nome da empresa')).toBeRequired();
        expect(screen.getByLabelText('Nome comercial')).not.toBeRequired();
        expect(screen.queryByLabelText('Nome')).not.toBeInTheDocument();
    });
});
