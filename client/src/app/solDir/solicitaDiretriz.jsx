import React, { Component } from 'react';
import axios from 'axios';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadEmpData, loadRtData, loadProcessData, setColor, reduxToastr } from './../cadastro/cadActions'
import { sendMail } from '../common/sendMail'

import SolicitaDiretrizTemplate from './solicitaDiretrizTemplate';
import SolicitaDiretrizRow from './solicitaDiretrizRow';
import { solDirConfig } from '../config/configLabels'
import ShowDetails from '../common/showDetails'


class solicitaDiretriz extends Component {

    constructor() {
        super()
        this.escFunction = (event) => {
            if (event.keyCode === 27) this.closeDetails()
        }
    }

    state = {
        searchValue: '',
        dataMatch: [],
        toggleUpload: false,
        selectedId: '',
        checked: null,
        files: [],
        form: null,
        dirMunFile: '',
        levPlanFile: '',
        dirDaeFile: '',
        showEmpDetails: false,
        showRtDetails: false,
        empId: '',
        rtId: ''
    }

    componentDidMount() {
        !this.props.redux.empCollection[0] ? this.props.loadEmpData() : void 0
        !this.props.redux.processCollection[0] ? this.props.loadProcessData() : void 0
        !this.props.redux.rtCollection[0] ? this.props.loadRtData() : void 0

        axios.get('/api/files')
        document.addEventListener("keydown", this.escFunction, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    handleSearch(e) {
        this.setState({ ...this.state, searchValue: e.target.value, checked: false });
        let clearRadio = document.getElementsByName('group1')
        clearRadio.forEach(radio => radio.checked = false)
    }

    clearSearch(e) {
        this.setState({ ...this.state, searchValue: '', checked: null });
        document.getElementsByName('search')[0].value = '';
        let clearRadio = document.getElementsByName('group1')
        clearRadio.forEach(radio => {
            radio.checked = false
        })
    }

    async handleSelect(e) {
        await this.setState({
            ...this.state,
            selectedId: e.target.value.replace(/,/g, ''),
            checked: e.currentTarget.id
        })
        document.getElementById(this.state.checked).checked = 'checked';
    }

    async fileUpload(e) {

        let formData = new FormData()
        formData.append('processId', this.state.selectedId)
        this.setState({
            ...this.state, [e.target.name]: e.target.files[0]
        })

        let k = []
        await solDirConfig.map(item => k.push(item.nameInput))

        await k.forEach(inputName => {
            for (let keys in this.state) {
                keys.match(inputName) ?
                    (formData.append(inputName, this.state[keys]))
                    : void 0
            }
        })
        this.setState({ form: formData })
    }

    async handleSubmit(e) {
        e.preventDefault()
        const processo = this.props.redux.processCollection.filter(el => el._id.match(this.state.selectedId))[0]
        const emp = this.props.redux.empCollection.filter(el => el._id.match(processo.empId))[0]
        const rt = this.props.redux.rtCollection.filter(el => el._id.match(processo.rtId))[0]

        const { modalidade, nomeEmpreendimento, munEmpreendimento } = processo
        let filesArray = []
        alert("I'm elfo")
        try {
            await axios.post('/api/solDirUpload', this.state.form)
                .then(res => {

                    for (let key in res.data.file) {
                        filesArray.push({
                            fieldName: res.data.file[key][0].fieldname,
                            id: res.data.file[key][0].id,
                            originalName: res.data.file[key][0].originalname,
                            uploadDate: res.data.file[key][0].uploadDate,
                            contentType: res.data.file[key][0].contentType,
                            fileSize: res.data.file[key][0].size
                        })
                    }
                })
            await axios.put('/api/editProcess', {
                id: this.state.selectedId,
                status: 'Aguardando Diretrizes Metropolitanas',
                processHistory: {
                    label: 'Diretrizes metropolitanas solicitadas',
                    createdAt: new Date(),
                    files: filesArray
                }
            })
                .then(alert('Aahmmm...'))
                .then(reduxToastr('sucess', 'Diretrizes Metropolitanas solicitadas.'))
                .then(alert('hi'))
        } catch (err) {
            console.log(err)
            reduxToastr('Erro!', 'Uma ou mais solicitações não foram concluídas com sucesso.')
        }        
        sendMail(emp.email, rt.emailRt, emp.nome, modalidade, nomeEmpreendimento, munEmpreendimento, 'Diretrizes Metropolitanas solicitadas.')        
    }

    empDetails(e) {
        this.setState({ showEmpDetails: true, showRtDetails: false, empId: e.target.id })
    }

    rtDetails(e) {
        this.setState({ showEmpDetails: false, showRtDetails: true, rtId: e.target.id })
    }

    closeDetails() {
        this.setState({ showEmpDetails: false, showRtDetails: false, empId: '', rtId: '' })
    }

    render() {

        let { dataMatch } = this.state
        const filteredList = this.props.redux.processCollection.filter(el => el.status === 'Processo cadastrado')

        let input = this.state.searchValue.toLowerCase()
        if (filteredList && (input && !this.state.checked)) {
            dataMatch = filteredList.filter(el => el.nomeEmpreendimento.toLowerCase().match(input))
        } else if (filteredList && (this.state.checked || (this.state.checked && input))) {
            dataMatch = filteredList.filter(el => el._id.toLowerCase().match(this.state.selectedId))
        } else {
            dataMatch = filteredList
        }

        return (
            <div>
                <SolicitaDiretrizTemplate
                    data={this.state}
                    redux={this.props.redux}
                    search={this.handleSearch.bind(this)}
                    searchArray={dataMatch}
                    selectProcess={this.handleSelect.bind(this)}
                    submitFiles={this.handleSubmit.bind(this)}
                    setColor={this.props.redux.setColor}
                    clear={this.clearSearch.bind(this)}
                    empDetails={this.empDetails.bind(this)}
                    rtDetails={this.rtDetails.bind(this)}
                >
                    {
                        solDirConfig.map((item, i) => {
                            return (
                                <SolicitaDiretrizRow
                                    object={item}
                                    key={i}
                                    upload={this.fileUpload.bind(this)}
                                />
                            )
                        })
                    }
                </SolicitaDiretrizTemplate>

                <ShowDetails
                    empId={this.state.empId}
                    rtId={this.state.rtId}
                    showEmp={this.state.showEmpDetails}
                    showRt={this.state.showRtDetails}
                    close={this.closeDetails.bind(this)}
                    empCollection={this.props.redux.empCollection}
                    rtCollection={this.props.redux.rtCollection}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        redux: state.cadastro
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadEmpData, loadRtData, loadProcessData, setColor }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(solicitaDiretriz);