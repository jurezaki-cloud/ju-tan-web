import PageHeader from "@/components/platform/PageHeader";
import ProjectsTable from "@/components/platform/tables/ProjectsTable";
import PageState from "@/components/platform/PageState";
import { getProjects } from "@/src/api/projects";

export default async function ProjectsPage() {
  const result = await getProjects();
  const status = !result.ok ? "error" : result.data.length === 0 ? "empty" : "ready";

  return (
    <>
      <PageHeader
        title="Projekti"
        description="Status, napredek, odgovorna oseba, rok in prioriteta."
      />
      <PageState
        status={status}
        emptyTitle="Ni projektov"
        emptyDescription="Seznam projektov je prazen."
        errorDescription={result.ok ? undefined : result.error}
      >
        {result.ok ? <ProjectsTable rows={result.data} /> : null}
      </PageState>
    </>
  );
}
