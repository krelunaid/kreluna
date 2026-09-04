import Home, { homeMetadata } from "../home-localized";
export const metadata = homeMetadata("fr");
export default function Page() { return <Home locale="fr" />; }
