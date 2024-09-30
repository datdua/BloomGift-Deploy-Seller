// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { NavLink } from 'react-router-dom';
// import { getAllPromotions} from '../../../redux/actions/promotionActions';
// import { Button, Input, Select, Table, Empty, Tabs } from 'antd';
// import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import UpdateProduct from './UpdateProduct';
// import Swal from 'sweetalert2';
// import '../ProductManager/ProductList.css';

// const { Option } = Select;
// const { TabPane } = Tabs;

// const PromotionList = () => {
//     const dispatch = useDispatch();
//     const promotions = useSelector(state => state.promotionData.promotions) || [];
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [updateModalVisible, setUpdateModalVisible] = useState(false);
//     const [selectedProductId, setSelectedProductId] = useState(null);

//     useEffect(() => {
//         dispatch(getAllPromotions());
//     }, [dispatch]);

//     const handleTabChange = (key) => {
//         switch (key) {
//             case 'all':
//                 dispatch(getAllPromotions());
//                 break;
//             case 'active':
//                 dispatch(getProductByStatusTrue());
//                 break;
//             case 'violated':
//                 dispatch(getProductByStatusFalse());
//                 break;
//             default:
//                 break;
//         }
//     };

//     const handleUpdateClick = (promotionId) => {
//         setSelectedProductId(promotionId);
//         setUpdateModalVisible(true);
//     };

//     const handleDeleteClick = (promotionId) => {
//         Swal.fire({
//             title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
//             text: "Hành động này không thể hoàn tác!",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Có, xóa nó!',
//             cancelButtonText: 'Hủy'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 dispatch(deleteProduct(promotionId))
//                     .then(() => {
//                         Swal.fire(
//                             'Đã xóa!',
//                             'Sản phẩm đã được xóa thành công.',
//                             'success'
//                         );
//                         dispatch(getAllPromotions());
//                     })
//                     .catch((error) => {
//                         Swal.fire(
//                             'Lỗi!',
//                             'Có lỗi xảy ra khi xóa sản phẩm.',
//                             'error'
//                         );
//                     });
//             }
//         });
//     };

//     const columns = [
//         {
//             title: 'Tên khuyến mãi',
//             dataIndex: 'promotionName',
//             key: 'promotionName',
//             render: (text) => <span>{text || 'N/A'}</span>,
//         },
//         {
//             title: 'Mã khuyến mãi',
//             dataIndex: 'promotionCode',
//             key: 'promotionCode',
//         },
//         {
//             title: 'Mô tả',
//             dataIndex: 'promotionDescription',
//             key: 'promotionDescription',
//         },
//         {
//             title: 'Giảm giá',
//             dataIndex: 'promotionDiscount',
//             key: 'promotionDiscount',
//             render: (text) => <span>{text * 100}%</span>,
//         },
//         {
//             title: 'Số lượng',
//             dataIndex: 'quantity',
//             key: 'quantity',
//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: 'promotionStatus',
//             key: 'promotionStatus',
//         },
//         {
//             title: 'Ngày bắt đầu',
//             dataIndex: 'startDate',
//             key: 'startDate',
//         },
//         {
//             title: 'Ngày kết thúc',
//             dataIndex: 'endDate',
//             key: 'endDate',
//         },
//         {
//             title: 'Tên cửa hàng',
//             dataIndex: 'storeName',
//             key: 'storeName',
//         },
//     ];

//     const filteredpromotions = promotions.filter(promotion =>
//         promotion.promotionName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         (selectedCategory === '' || promotion.categoryName === selectedCategory)
//     );

//     const categories = [...new Set(promotions.map(promotion => promotion.categoryName))];

//     const customLocale = {
//         triggerDesc: 'Nhấn để sắp xếp giảm dần',
//         triggerAsc: 'Nhấn để sắp xếp tăng dần',
//         cancelSort: 'Nhấn để hủy sắp xếp',
//         emptyText: (
//             <Empty
//                 image={Empty.PRESENTED_IMAGE_DEFAULT}
//                 description="Không tìm thấy sản phẩm"
//             />
//         ),
//     };

//     return (
//         <div style={{ padding: '20px' }}>
//             <h1>Sản phẩm</h1>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//                 <Select defaultValue="" style={{ width: 200, borderColor: '#F56285' }} onChange={value => setSelectedCategory(value)}>
//                     <Option value="">Tất cả danh mục</Option>
//                     {categories.map(category => (
//                         <Option key={category} value={category}>{category}</Option>
//                     ))}
//                 </Select>
//                 <NavLink to="/banhang/add-promotion">
//                     <Button type="primary" style={{ background: '#F56285', borderColor: '#F56285' }} icon={<PlusOutlined />}>
//                         Thêm 1 sản phẩm mới
//                     </Button>
//                 </NavLink>
//             </div>
//             <Input
//                 placeholder="Tìm tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
//                 onChange={e => setSearchTerm(e.target.value)}
//                 style={{ marginBottom: '20px', borderColor: '#F56285' }}
//                 suffix={<SearchOutlined style={{ fontSize: '18px', color: '#bfbfbf' }} />}
//             />
//             <Tabs defaultActiveKey="all" onChange={handleTabChange}>
//                 <TabPane tab="Tất cả" key="all">
//                     <Table
//                         columns={columns}
//                         dataSource={filteredpromotions}
//                         rowKey="promotionID"
//                         locale={customLocale}
//                         pagination={{ pageSize: 10 }}
//                     />
//                 </TabPane>
//                 <TabPane tab="Đang Hoạt Động" key="active">
//                     <Table
//                         columns={columns}
//                         dataSource={filteredpromotions}
//                         rowKey="promotionID"
//                         locale={customLocale}
//                         pagination={{ pageSize: 10 }}
//                     />
//                 </TabPane>
//                 <TabPane tab="Vi Phạm" key="violated">
//                     <Table
//                         columns={columns}
//                         dataSource={filteredpromotions}
//                         rowKey="promotionID"
//                         locale={customLocale}
//                         pagination={{ pageSize: 10 }}
//                     />
//                 </TabPane>
//             </Tabs>
//             <UpdateProduct
//                 visible={updateModalVisible}
//                 onCancel={() => setUpdateModalVisible(false)}
//                 promotionID={selectedProductId}
//             />
//         </div>
//     );
// };

// export default PromotionList;