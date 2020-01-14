import React, { Component } from "react";
import axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactQuill from "react-quill";

import {
  loadEmpData,
  loadRtData,
  loadProcessData,
  loading,
  reduxToastr
} from "../cadastro/cadActions";
import MostrarOficio from "./mostrarOficio";
import { sendMail } from "../common/sendMail";
import { logout } from "../auth/logout";
//import { getTecnico } from '../common/getTecnico'

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons

  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"] // remove formatting button
];

const modules = { toolbar: toolbarOptions };

class AnuenciaForm extends Component {
  state = {
    color: "",
    text: "",
    mostrarOficio: false,
    oficio: "",
    textolivre: ""
  };

  componentDidMount() {
    !this.props.cadastro.empCollection[0] ? this.props.loadEmpData() : void 0;
    !this.props.cadastro.rtCollection[0] ? this.props.loadRtData() : void 0;
    !this.props.cadastro.processCollection[0]
      ? this.props.loadProcessData()
      : void 0;

    let color = document.getElementById("setcolor").style.backgroundColor;
    const ano = new Date().getFullYear();
    let textolivre = "OF. Nº XXX/" + ano + "-Agência RMBH.DR";
    this.setState({ setColor: color, textolivre: textolivre });
    //console.log(this.props)
  }

  handleChange(value) {
    this.setState({ ...this.state, text: value });
  }
  
  handleChangeGeneric = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  savePdf() {
    this.setState({ mostrarOficio: true });
  }

  async enviaPendencias(e) {
    e.preventDefault();
    const { process, empreend, rt } = this.props;

    const { modalidade, nomeEmpreendimento, munEmpreendimento } = process;

    const user = { ...localStorage };

    const pendCounter = this.props.process.processHistory.filter(log =>
      log.label.match("Análise")
    );

    const label = `Análise ${pendCounter.length + 1}`;
    const oficio = document.getElementById("oficio").outerHTML;
    this.props.loading(true);
    this.setState({ oficio: oficio });
    try {
      await axios.put("/api/editProcess", {
        item: {
          _id: this.props.process._id,
          status: "Pendências",
          tecnico: user.name + " " + user.surName
        },
        processHistory: {
          label: label,
          createdAt: new Date(),
          pendencias: oficio,
          user: {
            nome: user.name + " " + user.surName,
            email: user.email
          }
        }
      });
      this.props.loading(false);
      await reduxToastr("sucess", "Pendências para a emissão de anuência.");
      await sendMail(
        empreend.email,
        rt.emailRt,
        empreend.nome,
        modalidade,
        nomeEmpreendimento,
        munEmpreendimento,
        "Pendências para a emissão de anuência."
      );
      await this.props.close();
      this.props.loadProcessData();
    } catch (err) {
      logout(err);
    }
  }

  render() {
    const { empreend, rt, process, tecnicos, prefeituras } = this.props;
    const enableAnuencia = () =>
      this.state.mostrarOficio ? false : "disabled";

    return (
      <div style={{ height: "100%" }}>
        <div className="col s9">
          <label>Número do Ofício</label>
          <input
            className="input"
            type="text"
            name="textolivre"
            placeholder="Texto livre de até 45 caracteres para número do ofício."
            maxLength="45"
            onChange={this.handleChangeGeneric}
            value={this.state.textolivre}
          />
        </div>
        <div>
          <label>Texto do Ofício</label>
          <ReactQuill
            value={this.state.text}
            onChange={this.handleChange.bind(this)}
            modules={modules}
            theme="snow"
            style={{
              background: "#fff",
              height: "50vh",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "1%",
              overflow: "hidden"
            }}
          />
        </div>
        <MostrarOficio
          mostrarOficio={this.state.mostrarOficio}
          content={this.state.text}
          oficio={this.state.oficio}
          process={process}
          empreend={empreend}
          rt={rt}
          tecnicos={tecnicos}
          prefeituras={prefeituras}
          textolivre={this.state.textolivre}
        />

        <button
          className="btn right"
          onClick={this.enviaPendencias.bind(this)}
          disabled={enableAnuencia()}
        >
          {" "}
          Enviar{" "}
        </button>
        <button
          style={{ marginRight: "10px" }}
          className="btn right"
          onClick={this.savePdf.bind(this)}
          disabled={!enableAnuencia()}
        >
          {" "}
          Pré-visualizar{" "}
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cadastro: state.cadastro
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { loadEmpData, loadRtData, loadProcessData, loading, reduxToastr },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AnuenciaForm);
