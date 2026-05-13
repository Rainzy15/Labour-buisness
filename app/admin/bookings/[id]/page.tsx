import { PlaceholderPage } from "@/components/portal/PlaceholderPage";

export default function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  return <PlaceholderPage title={`Booking ${params.id}`} description="Booking detail panel placeholder: customer info, address info, service requested, calculator breakdown, status timeline, assigned employee, notes, estimate vs final price, photos, and communication history." actions={["Assign employee", "Confirm booking", "Reschedule"]} />;
}
