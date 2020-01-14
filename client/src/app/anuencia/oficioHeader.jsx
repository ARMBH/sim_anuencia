import React from "react";
import "../css/reactQuill.css";

const OficioHeader = props => {
  const { empreend, process, prefeituras, textolivre } = props;

  function date() {
    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro"
    ];
    const data = new Date();
    return `${data.getDate()} de ${
      meses[data.getMonth()]
    } de ${data.getFullYear()}`;
  }
  const pref = prefeituras.filter(el =>
    el.municipio.toLowerCase().match(process.munEmpreendimento.toLowerCase())
  )[0];
  const line = { lineHeight: 0.8 };
  return (
    <div>
      <div className="row">
        <img
          className="col s12"
          src="/images/governo_header3.jpg"
          style={{ paddingRight: "20px" }}
          alt=""
        />
      </div>
      <p className="oficioHeader">
        <span className="left">
          <b>{textolivre}</b>
        </span>
        <span className="right">Belo Horizonte, {date()}.</span>
      </p>
      <br></br>
      <p />
      <p />
      <p className="ql-align-justify" style={line}>
        {" "}
        {pref.vocativo1}{" "}
      </p>
      <p className="ql-align-justify" style={line}>
        {" "}
        <strong>{pref.nome}</strong>{" "}
      </p>
      <p className="ql-align-justify" style={line}>
        {pref.cargo}
      </p>
      <p className="ql-align-justify" style={line}>
        Prefeitura de {process.munEmpreendimento}
      </p>
      <p className="ql-align-justify" style={line}>
        {pref.endereco}
      </p>
      <p className="ql-align-justify" style={line}>
        CEP: {pref.cep} – {process.munEmpreendimento}, MG
      </p>
      <p />
      <p className="ql-align-justify">
        <strong>Assunto:</strong> Empreendimento "{process.nomeEmpreendimento}",
        Processo RMBH nº {process.nProcess}{" "}
      </p>
      <p />
      <p className="ql-align-justify">{pref.vocativo2}, </p>
      <p className="ql-align-justify">
        Em resposta ao ofício da Prefeitura Municipal de{" "}
        {process.munEmpreendimento}, que solicita análise e emissão de Selo de
        Anuência Prévia para o {process.modalidade} de uma área de{" "}
        {process.area}m², situado no lugar denominado{" "}
        <strong>{process.nomeEmpreendimento}</strong>, de interesse de
        <strong> {empreend.nome}</strong>, informamos que:
      </p>
      <p></p>
    </div>
  );
};

export default OficioHeader;
