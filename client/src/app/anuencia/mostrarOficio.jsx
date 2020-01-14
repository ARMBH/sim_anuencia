import React from 'react';
import OficioHeader from './oficioHeader'

const MostrarOficio = (props) => {
    let { mostrarOficio, content, redux, process, empreend, rt, tecnicos, prefeituras, textolivre } = props

    const user = { ...localStorage },
        tecnico = tecnicos.filter(el => el.email.match(user.email))[0],
        name = tecnico ? tecnico.name : user.name,
        surName = tecnico ? tecnico.surName : user.surName,
        cau = tecnico ? tecnico.cau : 'não registrado'

    if (mostrarOficio) {
        return (
            <div id='oficio'
                className='z-depth-3'
                style={{
                    position: 'relative',
                    borderRadius: '15px',
                    width: '100%',
                    backgroundColor: 'white',
                    padding: '15px 0px 0px 30px',
                    border: '1px solid #ddd',
                    marginBottom: '25px'
                }}
            >
                <OficioHeader
                    redux={redux}
                    process={process}
                    empreend={empreend}
                    rt={rt}
                    prefeituras={prefeituras}
                    textolivre={textolivre}
                />
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
                <center>
                    <strong>
                        <p>{name} {surName}</p>
                    </strong>
                    <p>CAU/MG {cau}</p>
                </center>
            </div>
        )
    }
    else return null
}

export default MostrarOficio;