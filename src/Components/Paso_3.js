import React from 'react';
import { Link } from "react-router-dom";
import { Card, Form, Col, Input, Row, Space, Typography, Table, Button } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import withRouter from './withRouter';
import { generate, presetDarkPalettes } from '@ant-design/colors';

class Paso_3 extends React.Component {

    constructor(props) {
        super(props);
        this.id = this.props.params.id;

        this.checkUser();
    }

    checkUser = async () => {
        const { data: { user } } = await this.props.supabase.auth.getUser();

        console.log(user.email)
        
        if (user != null) {
            this.siguientePaso();
        }
    }

    sendLogin(values) {
        this.callBackOnFinishLoginForm({
            email: values.email,
            password: values.password,
        });

        this.siguientePaso();
    }

    callBackOnFinishLoginForm = async (loginUser) => {

        // signUn, Create user
        const { data, error } = await this.props.supabase.auth.signInWithPassword({
          email: loginUser.email,
          password: loginUser.password,
        })
    
        if (error == null && data.user != null) {
          this.setState({
            user: data.user
          });
        }
      }


    siguientePaso = async () => {
        this.props.siguientePaso([]);
    }

    render() {
        const colors = generate('#1890ff', {
            theme: 'dark',
            backgroundColor: '#141414'
        });
        return (
            <div>
                <Card bordered={false} className='myCard' style={{ background: '#1890ff', color: "white" }}>
                    <Form name="basic" labelCol={{ span: 24 / 3 }} wrapperCol={{ span: 24 / 3 }}
                        initialValues={{ remember: true, }}
                        onFinish={values => this.sendLogin(values)} autoComplete="off">

                        <Form.Item label="Email" name="email"
                            rules={[
                                { required: true, message: 'Please input your username!', },
                            ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Password" name="password"
                            rules={[
                                { required: true, message: 'Please input your password!', },
                            ]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24 / 3 } }}  >
                            <Button type="primary" htmlType="submit" block>Submit</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>

        )
    }
}

export default withRouter(Paso_3);
