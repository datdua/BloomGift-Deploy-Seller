import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, InputNumber, Switch, message, Card, Row, Col, Typography } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../../redux/actions/productActions';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const AddProduct = () => {
    const dispatch = useDispatch();
    const [imageFiles, setImageFiles] = useState([]);

    const handleUpload = (info) => {
        if (info.file.status === 'done') {
            setImageFiles((prevFiles) => [...prevFiles, info.file.originFileObj]);
            message.success(`${info.file.name} uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} upload failed`);
        }
    };

    const onFinish = (values) => {
        const productRequest = {
            discount: values.discount || 0,
            description: values.description,
            colour: values.colour,
            productName: values.productName,
            featured: values.featured,
            quantity: values.quantity,
            categoryName: values.categoryName,
            storeID: localStorage.getItem('storeID'),
            productStatus: values.productStatus,
            price: values.price,
            sizes: values.sizes,
        };

        dispatch(createProduct(productRequest, imageFiles))
            .then(() => {
                message.success('Product created successfully!');
            })
            .catch((error) => {
                message.error('Failed to create product: ' + error.message);
            });
    };

    return (
        <Card className="add-product-container" style={{ maxWidth: 1600, margin: '0 auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 30, color: '#F56285' }}>Thêm Sản Phẩm</Title>
            <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ featured: false, productStatus: true, discount: 0 }}
                className="add-product-form"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="productName"
                            label="Product Name"
                            rules={[{ required: true, message: 'Please input the product name!' }]}
                        >
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="categoryName"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a category!' }]}
                        >
                            <Select placeholder="Select category">
                                <Option value="hoa">Hoa</Option>
                                <Option value="qua">Quà</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the product description!' }]}
                >
                    <TextArea rows={4} placeholder="Enter product description" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="colour"
                            label="Colour"
                            rules={[{ required: true, message: 'Please input the product colour!' }]}
                        >
                            <Input placeholder="Enter product colour" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[{ required: true, message: 'Please input the product price!' }]}
                        >
                            <InputNumber min={0} placeholder="Enter price" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[{ required: true, message: 'Please input the product quantity!' }]}
                        >
                            <InputNumber min={0} placeholder="Enter quantity" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="discount"
                    label="Discount (%)"
                >
                    <InputNumber min={0} max={100} placeholder="Enter discount percentage" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="sizes"
                    label="Sizes"
                >
                    <Form.List name="sizes">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Card key={key} style={{ marginBottom: 8, background: '#f0f2f5' }}>
                                        <Row gutter={16}>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'text']}
                                                    fieldKey={[fieldKey, 'text']}
                                                    rules={[{ required: true, message: 'Size text required' }]}
                                                >
                                                    <Input placeholder="Size text" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'price']}
                                                    fieldKey={[fieldKey, 'price']}
                                                    rules={[{ required: true, message: 'Price required' }]}
                                                >
                                                    <InputNumber min={0} placeholder="Price" style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'sizeQuanity']}
                                                    fieldKey={[fieldKey, 'sizeQuanity']}
                                                    rules={[{ required: true, message: 'Quantity required' }]}
                                                >
                                                    <InputNumber min={0} placeholder="Quantity" style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Button type="link" danger onClick={() => remove(name)}>
                                                    Remove
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Size
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="productStatus"
                            label="Product Status"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="featured"
                            label="Featured"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Yes" unCheckedChildren="No" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Product Images"
                >
                    <Upload
                        name="imageFiles"
                        listType="picture-card"
                        multiple={true}
                        customRequest={({ file, onSuccess }) => {
                            setTimeout(() => onSuccess("ok"), 0);
                        }}
                        onChange={handleUpload}
                        accept="image/*"
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block style={{ background: '#F56285', borderColor: '#F56285' }}>
                        Create Product
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddProduct;