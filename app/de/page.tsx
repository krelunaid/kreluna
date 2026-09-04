import Home, { homeMetadata } from "../home-localized";
export const metadata = homeMetadata("de");
export default function Page() { return <Home locale="de" />; }
