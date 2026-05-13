import { PlaceholderPage } from "@/components/portal/PlaceholderPage";

export default function AdminContractDetailPage({ params }: { params: { id: string } }) {
  return <PlaceholderPage title={`Contract ${params.id}`} description="Contract editor placeholder: included services, monthly price, start/end date, bundle source, pause/cancel/complete controls, and PDF export placeholder." actions={["Edit contract", "Generate summary"]} />;
}
