import React from 'react';
import LoginForm from './LoginForm';
import Sesiones from './Components/Sesiones';
import Sesion from './Components/Sesion';
import SignUpForm from './Components/SignUpForm';
import Compras from './Components/Compras';
import ProximosEstrenos from './Components/ProximosEstrenos';
import Butacas from './Components/Paso_1';
import { createClient } from '@supabase/supabase-js'
import { Route, Routes, Link, Navigate } from "react-router-dom"
import 'antd/dist/antd.css';
import { generate, presetDarkPalettes } from '@ant-design/colors';
import withRouter from './Components/withRouter';


import { Layout, Menu, notification } from 'antd';
import { Col, Row } from 'antd';
import { Avatar, Typography } from 'antd';
import { grey } from '@ant-design/colors';

import { VideoCameraOutlined, ForwardOutlined, LoginOutlined, AimOutlined, ShoppingCartOutlined } from '@ant-design/icons';


class App extends React.Component {


  constructor(props) {
    super(props);

    // opcional para poder personalizar diferentes aspectos
    const options = {
      schema: 'public',
      headers: { 'x-my-custom-header': 'my-app-name' },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    };

    const supabase = createClient(
      'https://bquafopvwextnjbwhevt.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdWFmb3B2d2V4dG5qYndoZXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5NTM4MzIsImV4cCI6MTk4MjUyOTgzMn0.hu5sB1a-0lLcPZE54HJQLHWNRRnzS-u_oBBykgth7BQ',
      options
    );

    this.supabase = supabase;

    this.state = {
      user: null
    };

  }


  componentDidMount = async () => {
    if (this.state.user == null) {
      const { data: { user } } = await this.supabase.auth.getUser();

      if (user != null) {
        this.setState({
          user: user
        });
      }
    }
  }

  callBackOnFinishLoginForm = async (loginUser) => {

    // signUn, Create user
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: loginUser.email,
      password: loginUser.password,
    })

    if (error == null && data.user != null) {
      this.setState({
        user: data.user
      });

      notification.success({
        message: 'Login con éxito',
      });
      this.props.navigate("/entradas_cine");
    }
    else {
      notification.error({
        message: 'Datos incorrectos',
        description:
          'Los datos introducidos no son correcto, por favor compruébalos',
      });
    }
  }


  render() {
    // for not using Layout.Header, Layout.Footer, etc...
    const { Header, Footer, Sider, Content } = Layout;

    const { Text } = Typography;

    let contentUser = <Text style={{ color: "#ffffff" }}>Login</Text>
    if (this.state.user != null) {
      contentUser = <Avatar style={{ color: "#000000", marginTop: 12, textTransform: 'uppercase' }} size="large" >
        {this.state.user.email.charAt(0)}
      </Avatar>
    }

    let menuItems = [
      { key: "menuPeliculas", label: <Link to="/entradas_cine">Peliculas</Link>, icon: <VideoCameraOutlined /> },
      { key: "menuProximosEstrenos", label: <Link to="/proximos">Próximos estrenos</Link>, icon: <ForwardOutlined /> },
      { key: "menuLogin", label: <Link to="/login">Login</Link>, icon: <LoginOutlined /> },
      { key: "menuSignup", label: <Link to="/signUp">Sign Up</Link>, icon: <AimOutlined /> },
      { key: "menuCompras", label: <Link to="/carrito">Carrito</Link>, icon: <ShoppingCartOutlined /> },
    ]

    const colors = generate('#1890ff', {
      theme: 'dark',
      backgroundColor: '#141414'
    });

    return (
      <Layout className="layout" style={{ backgroundColor: '#001529' }}>
        <Header>
          <Row>
            <Col xs={18} sm={19} md={20} lg={21} xl={22}>

              <Menu theme="dark" mode="horizontal" items={menuItems} >
              </Menu>

            </Col>
            <Col xs={6} sm={5} md={4} lg={3} xl={2} style={{ display: 'flex', flexDirection: 'row-reverse' }}>
              {contentUser}
            </Col>
          </Row>

        </Header>

        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Row style={{ marginTop: 34 }}>
              <Col span={24}>
                <Routes>
                  <Route path="/login" element={
                    <LoginForm callBackOnFinishLoginForm={this.callBackOnFinishLoginForm} />
                  } />
                  <Route path="/signUp" element={
                    <SignUpForm supabase={this.supabase} />
                  } />
                  <Route path="/entradas_cine" element={
                    <Sesiones supabase={this.supabase} />
                  } />
                  <Route path="/sesion/:id" element={
                    <Sesion supabase={this.supabase} />
                  } />
                  <Route path="/carrito" element={
                    <Compras supabase={this.supabase} />
                  } />
                  <Route path="/proximos" element={
                    <ProximosEstrenos supabase={this.supabase} />
                  } />
                </Routes>
              </Col>
            </Row>

          </div>
        </Content>

        <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: grey[0] }}> Le Cinema 2022 </Footer>
      </Layout>
    );
  }
}

export default withRouter(App);
