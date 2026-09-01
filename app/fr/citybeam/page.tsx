import CityBeamLanding, { cityBeamMetadata } from "../../citybeam/citybeam-landing";
export const metadata = cityBeamMetadata("fr");
export default function Page() { return <CityBeamLanding locale="fr" />; }
