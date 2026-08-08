import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import InputError from '@/components/input-error';

describe('InputError', () => {
    it('renders a validation message', () => {
        render(<InputError message="Campo obrigatório" />);

        expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    });

    it('renders nothing without a message', () => {
        const { container } = render(<InputError />);

        expect(container).toBeEmptyDOMElement();
    });
});
