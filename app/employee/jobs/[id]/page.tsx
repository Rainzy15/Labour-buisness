import { PlaceholderPage } from "@/components/portal/PlaceholderPage";

export default function EmployeeJobDetailPage({ params }: { params: { id: string } }) {
  return <PlaceholderPage title={`Job ${params.id}`} description="Mobile job detail placeholder: customer name, address, access notes, service details, checklist, before/after photo upload placeholders, completion note, and issue reporting." actions={["Started", "Completed", "Report issue"]} />;
}
