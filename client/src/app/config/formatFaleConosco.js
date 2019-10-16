const formatFaleConosco = (person, email, subject, mensagem) => {

    return `
        <style>
        .box {
            position: relative;
            font-size: 1rem;
            font-family: sans-serif;
            background-color: white;
            padding: 2%;
            border: 1px solid #000;
            text-align: justify;
            text-justify: inter-word;
            border: 1px solid #bbbbbb;
            border-radius: 1%;
        }

        .msg {
            margin-top: 1%
        }
        </style>

        <div class="box">
            <em><strong>Fale Conosco </strong>- Mensagem recebida</em>
            <br />
            <p><strong>De: </strong>${person}</p>
            <p><strong>E-mail: </strong>${email}</p>
            <p><strong>Assunto: </strong>${subject}</p>
        </div>

        <div class="box msg">
            <p>
                <strong>Mensagem: </strong>
            </p>
            <p id="tst"> ${mensagem} </p>

            <br /><br />
            <hr />
            <p>
                <a href="http://anuencia.agenciarmbh.mg.gov.br/" target="_blank">Anuência Digital</a>
            </p>

        </div>
    `
}

export default formatFaleConosco