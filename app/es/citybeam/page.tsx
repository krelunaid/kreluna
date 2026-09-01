import CityBeamLanding, { cityBeamMetadata } from "../../citybeam/citybeam-landing";
export const metadata = cityBeamMetadata("es");
export default function Page() { return <CityBeamLanding locale="es" />; }
