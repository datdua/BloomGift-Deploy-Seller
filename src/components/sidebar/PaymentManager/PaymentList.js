import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentByStore } from "../../../redux/actions/paymentActions";
import { fetchOrderById } from "../../../redux/actions/orderActions";
import { Button, Input, Select, Table, Empty, Image, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const PaymentList = () => {
    const dispatch = useDispatch();
    const payments = useSelector((state) => state.paymentData.payments) || [];
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const storeID = localStorage.getItem("storeID");

    useEffect(() => {
        dispatch(fetchPaymentByStore(storeID));
    }, [dispatch, storeID]);

    const showOrderDetails = async (orderID) => {
        try {
            const order = await dispatch(fetchOrderById(orderID));
            setSelectedOrder(order);
            setIsModalVisible(true);
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        }
    };

    const columns = [
        {
            title: "Mã thanh toán",
            dataIndex: "paymentID",
            key: "paymentID",
            sorter: (a, b) => a.paymentID - b.paymentID,
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "orderID",
            key: "orderID",
            sorter: (a, b) => a.orderID - b.orderID,
            render: (orderID) => (
                <Button type="link" onClick={() => showOrderDetails(orderID)}>
                    {orderID}
                </Button>
            ),
        },
        {
            title: "Cửa hàng",
            dataIndex: "storeName",
            key: "storeName",
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "method",
            key: "method",
        },
        {
            title: "Ngân hàng",
            dataIndex: "bankName",
            key: "bankName",
            render: (text) => text || "Chưa cập nhật",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) =>
                price != null ? `${price.toLocaleString()} VNĐ` : "N/A",
            sorter: (a, b) => a.totalPrice - b.totalPrice,
        },
        {
            title: "Ảnh thanh toán",
            dataIndex: "paymentImage",
            key: "paymentImage",
            render: (image) =>
                image ? (
                    <Image
                        src={image}
                        alt="Payment proof"
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                        preview={{
                            maskClassName: "customize-mask",
                            mask: <div className="text-white">Xem</div>,
                        }}
                    />
                ) : (
                    "Chưa có ảnh"
                ),
        },
        {
            title: "Trạng thái",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (status) => (
                <span
                    className={`px-2 py-1 rounded ${status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    {status ? "Đã thanh toán" : "Đang chờ xác thực"}
                </span>
            ),
        },
        {
            title: "Ngày thanh toán",
            dataIndex: "paymentDate",
            key: "paymentDate",
            render: (date) =>
                date ? new Date(date).toLocaleString() : "Đang chờ xác thực",
            sorter: (a, b) => {
                if (!a.paymentDate) return -1;
                if (!b.paymentDate) return 1;
                return new Date(a.paymentDate) - new Date(b.paymentDate);
            },
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            render: (note) => note || "Không có ghi chú",
        },
    ];

    const filteredPayments = payments.filter(
        (payment) =>
            (payment.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.bankName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedStatus === "" ||
                payment.paymentStatus === (selectedStatus === "true"))
    );

    const customLocale = {
        triggerDesc: "Nhấn để sắp xếp giảm dần",
        triggerAsc: "Nhấn để sắp xếp tăng dần",
        cancelSort: "Nhấn để hủy sắp xếp",
        emptyText: (
            <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description="Không tìm thấy thanh toán"
            />
        ),
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Danh sách thanh toán</h1>
            <div
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}
            >
                <Select
                    defaultValue=""
                    style={{ width: 200 }}
                    onChange={(value) => setSelectedStatus(value)}
                    className="border-pink-500"
                >
                    <Option value="">Tất cả trạng thái</Option>
                    <Option value="true">Đã thanh toán</Option>
                    <Option value="false">Đang chờ xác thực</Option>
                </Select>
            </div>
            <Input
                placeholder="Tìm kiếm theo tên cửa hàng hoặc ngân hàng"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "20px", borderColor: "#F56285" }}
                suffix={<SearchOutlined className="text-lg text-gray-400" />}
            />
            <Table
                columns={columns}
                dataSource={filteredPayments}
                rowKey="paymentID"
                locale={customLocale}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} thanh toán`,
                }}
            />
            <Modal
                title="Thông tin chi tiết đơn hàng"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedOrder ? (
                    <div>
                        <p><strong>Mã đơn hàng:</strong> {selectedOrder.orderID}</p>
                        <p><strong>Giá:</strong> {selectedOrder.oderPrice.toLocaleString()} VNĐ</p>
                        <p><strong>Trạng thái:</strong> {selectedOrder.orderStatus}</p>
                        <p><strong>Ghi chú:</strong> {selectedOrder.note || "Không có ghi chú"}</p>
                        <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.deliveryAddress}</p>
                        <p><strong>Ngày giao hàng:</strong> {new Date(selectedOrder.deliveryDateTime).toLocaleString()}</p>
                        <p><strong>Tên khách hàng:</strong> {selectedOrder.accountName}</p>
                        <p><strong>Điện thoại:</strong> {selectedOrder.phone}</p>
                    </div>
                ) : (
                    <p>Đang tải...</p>
                )}
            </Modal>
        </div>
    );
};

export default PaymentList;
