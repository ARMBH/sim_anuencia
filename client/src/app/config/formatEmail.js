const formatEmail = (empreend, modalidade, nomeEmpreendimento, munEmpreendimento, status) => {

    return `
    <div style=" 
        position: relative;         
        font-size: 1rem; 
        font-family: sans-serif;
        background-color: white;  
        padding: 3%; 
        border: 1px solid #000;
        text-align: justify;
        text-justify: inter-word;
        border: 1px solid #bbbbbb;
        border-radius: 1%;
    ">    
            <strong>A/C ${empreend}</strong>
            <br />
            <p>Foi registrada uma movimentação do processo que solicita a emissão de Anuência 
                Prévia para o ${modalidade} <strong>${nomeEmpreendimento}</strong>, situado no município de 
                ${munEmpreendimento}:</p>

            <p><strong> ${status} </strong></p>

            <p>Para maiores informações, visite o site
        <a href="http://anuencia.agenciarmbh.mg.gov.br/" target="_blank">Anuência Digital</a>
            </p>            
            <p>Atenciosamente,</p><p><em>Equipe da Agência de Desenvolvimento da RMBH</em></p>
        </div>
    `
}

export default formatEmail