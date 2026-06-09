import { DEMO_ADVISOR } from '@/features/crm/demoAdvisor';

const SUBSCRIPTION_STEPS = [
  { label: 'Profil du client', state: 'done' },
  { label: 'Choix du contrat PER', state: 'done' },
  { label: 'Transfert de contrat', state: 'current' },
  { label: 'Signature & versement', state: 'todo' },
] as const;

export default function CrmHomePage() {
  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="mark" />
          Patrimoine Conseil
        </div>
        <nav>
          <span>Tableau de bord</span>
          <span>Clients</span>
          <span className="active">Souscriptions</span>
          <span>Documents</span>
        </nav>
      </header>

      <main className="page">
        <div className="crumbs">
          Souscriptions / Dossier #PER-2026-0481 / Transfert de contrat
        </div>

        <div className="steps">
          {SUBSCRIPTION_STEPS.map((step) => (
            <div key={step.label} className={`step ${step.state}`}>
              {step.label}
            </div>
          ))}
        </div>

        <section className="card">
          <h2>Dossier de souscription PER</h2>
          <div className="grid">
            <div className="field">
              <label>Client</label>
              <div className="value">
                {DEMO_ADVISOR.firstName} {DEMO_ADVISOR.lastName}
              </div>
            </div>
            <div className="field">
              <label>Référence dossier</label>
              <div className="value">PER-2026-0481</div>
            </div>
            <div className="field">
              <label>Contrat PER souscrit</label>
              <div className="value">PER Patrimoine Évolution</div>
            </div>
            <div className="field">
              <label>Conseiller</label>
              <div className="value">{DEMO_ADVISOR.email}</div>
            </div>
          </div>
        </section>

        <section className="card transfer-cta">
          <h2>Transférer un contrat existant</h2>
          <p>
            Votre client souhaite transférer un PER, PERP ou Madelin existant
            vers son nouveau contrat ? Lancez le parcours de transfert sécurisé.
            Le dossier sera pré-rempli et votre client reviendra ici une fois la
            demande finalisée.
          </p>
          <form
            method="POST"
            action="/api/launch"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn" type="submit">
              Démarrer le transfert PMD →
            </button>
          </form>
          <div className="notice">
            Simulateur de CRM partenaire — disponible en développement et
            préproduction uniquement.
          </div>
        </section>
      </main>
    </>
  );
}
