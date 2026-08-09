import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth, name } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
                <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-400">
                        Gestão técnica
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                        {name}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                        Gestão de orçamentos e serviços técnicos, da visita
                        inicial à execução dos trabalhos.
                    </p>
                    <div className="mt-8">
                        <Link
                            href={auth.user ? dashboard() : login()}
                            className="inline-flex rounded-lg bg-sky-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-800 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-sky-600 dark:hover:bg-sky-500 dark:focus-visible:ring-offset-slate-900"
                        >
                            {auth.user ? 'Dashboard' : 'Log in'}
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
