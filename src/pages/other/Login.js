import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { jwtDecode }from 'jwt-decode';
import { useToasts } from 'react-toast-notifications';
import { loginAccount } from '../../redux/actions/authenticationActions';
import { fetchSellerInfo } from "../../redux/actions/storeActions";
import './LoginRegister.css';

const Login = () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [rememberMe, setRememberMe] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const savedEmail = getCookie("userEmail");
        const savedPassword = getCookie("userPassword");

        if (savedEmail && savedPassword) {
            document.querySelector('input[name="user-email"]').value = savedEmail;
            document.querySelector('input[name="user-password"]').value = savedPassword;
            setRememberMe(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const userData = {
            email: e.target["user-email"].value,
            password: e.target["user-password"].value,
        };

        dispatch(loginAccount(userData, addToast))
            .then((response) => {
                if (rememberMe) {
                    document.cookie = `userEmail=${userData.email}; max-age=31536000; path=/`; // Save for 1 year
                    document.cookie = `userPassword=${userData.password}; max-age=31536000; path=/`; // Save for 1 year
                }
                if (response && response.token) {
                    const decodedToken = jwtDecode(response.token);
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("role", decodedToken.role);
                    localStorage.setItem("storeID", decodedToken.storeID);

                    if (decodedToken.role === "ROLE_SELLER") {
                        // Lưu trữ thông tin seller
                        dispatch(fetchSellerInfo(decodedToken.storeID))
                            .then((storeData) => {
                                console.log("Store data fetch thành công", storeData);
                            })
                            .catch((error) => {
                                console.error("Lỗi fetching store data:", error);
                            });
                        history.push("/banhang/dashboard");
                    }
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
            });
    };

    return (
        <div className="login-register-area" style={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/bloom-gift-67f83.appspot.com/o/element-layout%2Flogo%2Fbackground_seller.jpeg?alt=media&token=411239f9-bf19-4a10-b484-1bdf2c9d0870')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh'
        }}>
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col lg={8} md={12}>
                        <div className="login-register-wrapper">
                            <div className="login-form-container">
                                <div className="login-wrapper p-4 shadow-lg rounded bg-light">
                                    <h3 className="text-center mb-4">Đăng Nhập</h3>
                                <div className="login-register-form">
                                    <Form onSubmit={handleLogin}>
                                        <Form.Group>
                                            <Form.Control type="email" name="user-email" placeholder="Email" required />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Control type="password" name="user-password" placeholder="Mật khẩu" required />
                                        </Form.Group>
                                        <div className="button-box">
                                            <div className="login-toggle-btn d-flex justify-content-between">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Ghi nhớ tài khoản"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                />
                                                <Link to="/forget-password" style={{ color: '#ff69b4' }}>Quên mật khẩu?</Link>
                                            </div>
                                            <Button type="submit" variant="primary" style={{ backgroundColor: '#ff69b4', borderColor: '#ff69b4' }}>
                                                Đăng Nhập
                                            </Button>
                                        </div>
                                    </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;