import React from 'react';
import withRouter from './withRouter';
import { Typography, Progress, PageHeader, Table, Card, InputNumber, Space, Descriptions, Image, Row, Col, Form, Divider, Tooltip } from 'antd';
import { Button, notification } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { generate, presetDarkPalettes } from '@ant-design/colors';



class Paso_1 extends React.Component {

    constructor(props) {
        super(props)
        this.id = this.props.params.id;
        this.state = {
            sesion: {},
            pelicula: {},
            carrito: [],
            seats: []
        };
        
        this.imageClicable = [];
        let clicked = [];
        for (var i = 0; i < 201; i++) {
            clicked[i] = false;
        }
        this.clicked = clicked;
    }


    chooseSeat = (i, fila, columna) => {
        console.log(i);
        if (this.clicked[i]) {
            this.clicked[i] = false;
            this.imageClicable[i].current.src = "/entradas_cine/seat.png";

            let carrito = this.state.carrito;
            let entrada = {
                'fila': fila,
                'columna': columna
            }
            let index = carrito.indexOf(entrada);
            carrito.splice(index, 1);

            this.setState({
                carrito: carrito
            });
        }
        else {
            this.clicked[i] = true;
            this.imageClicable[i].current.src = "/entradas_cine/seat_active.png";
            let carrito = this.state.carrito;
            let entrada = {
                'fila': fila,
                'columna': columna
            }
            carrito.push(entrada);
            this.setState({
                carrito: carrito
            });
        }

    }

    mouseOver = (i) => {
        this.imageClicable[i].current.src = "/entradas_cine/seat_active.png"
    }

    mouseOut = (i) => {
        if (!this.clicked[i])
            this.imageClicable[i].current.src = "/entradas_cine/seat.png"
    }

    componentDidMount() {
        this.sesionDetails();
        this.checkSeats();
    }

    checkSeats = async () => {
        let seats = this.state.seats;
        for (let i = 1; i < 201; i++) {
            let columna = i % 24;
            columna = columna == 0 ? 24 : columna;
            let fila = 1;
            if (i > 24) {
                let j = i;
                while (j > 24) {
                    fila++;
                    j -= 24;
                }
            }

            const { data, error } = await this.props.supabase
                .from('entrada')
                .select('id')
                .eq('sesion_id', this.id)
                .eq('fila', fila)
                .eq('columna', columna);

            if (data.length > 0 && error == null) {
                seats[i] = { 'i': i, 'free': false };
            }
            else {
                seats[i] = { 'i': i, 'free': true };
            }
            this.setState({
                seats: seats
            });
        }

    }

    sesionDetails = async () => {

        const { data, error } = await this.props.supabase
            .from('sesion')
            .select()
            .eq('id', this.id);



        if (error == null && data.length > 0) {
            let sesion = data[0];
            let pelicula_id = data[0].pelicula_id;

            const { data: pelicula, error } = await this.props.supabase
                .from('pelicula')
                .select()
                .eq('id', pelicula_id);

            if (error == null && data.length > 0) {

                // Data is a list
                this.setState({
                    sesion: sesion,
                    pelicula: pelicula[0]
                });
            }
        }

    }

    siguientePaso = async () => {
        console.log(this.state.carrito);
        if (this.state.carrito.length == 0) {
            notification.error({
                message: 'Ningun asiento seleccionado',
                description:
                    'Por favor escoge un asiento como mínimo.',
            });
        }
        else {
            this.props.siguientePaso(this.state.carrito);
        }

    }


    render() {
        const { Text } = Typography;
        const colors = generate('#1890ff', {
            theme: 'dark',
            backgroundColor: '#141414'
        });

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
        let data = this.state.carrito.map(element => {
            element.key = "table" + element.fila + element.columna;
            return element;
        })

        let mapa_butacas = [];

        let filas = [1, 2, 3, 4, 5, 6, 7, 8]

        for (var i = 1; i < 201; i++) {
            mapa_butacas.push(i);
        }

        return (
            <div>
                <Row>

                    <Col xl={16} lg={12} offset={4}>
                        <Divider style={{ color: 'white', borderTopColor: 'white', fontSize: '2em' }}>Pantalla</Divider>
                        <Card className='myCard' style={{ background: '#001529', color: "white" }} bordered={false} >
                            <Row gutter={[4, 4]} justify='center' align='top'>
                                {
                                    this.state.seats.length < 200 ?
                                        <Progress percent={(this.state.seats.length / 200 * 100).toFixed()} status='active'></Progress> : this.state.seats.map(seat => {
                                            let i = seat.i;
                                            this.imageClicable[i] = React.createRef();
                                            let columna = i % 24;
                                            columna = columna == 0 ? 24 : columna;
                                            let fila = 1;
                                            if (i > 24) {
                                                let j = i;
                                                while (j > 24) {
                                                    fila++;
                                                    j -= 24;
                                                }
                                            }
                                            if (seat.free) {
                                                return (<Tooltip title={fila + ' - ' + columna}><Col span={1}>
                                                    <img ref={this.imageClicable[i]} src='/entradas_cine/seat.png'
                                                        onClick={() => { this.chooseSeat(i, fila, columna) }}
                                                        onMouseOver={() => { this.mouseOver(i) }}
                                                        onMouseOut={() => { this.mouseOut(i) }} />
                                                </Col></Tooltip>)
                                            }
                                            else {
                                                return (<Tooltip title={fila + ' - ' + columna}><Col span={1}>
                                                    <img ref={this.imageClicable[i]} src='/entradas_cine/seat_ocuppied.png' />
                                                </Col></Tooltip>)
                                            }
                                        })}
                                {
                                    this.state.seats.length < 200 ?
                                        <></> :
                                        <Col style={{ marginTop: '3em' }} span={24}><Text style={{ color: 'white', fontSize: '1.2em' }}><Row justify='space-between'><div>Butaca libre: <img src='/entradas_cine/seat.png' /></div> <div>Butaca seleccionada: <img src='/entradas_cine/seat_active.png' /></div><div> Butaca ocupada: <img src='/entradas_cine/seat_ocuppied.png' /></div></Row></Text></Col>
                                }
                            </Row>

                        </Card>
                    </Col>
                </Row >
                {
                    this.state.seats.length < 200 ?
                        <></> :
                        <Row justify='space-between'>
                            <Col span={12} offset={2}>
                                <Text style={{ color: 'white', fontSize: '1.3em' }}><Text style={{ color: 'white', fontSize: '1.3em', fontWeight: 'bold' }}>Butacas seleccionadas:</Text> {this.state.carrito.map(butaca => {
                                    return butaca.fila + ' - ' + butaca.columna + ', ';
                                })}</Text>
                            </Col>
                            <Col span={6} offset={1}>
                                <Button type='primary' size='large' onClick={this.siguientePaso}>Continuar</Button>
                            </Col>
                        </Row>
                }
            </div>
        )

    }
}

export default withRouter(Paso_1);