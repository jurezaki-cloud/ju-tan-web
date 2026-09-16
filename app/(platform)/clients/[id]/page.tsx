import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/platform/PageHeader";
import SectionCard from "@/components/platform/SectionCard";
import StatusBadge, { statusTone } from "@/components/platform/StatusBadge";
import EmptyState from "@/components/platform/EmptyState";
import PageState from "@/components/platform/PageState";
import CRMTimeline from "@/components/platform/crm/CRMTimeline";
import CRMQuickActions from "@/components/platform/crm/CRMQuickActions";
import CRMEntityForm from "@/components/platform/crm/CRMEntityForm";
import { getClient, getClients } from "@/src/api/clients";
import { getProjectsByClient } from "@/src/api/projects";
import { getDocumentsByClient } from "@/src/api/documents";
import { contactService } from "@/src/services/ContactService";
import { leadService } from "@/src/services/LeadService";
import { opportunityService } from "@/src/services/OpportunityService";
import { activityService } from "@/src/services/ActivityService";
import { taskService } from "@/src/services/TaskService";
import { noteService } from "@/src/services/NoteService";
import { quoteService } from "@/src/services/QuoteService";
import { offerService } from "@/src/services/OfferService";
import { createOfferAction } from "@/src/services/offerActions";
import { crmService } from "@/src/services/CRMService";
import {
  createContactAction,
  createNoteAction,
  createOpportunityAction,
  createQuoteAction,
  createTaskAction,
  createActivityAction,
  updateClientAction,
} from "@/src/services/crmActions";
import { cardBodyClass, metaClass, textLinkClass, fieldClass, ctaBase, ctaSizes, ctaVariants } from "@/design";
import { cn } from "@/lib/utils";

type ClientProfilePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const result = await getClients();
  if (!result.ok) return [];
  return result.data.map((client) => ({ id: client.id }));
}

