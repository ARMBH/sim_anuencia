import React from 'react';
import { allFilesLabels } from './configLabels';
import { BackButton } from '../common/buttons'
import showDate from './showDate'
import { relative } from 'path';

const labels = (fieldName) => {

    let allFilesArray = []
    allFilesArray = allFilesLabels()
    console.log(allFilesArray)
    let label = allFilesArray.filter(e => e.nameInput.match(fieldName))
    return label[0].label
}

const formatFileSize = (bytes) => {

    if (bytes > 1024 && bytes < 1048576) {
        return Math.round(bytes / 1024) + ' KB'

    } else if (bytes >= 1048576 && bytes < (1048576 * 1024)) {
        return ((bytes / 1024)/1024).toFixed(2) + ' MB'
    } else {
        return bytes+' bytes'
    }


}

const ShowFiles = (props) => {
    let { showFiles, close, processCollection, selectedId, filesCollection, download } = props


    let process = processCollection.filter(el => el._id.match(selectedId))
    let files
    if (filesCollection && filesCollection[0]) {
        files = filesCollection.filter(el => el.metadata.processId.match(selectedId))
    }


    if (showFiles && (process && (process[0] && (files && files[0])))) {

        return (
            <div className='card'
                style={{
                    position: 'relative',
                    margin: '0px 10%',
                    border: '3px solid #000000',
                    backgroundColor: 'white',
                    paddingLeft: '20px'
                }}>
                <div className="row">
                    <div className="row">
                        <h5> <img src="/images/folderIcon2.jpg" style={{ marginRight: '20px' }} /> Arquivos > {process[0].nomeEmpreendimento}</h5>
                    </div>
                    <div className="row">
                        <div className="col s1">
                            <img src="/images/genericFile.png" />
                        </div>
                        <div className="col s5">
                            <h6 style={{ fontSize: '1.2em', fontWeight: 500 }}>Arquivo</h6>

                        </div>
                        <div className="col s3">
                            <h6 style={{ fontSize: '1.2em', fontWeight: 500 }}>Data de Upload</h6>
                        </div>
                        <div className="col s3">
                            <h6 style={{ fontSize: '1.2em', fontWeight: 500 }}>Tamanho</h6>
                        </div>
                    </div>
                    {files.map(file =>
                        <div>
                            <div className="row">
                                <div className="col s1">
                                    <img src="/images/genericFile.png" />
                                </div>
                                <div id={file._id}
                                    style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                                    className="col s5 left"
                                    onClick={download}>
                                    {labels(file.metadata.fieldName)}</div>
                                <div className="col s3">
                                    {showDate(file.uploadDate)}
                                </div>
                                <div className="col s3">
                                    {formatFileSize(file.length)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{
                    position: 'absolute',
                    top: '0%',
                    right: '0%'
                }}>
                    <BackButton
                        onClick={close}
                        icon='close'
                        size='btn-tiny'
                    />
                </div>
            </div>
        )
    } else if (showFiles && (process && (process[0] && (files && !files[0])))) {

        return (
            <div className='card'
                style={{
                    position: 'fixed',
                    top: '30%',
                    right: '33%',
                    left: '33%',
                    border: '3px solid #000000',
                    backgroundColor: 'white',
                    paddingLeft: '20px'
                }}>
                <div className="row">
                    <div className="row">
                        <h5>Arquivos > {process[0].nomeEmpreendimento}</h5>
                    </div>
                    <div className='col s6'>Nenhum arquivo encontrado</div>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '0%',
                    right: '0%'
                }}>
                    <BackButton
                        onClick={close}
                        icon='close'
                        size='btn-tiny'
                    />
                </div>
            </div>
        )
    } else {
        return null
    }

};

export default ShowFiles;