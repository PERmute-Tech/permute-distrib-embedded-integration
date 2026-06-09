import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <div className="crumbs">Souscriptions / Page introuvable</div>
      <div className="error-box">
        <h2>Page introuvable</h2>
        <p>
          Ce simulateur de CRM partenaire est disponible en développement et
          préproduction uniquement.
        </p>
        <p>
          <Link href="/">← Retour au dossier de souscription</Link>
        </p>
      </div>
    </main>
  );
}
