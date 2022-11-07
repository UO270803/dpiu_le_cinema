import React from 'react';
import { Link } from "react-router-dom";
import { Card, Divider, Radio, Descriptions, Form, Col, Input, Row, Space, Typography, DatePicker, Button, InputNumber } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import withRouter from './withRouter';
import { generate, presetDarkPalettes } from '@ant-design/colors';
import { grey } from '@ant-design/colors';
import moment from 'moment';

class Paso_4 extends React.Component {

    constructor(props) {
        super(props);
        this.id = this.props.params.id;
        this.state = {
            metodo_pago: 'credito',
            menus: []
        };
        this.entradas = this.props.carrito.filter(item =>
            item.hasOwnProperty('fila'));


    }

    componentDidMount() {
        this.menus = this.props.carrito.filter(item =>
            item.hasOwnProperty('precio'));
        this.setState({
            menus: this.menus
        })
    }

    siguientePaso = async (values) => {
        const { data: { user } } = await this.props.supabase.auth.getUser();
        if (this.state.metodo_pago == 'efectivo') {
            var { data, error } = await this.props.supabase
                .rpc('add_compra', {
                    comprador: user.email,
                    metodo_pago: values.metodo_pago
                });
        }
        else {
            var { data, error } = await this.props.supabase
                .rpc('add_compra_tarjeta', {
                    comprador: user.email,
                    metodo_pago: values.metodo_pago,
                    nombre_tarjeta: values.nombre,
                    numero_tarjeta: values.numero,
                    caducidad: values.caducidad,
                    cvc: values.cvc
                });
        }
        console.log(error)
        const { data: entrada, error: error_entrada } = await this.props.supabase
            .from('entrada')
            .insert(this.entradas.map(entrada => {
                return {
                    fila: entrada.fila,
                    columna: entrada.columna,
                    sesion_id: this.id,
                    compra_id: data
                }
            }));
        const { data: menu, error: erro_menu } = await this.props.supabase
            .from('compra_menu')
            .insert(this.menus.map(menu => {
                return {
                    menu_id: menu.id,
                    compra_id: data
                }
            }));
        this.props.siguientePaso([]);
    }

    cambioMetodoPago = async (e) => {
        this.setState({
            metodo_pago: e.target.value
        });
    }

    deleteMenu = async (nombre) => {
        let menus = this.menus;
        menus.filter(menu => menu.nombre == nombre).map(menu => menu.cantidad = menu.cantidad - 1);
        this.setState({
            menus: menus
        })
    }

    render() {
        const { Text } = Typography;
        const colors = generate('#1890ff', {
            theme: 'dark',
            backgroundColor: '#141414'
        });

        const monthFormat = 'YYYY/MM';

        let entradas_string =
            this.entradas.map(entrada =>
                entrada.fila + '-' + entrada.columna)
                .reduce((stringPre, stringAct) => stringAct + ', ' + stringPre, '')
                .slice(0, -2);
        let total = 7.50 * this.entradas.length + this.state.menus.map(menu => menu.precio * menu.cantidad).reduce((curr, acc) => acc + curr, 0)
        return (
            <Row style={{ marginTop: '2em' }} justify='center' gutter={[16, 16]}>
                <Col span={8} offset={2}>
                    <Descriptions labelStyle={{ color: "white" }} contentStyle={{ color: "white" }} title={<Text style={{ color: 'white', fontSize: '2.2em' }}>Resumen</Text>}>
                        <Descriptions.Item span={24} contentStyle={{ color: grey[2], fontSize: ' 2em' }} labelStyle={{ color: 'white', fontSize: ' 2em' }} label="Entradas">{entradas_string + ' (' + 7.50 * this.entradas.length + '€)'}</Descriptions.Item>
                        <Descriptions.Item span={24} contentStyle={{ color: grey[2], fontSize: ' 2em' }} labelStyle={{ color: 'white', fontSize: ' 2em' }} label="Menus">
                            <Space>
                                {this.state.menus.map(menu => {
                                    return (
                                        <div>
                                            <div>
                                                {menu.cantidad != 0 ? menu.nombre + " (" + menu.precio + "€): " + menu.cantidad : <></>}
                                                {menu.cantidad != 0 ? <Button style={{margin: '1em'}} type='primary' onClick={() => this.deleteMenu(menu.nombre)} shape='circle' icon={<DeleteOutlined />}></Button> : <></>}

                                            </div>
                                        </div>
                                    )
                                })}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item span={24} contentStyle={{ color: grey[2], fontSize: ' 2em' }} labelStyle={{ color: 'white', fontSize: ' 2em', fontWeight: 'bold' }} label="Total">{total + '€'}</Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={8}>
                    <Text style={{ color: 'white', fontSize: '2.2em', fontWeight: 'bold' }}>Zona de pago</Text>
                    <Form style={{ marginTop: '1em' }} name="basic" size="Large"
                        onFinish={values => this.siguientePaso(values)} autoComplete="off">
                        <Row gutter={[0, 12]}>
                            <Col span={24}>
                                <Form.Item name='metodo_pago' initialValue="credito">
                                    <Radio.Group defaultValue="efectivo" buttonStyle="solid" onChange={(e) => this.cambioMetodoPago(e)}>
                                        <Radio.Button value="credito">Tarjeta de credito</Radio.Button>
                                        <Radio.Button value="efectivo">Efectivo</Radio.Button>

                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                {
                                    this.state.metodo_pago === 'efectivo' ?
                                        <Text style={{ color: 'white', fontSize: '1.3em' }}>El pago se efectuará en el establecimiento</Text>
                                        : <Row gutter={[12, 0]}><Col span={24}><Form.Item label="Nombre" name="nombre"
                                            rules={[
                                                { required: true, message: 'Por favor, introduzca el nombre que figura en la tarjeta', },
                                            ]}>
                                            <Input />
                                        </Form.Item></Col>
                                            <Col span={24}>
                                                <Form.Item label="Numero tarjeta" name="numero"
                                                    rules={[
                                                        { required: true, message: 'Por favor, introduzca el número de tarjeta', },
                                                    ]}>
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Caducidad" name="caducidad" rules={[
                                                    { required: true, message: 'Por favor, introduzca la fecha de caducidad de la tarjeta', },
                                                ]}>
                                                    <DatePicker format={monthFormat} picker="month" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="CVC" name="cvc"
                                                    rules={[
                                                        { required: true, message: 'Please input your password!', },
                                                    ]}>
                                                    <InputNumber min={1} max={999} />
                                                </Form.Item></Col></Row>
                                }
                            </Col>
                            <Col span={24}>
                                <Form.Item>

                                    <Button type='primary' size='large' htmlType='submit'>
                                        Finalizar compra
                                    </Button>

                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row >

        )
    }
}

export default withRouter(Paso_4);