export default async function ClientProfilePage({ params }: ClientProfilePageProps) {
  const { id } = await params;
  const clientResult = await getClient(id);
  if (!clientResult.ok) notFound();
  const client = clientResult.data;

  const [projectsResult, documentsResult] = await Promise.all([
    getProjectsByClient(client.id),
    getDocumentsByClient(client.id),
  ]);
  const contacts = contactService.getByClientId(id);
  const leads = leadService.getByClientId(id);
  const opportunities = opportunityService.getByClientId(id);
  const activities = activityService.getByClientId(id);
  const tasks = taskService.getByClientId(id);
  const notes = noteService.getByClientId(id);
  const quotes = quoteService.getByClientId(id);
  const offers = offerService.getByClientId(id);
  const timeline = crmService.timeline(id);
  const suggestion = crmService.suggestNextActivity(id);
  const summary = crmService.summarizeTimeline(id);

  const status = !projectsResult.ok || !documentsResult.ok ? "error" : "ready";

  return (
    <>
      <PageHeader
        title={client.name}
        description={`${client.industry} · ${client.city}`}
        actions={
          <Link href="/clients" className={textLinkClass}>
            Nazaj na stranke
          </Link>
        }
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <CRMQuickActions clientId={id} />
        <div className="flex flex-wrap gap-2">
          <CRMEntityForm title="Kontakt" triggerLabel="Kontakt" action={createContactAction} hidden={{ clientId: id }} fields={[
            { name: "firstName", label: "Ime", required: true },
            { name: "lastName", label: "Priimek", required: true },
            { name: "email", label: "E-pošta" },
            { name: "phone", label: "Telefon" },
            { name: "role", label: "Vloga" },
          ]} />
          <CRMEntityForm title="Naloga" triggerLabel="Naloga" action={createTaskAction} hidden={{ clientId: id }} fields={[
            { name: "name", label: "Naloga", required: true },
            { name: "priority", label: "Prioriteta", defaultValue: "Srednja" },
            { name: "dueAt", label: "Rok", type: "date" },
          ]} />
          <CRMEntityForm title="Opomba" triggerLabel="Opomba" action={createNoteAction} hidden={{ clientId: id }} fields={[
            { name: "body", label: "Besedilo", type: "textarea", required: true },
          ]} />
          <CRMEntityForm title="Ponudba" triggerLabel="Ponudba" action={createQuoteAction} hidden={{ clientId: id }} fields={[
            { name: "title", label: "Naziv", required: true },
            { name: "amount", label: "Znesek" },
            { name: "currency", label: "Valuta", defaultValue: "EUR" },
          ]} />
          <CRMEntityForm title="Offer osnutek" triggerLabel="Offer tok" action={createOfferAction} hidden={{ clientId: id }} fields={[
            { name: "title", label: "Naziv" },
            { name: "notes", label: "Opombe", type: "textarea" },
          ]} />
        </div>
      </div>

      <PageState status={status} errorDescription="Povezanih zapisov ni bilo mogoče naložiti.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard title="Kontakt">
            <form action={updateClientAction} className="space-y-3">
              <input type="hidden" name="id" value={client.id} />
              <input className={fieldClass} name="name" defaultValue={client.name} />
              <input className={fieldClass} name="contactName" defaultValue={client.contactName} />
              <input className={fieldClass} name="email" defaultValue={client.email} />
              <input className={fieldClass} name="phone" defaultValue={client.phone} />
              <input className={fieldClass} name="industry" defaultValue={client.industry} />
              <input className={fieldClass} name="city" defaultValue={client.city} />
              <button type="submit" className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}>
                Shrani
              </button>
            </form>
            <div className="mt-3">
              <StatusBadge label={client.status} tone={statusTone(client.status)} />
            </div>
          </SectionCard>

          <SectionCard title="Opombe">
            {(!notes.ok || notes.data.length === 0) && client.notes.length === 0 ? (
              <EmptyState title="Ni opomb" description="Za to stranko ni zabeleženih opomb." />
            ) : (
              <ul className="space-y-2">
                {notes.ok
                  ? notes.data.map((note) => (
                      <li key={note.id} className={cardBodyClass}>
                        {note.body}
                      </li>
                    ))
                  : client.notes.map((note) => (
                      <li key={note} className={cardBodyClass}>
                        {note}
                      </li>
                    ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Kontakti">
            {!contacts.ok || contacts.data.length === 0 ? (
              <EmptyState title="Ni kontaktov" description="Dodajte kontakt osebe." />
            ) : (
              <ul className="space-y-2">
                {contacts.data.map((item) => (
                  <li key={item.id} className={cardBodyClass}>
                    {item.firstName} {item.lastName} · {item.email}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Leadi">
            {!leads.ok || leads.data.length === 0 ? (
              <EmptyState title="Ni leadov" description="Ni povezanih leadov." />
            ) : (
              <ul className="space-y-2">
                {leads.data.map((item) => (
                  <li key={item.id} className={cardBodyClass}>
                    {item.name} · {item.status}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Priložnosti">
            <div className="mb-3">
              <CRMEntityForm title="Priložnost" triggerLabel="Dodaj" action={createOpportunityAction} hidden={{ clientId: id }} fields={[
                { name: "name", label: "Ime", required: true },
                { name: "amount", label: "Znesek" },
                { name: "stage", label: "Faza", defaultValue: "Kvalifikacija" },
              ]} />
            </div>
            {!opportunities.ok || opportunities.data.length === 0 ? (
              <EmptyState title="Ni priložnosti" description="Ni opportunity zapisov." />
            ) : (
              <ul className="space-y-2">
                {opportunities.data.map((item) => (
                  <li key={item.id} className={cardBodyClass}>
                    {item.name} · {item.stage} · {item.amount}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Aktivnosti">
            <div className="mb-3">
              <CRMEntityForm title="Aktivnost" triggerLabel="Dodaj" action={createActivityAction} hidden={{ clientId: id }} fields={[
                { name: "subject", label: "Zadeva", required: true },
                { name: "type", label: "Tip", defaultValue: "call" },
              ]} />
            </div>
            {!activities.ok || activities.data.length === 0 ? (
              <EmptyState title="Ni aktivnosti" description="Ni zabeleženih aktivnosti." />
            ) : (
              <ul className="space-y-2">
                {activities.data.map((item) => (
                  <li key={item.id} className={cardBodyClass}>
                    {item.subject ?? item.name} · {item.status}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Naloge">
            {!tasks.ok || tasks.data.length === 0 ? (
              <EmptyState title="Ni nalog" description="Ni nalog za to stranko." />
            ) : (
              <ul className="space-y-2">
                {tasks.data.map((item) => (
                  <li key={item.id} className={cardBodyClass}>
                    {item.name} · {item.priority} · {item.dueAt ?? item.due}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Ponudbe">
            {!quotes.ok || quotes.data.length === 0 ? (
              <EmptyState title="Ni quote zapisov" description="Ni CRM quote zapisov za to stranko." />
            ) : (
              <ul className="space-y-2">
                {quotes.data.map((item) => (
                  <li key={item.id} className={cardBodyClass}>
                    {item.title ?? item.name} · {item.amount} {item.currency}
                  </li>
                ))}
              </ul>
            )}
            <p className={`mt-3 ${metaClass}`}>Offer tok</p>
            {!offers.ok || offers.data.length === 0 ? (
              <p className={metaClass}>Ni povezanih ponudb.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {offers.data.map((item) => (
                  <li key={item.id} className={cardBodyClass}>
                    <Link href={`/crm/offers/${item.id}`} className={textLinkClass}>
                      {item.number} · {item.title}
                    </Link>
                    <span className={`ml-2 ${metaClass}`}>{item.status} · {item.total} {item.currency}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Projekti">
            {!projectsResult.ok || projectsResult.data.length === 0 ? (
              <EmptyState title="Ni projektov" description="Za to stranko ni projektov." />
            ) : (
              <ul className="space-y-3">
                {projectsResult.data.map((project) => (
                  <li key={project.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-medium text-white light:text-slate-900">{project.name}</p>
                      <p className={metaClass}>
                        {project.owner} · {project.due}
                      </p>
                    </div>
                    <StatusBadge label={project.status} tone={statusTone(project.status)} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Dokumenti">
            {!documentsResult.ok || documentsResult.data.length === 0 ? (
              <EmptyState title="Ni dokumentov" description="Za to stranko ni datotek." />
            ) : (
              <ul className="space-y-3">
                {documentsResult.data.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] text-white light:text-slate-900">{doc.name}</p>
                      <p className={metaClass}>
                        {doc.folder} · {doc.updated}
                      </p>
                    </div>
                    <StatusBadge label={doc.kind} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Časovnica">
            {timeline.ok ? <CRMTimeline entries={timeline.data} /> : <EmptyState title="Ni časovnice" description="Ni dogodkov." />}
            <p className={`mt-3 ${metaClass}`}>{suggestion.ok ? `Naslednji korak: ${suggestion.data.subject}` : ""}</p>
            <p className={`mt-2 ${cardBodyClass}`}>{summary.ok ? summary.data : ""}</p>
          </SectionCard>
        </div>
      </PageState>
    </>
  );
}
