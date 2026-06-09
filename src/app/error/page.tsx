import Link from 'next/link';

type ErrorPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function LaunchErrorPage({
  searchParams,
}: ErrorPageProps) {
  const { reason } = await searchParams;

  return (
    <main className="page">
      <div className="crumbs">
        Souscriptions / Transfert de contrat / Erreur
      </div>
      <div className="error-box">
        <h2>Le lancement du transfert a échoué</h2>
        <p>
          Le simulateur n&apos;a pas pu créer le magic link. Vérifie que les
          endpoints (API distributeur, Keycloak) et le compte de service sont
          correctement renseignés dans <code>.env</code>.
        </p>
        {reason ? <pre>{reason}</pre> : null}
        <p>
          <Link href="/">← Retour au dossier de souscription</Link>
        </p>
      </div>
    </main>
  );
}
