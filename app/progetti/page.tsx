import ProjectHub, { projectHubMetadata } from "../project-hub";
export const metadata = projectHubMetadata("it");
export default function Page() { return <ProjectHub locale="it" />; }
