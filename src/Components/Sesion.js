import React from 'react';
import withRouter from './withRouter';
import { Typography, PageHeader, Table, Card, InputNumber, Space, Descriptions, Image, Row, Col, Form, Steps } from 'antd';
import { Button, notification } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { generate, presetDarkPalettes } from '@ant-design/colors';
import Paso_1 from './Paso_1';
import Paso_2 from './Paso_2';
import Paso_3 from './Paso_3';
import Paso_4 from './Paso_4';
import Paso_5 from './Paso_5';



class Sesion extends React.Component {

    constructor(props) {
        super(props)
        this.id = this.props.params.id;
        this.state = {
            paso: 1,
            carrito: [],
            titulo: '',
            dia: '',
            hora: ''
        };
    }

    componentDidMount = async () => {
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
                    titulo: pelicula[0].titulo,
                    dia: sesion.dia,
                    hora: sesion.hora
                });
            }
        }
    }

    siguientePaso = async (carrito) => {
        let paso = this.state.paso;
        let state_carrito = this.state.carrito;

        Array.prototype.push.apply(state_carrito, carrito);

        paso = paso + 1;
        this.setState({
            paso: paso,
            carrito: state_carrito
        });
    }



    render() {
        const steps = [
            {
                'title': 'Elige tus asientos',
                'content': <Paso_1 supabase={this.props.supabase} siguientePaso={this.siguientePaso} />
            },
            {
                'title': 'Productos del bar',
                'content': <Paso_2 supabase={this.props.supabase} siguientePaso={this.siguientePaso} carrito={this.state.carrito} />
            },
            {
                'title': 'Autentícate',
                'content': <Paso_3 supabase={this.props.supabase} siguientePaso={this.siguientePaso} />
            },
            {
                'title': 'Elige tu forma de pago',
                'content': <Paso_4 supabase={this.props.supabase} siguientePaso={this.siguientePaso} carrito={this.state.carrito} />
            }
        ]
        if (this.state.paso < 4) {
            return (<div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => window.history.back()}
                    title={this.state.titulo}
                    subTitle={this.state.dia + ' / ' + this.state.hora}
                />
                <Steps current={this.state.paso} items={steps} />
                <div className="steps-content">{steps[this.state.paso].content}</div>
            </div>)
        }
        else if (this.state.paso == 4) {
            return <Paso_5 />
        }
    }
}

export default withRouter(Sesion);