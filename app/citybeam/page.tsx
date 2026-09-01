import CityBeamLanding, { cityBeamMetadata } from "./citybeam-landing";
export const metadata = cityBeamMetadata("it");
export default function Page() { return <CityBeamLanding locale="it" />; }
