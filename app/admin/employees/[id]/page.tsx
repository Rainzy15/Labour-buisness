import { PlaceholderPage } from "@/components/portal/PlaceholderPage";

export default function AdminEmployeeDetailPage({ params }: { params: { id: string } }) {
  return <PlaceholderPage title={`Employee ${params.id}`} description="Employee profile placeholder: skills, hourly rate, assigned jobs, schedule, completed jobs, performance, issues, and status controls." actions={["Assign job", "Edit employee", "Disable employee"]} />;
}
