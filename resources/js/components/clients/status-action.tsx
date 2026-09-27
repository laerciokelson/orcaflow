import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { ClientStatus } from '@/types';

export default function StatusAction({
    status,
    url,
}: {
    status: ClientStatus;
    url: string;
}) {
    const [processing, setProcessing] = useState(false);

    if (status === 'inactive') {
        return (
            <Button
                variant="outline"
                disabled={processing}
                data-test="activate-client"
                onClick={() => {
                    setProcessing(true);
                    router.patch(
                        url,
                        { status: 'active' },
                        { onFinish: () => setProcessing(false) },
                    );
                }}
            >
                Ativar cliente
            </Button>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" data-test="deactivate-client">
                    Desativar cliente
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desativar cliente?</DialogTitle>
                    <DialogDescription>
                        O cliente continuará disponível para consulta e poderá
                        ser reativado posteriormente.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        disabled={processing}
                        data-test="confirm-deactivate-client"
                        onClick={() => {
                            setProcessing(true);
                            router.patch(
                                url,
                                { status: 'inactive' },
                                { onFinish: () => setProcessing(false) },
                            );
                        }}
                    >
                        Confirmar desativação
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
