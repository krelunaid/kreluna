import Home, { homeMetadata } from "../home-localized";
export const metadata = homeMetadata("es");
export default function Page() { return <Home locale="es" />; }
