"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Activity,
  Settings,
} from "lucide-react";
import { adminProductService } from "@/services/admin/adminProductService";
import { adminOrderService } from "@/services/admin/adminOrderService";
import { adminUserService } from "@/services/admin/adminUserService";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";

interface DashboardStats {
  products: {
    total: number;
    lowStock: number;
    totalValue: number;
  };
  orders: {
    total: number;
    revenue: number;
    averageValue: number;
    pending: number;
  };
  users: {
    total: number;
    active: number;
    admins: number;
    newThisMonth: number;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading, error: adminError } = useAdmin();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push("/dashboard");
      return;
    }

    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin, adminLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all analytics data in parallel
      const [productAnalytics, orderAnalytics, userAnalytics] =
        await Promise.all([
          adminProductService.getProductAnalytics(),
          adminOrderService.getOrderAnalytics(),
          adminUserService.getUserAnalytics(),
        ]);

      setStats({
        products: {
          total: productAnalytics.totalProducts,
          lowStock: productAnalytics.lowStockCount,
          totalValue: productAnalytics.totalInventoryValue,
        },
        orders: {
          total: orderAnalytics.totalOrders,
          revenue: orderAnalytics.totalRevenue,
          averageValue: orderAnalytics.averageOrderValue,
          pending: orderAnalytics.ordersByStatus.pending || 0,
        },
        users: {
          total: userAnalytics.totalUsers,
          active: userAnalytics.activeUsers,
          admins: userAnalytics.totalAdmins,
          newThisMonth: userAnalytics.newUsersThisMonth,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (adminError || !isAdmin) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen container mx-auto py-16 px-4">
        <div className="bg-white border border-[#4A0E17]/20 p-8 max-w-md mx-auto shadow-sm text-center">
          <h2 className="font-serif text-2xl text-[#4A0E17] mb-4">Access Denied</h2>
          <p className="font-sans text-xs text-[#7A6B5D] mb-8">
            You don't have admin privileges to access this page.
          </p>
          <Link href="/dashboard">
            <button className="bg-[#2C1810] hover:bg-[#4A0E17] text-[#D4AF37] px-6 py-3 font-sans text-[9px] font-bold tracking-[0.2em] uppercase transition-colors">
              Go to User Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen container mx-auto py-16 px-4">
        <div className="bg-white border border-[#D4AF37]/20 p-8 max-w-md mx-auto shadow-sm text-center">
          <p className="font-sans text-xs text-[#7A6B5D]">Unable to load dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen pb-12">
      <div className="container mx-auto space-y-8 py-8 md:py-12 px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-[1px] bg-[#D4AF37]" />
              <span className="text-[8px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                Admin Panel
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-wide text-[#2C1810]" style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}>
              Sales Dashboard
            </h1>
            <p className="font-sans text-[11px] text-[#7A6B5D] tracking-wider uppercase mt-2">
              Welcome back, {user?.email}
            </p>
          </div>
          <div className="bg-white border border-[#D4AF37]/30 px-4 py-2 flex items-center gap-2 shadow-sm">
            <Activity className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#2C1810]">Live Overview</span>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Revenue */}
          <div className="bg-white border border-[#D4AF37]/20 p-6 flex flex-col hover:border-[#D4AF37]/50 transition-colors relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign className="h-24 w-24 text-[#D4AF37]" />
            </div>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D] mb-4">Total Revenue</span>
            <span className="font-serif text-3xl text-[#2C1810] tracking-wide">{formatCurrency(stats.orders.revenue)}</span>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#D4AF37]/10">
              <span className="text-[10px] text-[#7A6B5D] font-sans uppercase tracking-wider">{stats.orders.total} Total Orders</span>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white border border-[#D4AF37]/20 p-6 flex flex-col hover:border-[#D4AF37]/50 transition-colors relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="h-24 w-24 text-[#D4AF37]" />
            </div>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D] mb-4">Avg Order Value</span>
            <span className="font-serif text-3xl text-[#2C1810] tracking-wide">{formatCurrency(stats.orders.averageValue)}</span>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#D4AF37]/10">
              <span className="text-[10px] text-[#7A6B5D] font-sans uppercase tracking-wider">Per Transaction</span>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white border border-[#D4AF37]/20 p-6 flex flex-col hover:border-[#D4AF37]/50 transition-colors relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="h-24 w-24 text-[#D4AF37]" />
            </div>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D] mb-4">Total Users</span>
            <span className="font-serif text-3xl text-[#2C1810] tracking-wide">{stats.users.total}</span>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#D4AF37]/10">
              <span className="text-[10px] text-[#7A6B5D] font-sans uppercase tracking-wider">{stats.users.active} Active this month</span>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white border border-[#D4AF37]/20 p-6 flex flex-col hover:border-[#D4AF37]/50 transition-colors relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Package className="h-24 w-24 text-[#D4AF37]" />
            </div>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D] mb-4">Inventory Value</span>
            <span className="font-serif text-3xl text-[#2C1810] tracking-wide">{formatCurrency(stats.products.totalValue)}</span>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#D4AF37]/10">
              <span className="text-[10px] text-[#7A6B5D] font-sans uppercase tracking-wider">{stats.products.total} Products</span>
            </div>
          </div>
        </div>

        {/* Second Row: Recent Transactions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Transactions Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-[#2C1810] tracking-wide">Recent Transactions</h2>
              <Link href="/admin/orders" className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#D4AF37] hover:text-[#4A0E17] transition-colors">
                View All
              </Link>
            </div>
            <div className="bg-white border border-[#D4AF37]/20 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FFFCF7] border-b border-[#D4AF37]/20">
                      <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Order ID</th>
                      <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Customer</th>
                      <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Date</th>
                      <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D]">Status</th>
                      <th className="px-6 py-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#7A6B5D] text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.orders.recentOrders?.slice(0, 6).map((order) => (
                      <tr key={order.order_id} className="border-b border-[#D4AF37]/10 hover:bg-[#FFFCF7]/50 transition-colors">
                        <td className="px-6 py-4 font-sans text-xs text-[#2C1810]">
                          #{order.order_id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-sans text-xs font-semibold text-[#2C1810]">
                              {order.profile?.username || 'Guest'}
                            </span>
                            <span className="font-sans text-[10px] text-[#7A6B5D]">
                              {order.profile?.email || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-sans text-xs text-[#7A6B5D]">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[8px] font-bold tracking-[0.15em] uppercase px-2 py-1 ${
                            order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                            order.status === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-serif text-sm text-[#2C1810] text-right font-bold">
                          {formatCurrency(order.total)}
                        </td>
                      </tr>
                    ))}
                    {(!stats.orders.recentOrders || stats.orders.recentOrders.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-[#7A6B5D] font-sans text-sm">
                          No recent transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Alerts */}
          <div className="space-y-6">
            
            <div className="bg-white border border-[#D4AF37]/20 p-6">
              <h2 className="font-serif text-lg text-[#2C1810] tracking-wide mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <Link href="/admin/products" className="flex items-center gap-3 p-3 border border-[#D4AF37]/20 hover:bg-[#FFFCF7] hover:border-[#D4AF37] transition-all group">
                  <div className="bg-[#FDFBF7] p-2 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#2C1810]">Manage Products</span>
                </Link>
                <Link href="/admin/orders" className="flex items-center gap-3 p-3 border border-[#D4AF37]/20 hover:bg-[#FFFCF7] hover:border-[#D4AF37] transition-all group">
                  <div className="bg-[#FDFBF7] p-2 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <span className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#2C1810]">Manage Orders</span>
                </Link>
                <Link href="/admin/reviews" className="flex items-center gap-3 p-3 border border-[#D4AF37]/20 hover:bg-[#FFFCF7] hover:border-[#D4AF37] transition-all group">
                  <div className="bg-[#FDFBF7] p-2 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                    <Activity className="h-4 w-4" />
                  </div>
                  <span className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#2C1810]">Moderate Reviews</span>
                </Link>
              </div>
            </div>

            {stats.products.lowStock > 0 && (
              <div className="bg-[#4A0E17] text-white p-5 border border-[#4A0E17] shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-red-600/20 to-transparent pointer-events-none" />
                <div className="flex items-start gap-4 relative z-10">
                  <AlertTriangle className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg tracking-wide mb-1 text-[#D4AF37]">Inventory Alert</h3>
                    <p className="font-sans text-xs leading-relaxed opacity-90">
                      You have {stats.products.lowStock} products running critically low on stock. Please restock soon to prevent missed sales.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {stats.orders.pending > 0 && (
              <div className="bg-[#FDFBF7] p-5 border border-[#D4AF37]/30 shadow-sm">
                <div className="flex items-start gap-4">
                  <ShoppingCart className="h-5 w-5 text-[#2C1810] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg text-[#2C1810] tracking-wide mb-1">Pending Orders</h3>
                    <p className="font-sans text-xs text-[#7A6B5D] leading-relaxed">
                      You have {stats.orders.pending} orders waiting to be processed and shipped.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
