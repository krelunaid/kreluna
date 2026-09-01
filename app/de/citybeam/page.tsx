import CityBeamLanding, { cityBeamMetadata } from "../../citybeam/citybeam-landing";
export const metadata = cityBeamMetadata("de");
export default function Page() { return <CityBeamLanding locale="de" />; }
