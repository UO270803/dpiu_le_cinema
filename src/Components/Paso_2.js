import React from 'react';
import { Link } from "react-router-dom";
import { Card, Form, Col, Row, Space, Typography, Table, Button, InputNumber, notification } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import withRouter from './withRouter';

class Paso_2 extends React.Component {

    constructor(props) {
        super(props);
        this.id = this.props.params.id;
        this.state = {
            menus: [],
            carrito_menus: []
        };


    }

    componentDidMount() {
        this.getmenusSummary();
    }

    getmenusSummary = async () => {
        const { data, error } = await this.props.supabase
            .from('menu')
            .select('*');


        if (error == null) {
            this.setState({
                menus: data
            });
        }
    }

    siguientePaso = async () => {
        this.props.siguientePaso(this.state.carrito_menus);
    }

    addMenu = async (values) => {
        if (parseInt(values.number) != 0) {


            let id = values.id;
            let carrito_menus = this.state.carrito_menus;
            let menu = this.state.menus.filter(menu => menu.id == id)[0]
            let menu_repetido = carrito_menus.filter(menu_comprado => menu_comprado.nombre == menu.nombre)
            if (menu_repetido.length > 0) {
                let new_menu = {
                    'nombre': menu.nombre,
                    'cantidad': menu_repetido[0].cantidad + parseInt(values.number),
                    'id': id,
                    'precio': menu.precio
                }
                let index = carrito_menus.indexOf(menu_repetido[0]);
                delete carrito_menus[index];
                carrito_menus[index] = new_menu;

            }
            else {
                let new_menu = {
                    'nombre': menu.nombre,
                    'cantidad': parseInt(values.number),
                    'id': id,
                    'precio': menu.precio
                }
                carrito_menus.push(new_menu)
            }
            this.setState({
                carrito_menus: carrito_menus
            });
            notification.success({
                message: 'Producto(s) añadido(s)',
                description:
                    'La operación se ha realizado con éxito.',
            });
        }
    }


    render() {
        let columns = [
            {
                title: 'Fila',
                dataIndex: 'fila',
            },
            {
                title: 'Columna',
                dataIndex: 'columna',
            },
        ]
        const { Text } = Typography;
        const { Meta } = Card;
        return (
            <div>
                <Row style={{ marginTop: '1em' }} justify='space-between' gutter={[2, 0]} >
                    {this.state.menus.map(menu => {
                        let imagen =
                            <img src={"https://bquafopvwextnjbwhevt.supabase.co/storage/v1/object/public/images/" + menu.imagen} />


                        return (
                            <Col span={4} >
                                <Card
                                    cover={imagen
                                    }
                                    actions={[
                                        <Form name="basic"
                                            size="Large"
                                            onFinish={values => this.addMenu(values)} >
                                            <Form.Item name='id' initialValue={menu.id} hidden>

                                            </Form.Item>
                                            <Form.Item name='number' initialValue={0} >
                                                <InputNumber defaultValue={0} min={0}>
                                                </InputNumber>
                                            </Form.Item>
                                            <Form.Item >
                                                <Button htmlType="submit">
                                                    Añadir <ShoppingCartOutlined />
                                                </Button>
                                            </Form.Item>
                                        </Form>,
                                    ]}
                                >
                                    <Meta
                                        title={menu.nombre + " - " + menu.precio + "€"}
                                        description={menu.descripcion}
                                    />
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
                <Row justify='end'>
                    <Col span={6}>
                        <Button style={{ marginTop: '1em', marginBottom: '0.5em', width: '100%' }} type='primary' size='large' onClick={this.siguientePaso}>Continuar</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(Paso_2);
