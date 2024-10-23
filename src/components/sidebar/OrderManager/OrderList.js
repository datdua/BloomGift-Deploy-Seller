import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrdersByStoreID, acceptOrder, completedOrder, rejectOrder } from '../../../redux/actions/orderActions';
import { Button, Input, Select, Table, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';


const { Option } = Select;

const OrderList = () => {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.orders) || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const storeID = localStorage.getItem('storeID');

    useEffect(() => {
        dispatch(fetchAllOrdersByStoreID(storeID));
    }, [dispatch, storeID]);

    const handleAcceptOrder = (orderID) => {
        dispatch(acceptOrder(orderID))
            .then(() => {
                Swal.fire('Thành công!', 'Đơn hàng đã được chấp nhận.', 'success');
                dispatch(fetchAllOrdersByStoreID(storeID));
            })
            .catch((error) => {
                Swal.fire('Lỗi!', 'Có lỗi xảy ra khi chấp nhận đơn hàng.', 'error');
            });
    };

    const handleCompleteOrder = (orderID) => {
        dispatch(completedOrder(orderID))
            .then(() => {
                Swal.fire('Thành công!', 'Đơn hàng đã được hoàn tất.', 'success');
                dispatch(fetchAllOrdersByStoreID(storeID));
            })
            .catch((error) => {
                Swal.fire('Lỗi!', 'Có lỗi xảy ra khi hoàn tất đơn hàng.', 'error');
            });
    };

    const handleRejectOrder = (orderID) => {
        Swal.fire({
            title: 'Nhập lý do từ chối',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Từ chối',
            cancelButtonText: 'Hủy',
            showLoaderOnConfirm: true,
            preConfirm: (note) => {
                return dispatch(rejectOrder(orderID, note))
                    .then(() => {
                        Swal.fire('Thành công!', 'Đơn hàng đã bị từ chối.', 'success');
                        dispatch(fetchAllOrdersByStoreID(storeID));
                    })
                    .catch((error) => {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderID',
            key: 'orderID',
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'accountName',
            key: 'accountName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex: 'deliveryAddress',
            key: 'deliveryAddress',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Ngày giao hàng',
            dataIndex: 'deliveryDateTime',
            key: 'deliveryDateTime',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Tổng giá trị đơn hàng',
            dataIndex: 'oderPrice',
            key: 'oderPrice',
            render: (price) => price != null ? `${price.toFixed(2)} VNĐ` : 'N/A',
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleAcceptOrder(record.orderID)}>Chấp nhận</Button>
                    <Button type="link" onClick={() => handleCompleteOrder(record.orderID)}>Hoàn tất</Button>
                    <Button type="link" danger onClick={() => handleRejectOrder(record.orderID)}>Từ chối</Button>
                </>
            ),
        },
    ];

    const filteredOrders = orders.filter(order =>
        order.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedStatus === '' || order.orderStatus === selectedStatus)
    );

    const statuses = [...new Set(orders.map(order => order.orderStatus))];

    const customLocale = {
        triggerDesc: 'Nhấn để sắp xếp giảm dần',
        triggerAsc: 'Nhấn để sắp xếp tăng dần',
        cancelSort: 'Nhấn để hủy sắp xếp',
        emptyText: (
            <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description="Không tìm thấy đơn hàng"
            />
        ),
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Đơn hàng</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Select defaultValue="" style={{ width: 200, borderColor: '#F56285' }} onChange={value => setSelectedStatus(value)}>
                    <Option value="">Tất cả trạng thái</Option>
                    {statuses.map(status => (
                        <Option key={status} value={status}>{status}</Option>
                    ))}
                </Select>
            </div>
            <Input
                placeholder="Tìm tên khách hàng, số điện thoại"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', borderColor: '#F56285' }}
                suffix={<SearchOutlined style={{ fontSize: '18px', color: '#bfbfbf' }} />}
            />
            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="orderID"
                locale={customLocale}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default OrderList;