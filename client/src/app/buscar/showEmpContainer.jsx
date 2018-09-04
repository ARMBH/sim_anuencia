import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadRtData, loadProcessData } from './../cadastro/cadActions';

import axios from 'axios';
import ShowEmpTemplate from './showEmpTemplate';
import ShowEmpRow from './showEmpRow';

class ShowEmpContainer extends Component {

    state = {
        items: [],
        search: ''
    }

    componentWillMount() {
        axios.get('/api/showEmpreend')
            .then(res => this.setState({ items: res.data }))
            .catch(err => console.log(err))
        this.props.loadRtData();
        this.props.loadProcessData();
    }

    deleteHandler = (id) => {
        axios.get("/api/delEmpreend/" + id)

            .then(axios.get('/api/showEmpreend')
                .then(res => this.setState({ items: res.data }))
                .catch(err => console.log(err)))

            .then(console.log('Deleted'))

            .catch(err => console.log(err));
    }

    handleChange = (e) => {
        this.setState({ search: e.target.value })
    }

    render() {
        console.log(this.props)
        let i = 0
        let empreendedores = [],
            searchString = this.state.search.trim().toLowerCase();
        if (this.state.search) {
            empreendedores = this.props.cadastro.rtCollection.filter((el) => el.nomeRt.toLowerCase().match(searchString))
        }

        return (
            <div>
                <ShowEmpTemplate
                    search={this.state.search}
                    change={e => this.handleChange(e)}>
                    {
                        empreendedores.map((item, index) => {
                            return (

                                <ShowEmpRow
                                    object={item}
                                    key={index}
                                    delete={this.deleteHandler.bind(this, item._id)}
                                    i={i = i + 1}
                                />
                            )
                        })
                    }
                </ShowEmpTemplate>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        cadastro: state.cadastro
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadRtData, loadProcessData }, dispatch)

}

export default connect(mapStateToProps, mapDispatchToProps)(ShowEmpContainer);