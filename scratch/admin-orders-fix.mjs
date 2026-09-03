import fs from 'fs';
let content = fs.readFileSync('src/app/admin/orders/page.tsx', 'utf8');

// Update status options
content = content.replace(
`const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];`,
`const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "packed", label: "Packed" },
  { value: "dispatched", label: "Dispatched" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];`
);

// Update status select dropdown in the row
content = content.replace(
`<option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>`,
`<option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>`
);

// Add approve/reject cancellation handlers
const handlerCode = `
  const handleStatusChange = async (orderId: number, newStatus: string) => {
`;
const newHandlerCode = `
  const handleCancellation = async (orderId: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await supabase.from('orders').update({
          cancellation_status: 'approved',
          status: 'cancelled'
        }).eq('id', orderId);
        toast.success("Cancellation approved");
      } else {
        await supabase.from('orders').update({
          cancellation_status: 'rejected'
        }).eq('id', orderId);
        toast.success("Cancellation rejected");
      }
      fetchOrders();
    } catch (error) {
      toast.error("Failed to process cancellation");
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
`;
content = content.replace(handlerCode, newHandlerCode);

// Add cancellation request UI in the row
const cancelUI = `
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 border-t lg:border-t-0 lg:border-l border-[#D4AF37]/20 pt-4 lg:pt-0 lg:pl-6">
                    {order.cancellation_status === 'requested' && (
                      <div className="flex flex-col gap-1 w-full lg:w-auto px-2 py-1 bg-red-50 border border-red-200">
                        <span className="text-[9px] font-bold text-red-600 uppercase">Cancellation Requested:</span>
                        <span className="text-[10px] text-red-800 italic line-clamp-1">{order.cancellation_reason}</span>
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => handleCancellation(order.id, 'approve')} className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-bold uppercase rounded-sm">Approve</button>
                          <button onClick={() => handleCancellation(order.id, 'reject')} className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[8px] font-bold uppercase rounded-sm">Reject</button>
                        </div>
                      </div>
                    )}
                    <div className="relative border border-[#D4AF37]/30 bg-transparent h-10 flex items-center min-w-[140px] flex-1 sm:flex-none">
`;

content = content.replace(
  '<div className="flex flex-wrap sm:flex-nowrap items-center gap-3 border-t lg:border-t-0 lg:border-l border-[#D4AF37]/20 pt-4 lg:pt-0 lg:pl-6">\n                    <div className="relative border border-[#D4AF37]/30 bg-transparent h-10 flex items-center min-w-[140px] flex-1 sm:flex-none">',
  cancelUI
);

// Display order ID logic
content = content.replace('Order #{order.id}', '{order.display_id || `Order #${order.id}`}');

fs.writeFileSync('src/app/admin/orders/page.tsx', content);
