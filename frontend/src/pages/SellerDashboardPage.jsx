import React from "react";
import {
  useGetMyShopQuery,
  useGetMyShopOrdersQuery,
  useSettleShopOrderMutation,
} from "../services/shopApi";
import { motion } from "framer-motion";
import AddProductModal from "../components/shop/AddProductModal";

const SellerDashboardPage = () => {
  const { data: shopData, isLoading: isShopLoading } = useGetMyShopQuery();
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    refetch,
  } = useGetMyShopOrdersQuery();
  const [settleOrder, { isLoading: isSettling }] = useSettleShopOrderMutation();

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const shop = shopData?.data;
  const orders = ordersData?.data;

  const handleSettle = async (orderId) => {
    try {
      await settleOrder(orderId).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to settle order:", err);
    }
  };

  if (isShopLoading || isOrdersLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Quản lý Cửa hàng
            </h1>
            <p className="mt-2 text-gray-500">
              Chào mừng trở lại,{" "}
              <span className="font-bold text-amber-600">{shop?.name}</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">
                Số dư khả dụng
              </p>
              <p className="text-3xl font-black text-amber-600">
                {shop?.balance?.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm Sản phẩm
              </button>
              <button className="px-6 py-2 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
                Rút tiền
              </button>
            </div>
          </div>
        </header>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProductCreated={() => {
            // Optional: if shop data or products list needs to update, we can call refetch here.
            // Usually, invalidatesTags is enough in RTK Query.
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
              Tổng Đơn hàng
            </p>
            <p className="text-4xl font-black text-gray-900 mt-2">
              {orders?.length || 0}
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
              Đơn hàng hoàn tất
            </p>
            <p className="text-4xl font-black text-green-600 mt-2">
              {orders?.filter((o) => o.status === "DELIVERED").length || 0}
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
              Doanh thu tạm tính
            </p>
            <p className="text-4xl font-black text-blue-600 mt-2">
              {orders
                ?.reduce((sum, o) => sum + o.sellerEarning, 0)
                .toLocaleString("vi-VN")}
              đ
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Danh sách Đơn hàng
            </h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                Cần xử lý
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-8 py-4">Đơn hàng</th>
                  <th className="px-8 py-4">Khách hàng</th>
                  <th className="px-8 py-4">Sản phẩm</th>
                  <th className="px-8 py-4">Thực nhận</th>
                  <th className="px-8 py-4">Trạng thái</th>
                  <th className="px-8 py-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders?.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-900">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-semibold text-gray-900">
                        {order.order.user.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.order.user.phone}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        {order.orderItems.map((item) => (
                          <span
                            key={item.id}
                            className="text-sm text-gray-600 truncate max-w-xs"
                          >
                            • {item.product.name} (x{item.quantity})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-amber-600">
                        {order.sellerEarning?.toLocaleString("vi-VN")}đ
                      </p>
                      <p className="text-[10px] text-gray-400 italic">
                        (-{order.commissionFee?.toLocaleString("vi-VN")}đ phí
                        sàn)
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {order.status !== "DELIVERED" && (
                        <button
                          onClick={() => handleSettle(order.id)}
                          disabled={isSettling}
                          className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all disabled:opacity-50"
                        >
                          Xác nhận & Nhận tiền
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!orders || orders.length === 0) && (
              <div className="py-20 text-center">
                <p className="text-gray-400">Chưa có đơn hàng nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
