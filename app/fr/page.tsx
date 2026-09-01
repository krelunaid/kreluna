import ProjectHub, { projectHubMetadata } from "../project-hub";
export const metadata = projectHubMetadata("fr");
export default function Page() { return <ProjectHub locale="fr" />; }
