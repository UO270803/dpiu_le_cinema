import React from 'react';
import { Link } from "react-router-dom";
import { Card, Result, Divider, Radio, Descriptions, Form, Col, Input, Row, Space, Typography, Table, Button } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import withRouter from './withRouter';
import { generate, presetDarkPalettes } from '@ant-design/colors';
import { grey } from '@ant-design/colors';

class Paso_5 extends React.Component {

    constructor(props) {
        super(props);
        this.id = this.props.params.id;
        this.state = {
        };

    }

    render() {
        const {Text} = Typography;

        return (<Result
            status="success"
            title={<Text style={{ color: 'white', fontSize: '2em' }}>Compra realizada</Text>}
            subTitle={<Text style={{ color: 'white', fontSize: '1.5em' }}>Para revisar la compra además de otras que hayas hecho haz click en el botón</Text>}
            extra={[
                <Link to="/carrito">
                    <Button type="primary" key="console">
                        Carrito
                    </Button>
                </Link>
            ]}
        />

        )
    }
}

export default withRouter(Paso_5);
