import React, { Component } from 'react';
import axios from 'axios'
import ProcessTemplate from './processTemplate'

class ProcessContainer extends Component {

    state = {
        selectedOption: '',
        selectedId: '',
        logDetails: false,
        logIndex: '',
        notaTecnica: '',
        anuenciaFile: '',
        form: ''
    }

    optionSelect(e) {
        this.setState({ selectedOption: e.target.id })
    }

    componentDidMount() {
        this.setState({ selectedId: this.props.data.selectedId })
    }
    componentWillUnmount() {
        this.props.clear()
    }

    divConfig(e) {
        let id = e.name
        if (id !== this.state.selectedOption) {
            let format = {
                stylez:
                {
                    minHeight: '8vh', border: '1px solid #ddd', borderRadius: '2%', borderBottom: '', borderTopLeftRadius: '15%',
                    borderTopRightRadius: '15%'
                },
                class: 'col s12 m6 l3 z-depth-2'
            }
            return format
        } else {
            let format = {
                stylez:
                {
                    minHeight: '8vh', border: '2px solid #bbb', borderRadius: '2%', borderBottom: '', borderTopLeftRadius: '15%',
                    borderTopRightRadius: '15%', backgroundColor: '#fcfcfc'
                },
                class: 'col s12 m6 l3'
            }
            return format
        }

    }

    showLog(e) {
        this.setState({ logIndex: e.target.id, logDetails: true })
    }

    clearLog() {
        this.setState({ logDetails: false, logIndex: '' })
    }

    fileUpload(e) {

        let formData = new FormData()
        formData.append('processId', this.state.selectedId)
        this.setState({
            ...this.state, [e.target.name]: e.target.files[0]
        })

        let k = ['notaTecnica', 'anuenciaFile']



        setTimeout(() => {
            k.map(inputName => {
                for (let keys in this.state) {
                    keys.match(inputName) ?
                        (formData.append(inputName, this.state[keys]))
                        : void 0
                }
            })
        }, 100);
        setTimeout(() => {
            this.setState({ form: formData })
        }, 200);
    }



    async handleSubmit(e) {
        e.preventDefault()
        let filesArray = []
        if (this.state.notaTecnica === '' || this.state.anuenciaFile === '') {
            console.log(this.state)
            alert('Favor anexar a nota técnica e a certidão de anuência')
        } else {
            await axios.post('/api/anuenciaUpload', this.state.form)
                .then(res => {

                    for (let key in res.data.file) {
                        filesArray.push({
                            fieldName: res.data.file[key][0].fieldname,
                            id: res.data.file[key][0].id,
                            originalName: res.data.file[key][0].originalname,
                            uploadDate: res.data.file[key][0].uploadDate,
                            filename: res.data.file[key][0].filename,
                            fileSize: res.data.file[key][0].size
                        })
                    }
                })
            await axios.put(('/api/fileObject'), {
                itemId: this.state.selectedId,
                filesArray: filesArray,
                status: 'Processo Anuído'
            })

            await axios.put(('/api/processLog'), {
                id: this.state.selectedId,
                processLog: {
                    label: 'Processo Anuído',
                    createdAt: new Date(),
                    files: filesArray
                }
            })
            window.location.reload()
        }
    }

    render() {
        let { clear, data, redux, close, download, changeValue } = this.props
        let process
        let empreend
        let rt
        if (data.selectedId) {
            process = redux.processCollection.filter(el => el._id.match(data.selectedId))[0]
            if (process) {
                empreend = redux.empCollection.filter(el => el._id.match(process.empId))[0]
                rt = redux.rtCollection.filter(el => el._id.match(process.rtId))[0]
            }
        }
        if (data.selectedId) {
            data.showFiles = true

            return (
                <div className='container'>
                    <ProcessTemplate
                        data={data}
                        redux={redux}
                        clear={clear}
                        download={download}
                        close={close}
                        process={process}
                        empreend={empreend}
                        rt={rt}
                        match={this.props.match}
                        optionSelect={this.optionSelect.bind(this)}
                        selectedOption={this.state.selectedOption}
                        divConfig={this.divConfig.bind(this)}
                        changeValue={changeValue}
                        log={this.state}
                        showLog={this.showLog.bind(this)}
                        clearLog={this.clearLog.bind(this)}
                        upload={this.fileUpload.bind(this)}
                        submit={this.handleSubmit.bind(this)}
                    />
                </div>
            )
        }
    }
};

export default ProcessContainer;