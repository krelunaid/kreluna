import CityBeamLanding, { cityBeamMetadata } from "../../citybeam/citybeam-landing";
export const metadata = cityBeamMetadata("en");
export default function Page() { return <CityBeamLanding locale="en" />; }
