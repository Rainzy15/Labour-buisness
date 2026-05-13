import { PlaceholderPage } from "@/components/portal/PlaceholderPage";

export default function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  return <PlaceholderPage title={`Customer ${params.id}`} description="Customer profile placeholder: bookings, contracts, invoices, addresses, admin notes, VIP/problematic flag, lifetime value, last service date, and create booking action." actions={["Create booking", "Add admin note"]} />;
}
