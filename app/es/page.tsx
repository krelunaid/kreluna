import ProjectHub, { projectHubMetadata } from "../project-hub";
export const metadata = projectHubMetadata("es");
export default function Page() { return <ProjectHub locale="es" />; }
