import React from 'react';
import { Link } from "react-router-dom";
import { Card, Result, Divider, Radio, Descriptions, Form, Col, Input, Row, Space, Typography, Table, Button } from 'antd';


class SignUpSuccess extends React.Component {
    render() {
        const {Text} = Typography;

        return (<Result
            status="success"
            title={<Text style={{ color: 'white', fontSize: '2em' }}>Sign Up completado con éxito</Text>}
            subTitle={<Text style={{ color: 'white', fontSize: '1.5em' }}>Para poder hacer el Login deberás aceptar la invitación que has recibido en tu correo (revisar carpeta de spam)</Text>}
            extra={[
                <Link to="/entradas_cine">
                    <Button type="primary" key="console">
                        Home
                    </Button>
                </Link>
            ]}
        />

        )
    }
}

export default SignUpSuccess;
