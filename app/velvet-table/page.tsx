import VelvetLanding from "./velvet-landing";
import { velvetMetadata } from "./velvet-seo";

export const metadata = velvetMetadata("it");

export default function VelvetTablePage() {
  return <VelvetLanding locale="it" />;
}
