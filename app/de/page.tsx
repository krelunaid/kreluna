import ProjectHub, { projectHubMetadata } from "../project-hub";
export const metadata = projectHubMetadata("de");
export default function Page() { return <ProjectHub locale="de" />; }
