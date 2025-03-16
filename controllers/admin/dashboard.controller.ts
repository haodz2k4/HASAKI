import OrderModel from "../../models/order.model";
import { Request, Response } from "express";

export const dashboard = async (req: Request, res: Response) => {
  try {
    const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

    const statusCounts = await OrderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const stats = orderStatuses.map(status => {
      const found = statusCounts.find(s => s._id === status);
      return { status, count: found ? found.count : 0 };
    });
    const totalOrders = await OrderModel.countDocuments();

    const orders = await OrderModel.find({ status: "delivered" });

    let totalRevenue = 0;
    for (const order of orders) {
      let orderTotal = order.products.reduce((sum, item) => {
        return sum + (item.price * (100 - item.discountPercentage) / 100) * item.quantity;
      }, 0);
      orderTotal += order.shippingCost;
      totalRevenue += orderTotal;
    }

    const paymentStats = await OrderModel.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
    ]);

    // Thống kê đơn hàng theo tháng
    const monthlyOrders = await OrderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const bestSellingProducts = await OrderModel.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.render("admin/pages/dashboard/dashboard.pug", {
      pageTitle: "Dashboard",
      activePages: "dashboard",
      stats,
      totalOrders,
      totalRevenue,
      paymentStats,
      monthlyOrders,
      bestSellingProducts
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê đơn hàng:", error);
    res.render("admin/pages/dashboard/dashboard.pug", {
      pageTitle: "Dashboard",
      activePages: "dashboard",
      stats: [],
      totalOrders: 0,
      totalRevenue: 0,
      paymentStats: [],
      monthlyOrders: [],
      bestSellingProducts: []
    });
  }
};
