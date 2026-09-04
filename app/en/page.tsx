import Home, { homeMetadata } from "../home-localized";
export const metadata = homeMetadata("en");
export default function Page() { return <Home locale="en" />; }
