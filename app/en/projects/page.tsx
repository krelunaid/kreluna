import ProjectHub, { projectHubMetadata } from '../../project-hub';
export const metadata = projectHubMetadata('en');
export default function Page() { return <ProjectHub locale="en" />; }
