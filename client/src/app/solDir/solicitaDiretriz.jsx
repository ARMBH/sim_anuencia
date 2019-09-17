import React, { Component } from "react";
import axios from "axios";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  loadEmpData,
  loadRtData,
  loadProcessData,
  loadTecnicos,
  loadFilesData,
  setColor,
  loading,
  reduxToastr
} from "./../cadastro/cadActions";
import { sendMail } from "../common/sendMail";
import { logout } from "../auth/logout";
import { sortList } from "../functions/sort";

import SolicitaDiretrizTemplate from "./solicitaDiretrizTemplate";
import SolicitaDiretrizRow from "./solicitaDiretrizRow";
import { solDirConfig } from "../config/configLabels";
import ShowDetails from "../common/showDetails";

class solicitaDiretriz extends Component {
  constructor() {
    super();
    this.escFunction = event => {
      const { selectedId, showEmpDetails, showRtDetails, map } = this.state;
      if (event.keyCode === 27) {
        if (map) this.showMap();
        else if (showEmpDetails || showRtDetails) this.closeDetails();
        else if (selectedId) this.clearSearch();
      }
    };
  }

  state = {
    searchValue: "",
    dataMatch: [],
    toggleUpload: false,
    selectedId: "",
    checked: null,
    files: [],
    form: null,
    dirMunFile: "",
    levPlanFile: "",
    dirDaeFile: "",
    kml: "",
    showEmpDetails: false,
    showRtDetails: false,
    empId: "",
    rtId: "",
    map: false,
    filter: "nomeEmpreendimento"
  };

  async componentDidMount() {
    let {
      empCollection,
      rtCollection,
      processCollection,
      tecCollection
    } = this.props.redux;
    !empCollection[0] ? this.props.loadEmpData() : void 0;
    !processCollection[0] ? await this.props.loadProcessData() : void 0;
    !rtCollection[0] ? this.props.loadRtData() : void 0;
    !tecCollection[0] ? this.props.loadTecnicos() : void 0;

    this.props.loadFilesData();

    let processes = this.props.redux.processCollection.filter(
      el => el.status === "Processo cadastrado"
    );
    this.setState({ processes });

    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  handleSearch(e) {
    const { name, value } = e.target;

    if (name === "select") {
      this.setState({ filter: value });
    } else {
      this.setState({
        ...this.state,
        searchValue: e.target.value,
        checked: false
      });
      let clearRadio = document.getElementsByName("group1");
      clearRadio.forEach(radio => (radio.checked = false));
    }
  }

  clearSearch(e) {
    this.setState({ ...this.state, searchValue: "", checked: null });
    document.getElementsByName("search")[0].value = "";
    let clearRadio = document.getElementsByName("group1");
    clearRadio.forEach(radio => {
      radio.checked = false;
    });
  }

  async handleSelect(e) {
    await this.setState({
      ...this.state,
      selectedId: e.target.value.replace(/,/g, ""),
      checked: e.currentTarget.id
    });
    document.getElementById(this.state.checked).checked = "checked";

    const selectedProcess = this.props.redux.processCollection.filter(
      e => e._id === this.state.checked
    )[0];
    this.setState({ selectedProcess });
    //5d1e4aa7d3473720847685ed
    //5d1facb97b66702b945be1b6
  }

  async fileUpload(e) {
    let { name, files } = e.target;
    console.log(files[0].type);
    if (name === "kml") {
      //if (files[0] && files[0].type !== "application/vnd.google-earth.kml+xml") {
      if (files[0] && files[0].name.slice(-3) !== "kml") {
        document.getElementsByName(name)[0].value = "";
        alert("Favor inserir a delimitação da gleba em formato kml.");
      }
    }

    if (name === "kml" || name === "dirDaeFile") {
      if (files[0] && files[0].size > 2097152) {
        document.getElementsByName(name)[0].value = "";
        alert("Arquivo excedeu o limite permitido (2MB)!");
      }
    }

    if (name === "levPlanFile" || name === "dirMunFile") {
      if (files[0] && files[0].size > 5242880) {
        document.getElementsByName(name)[0].value = "";
        alert("Arquivo excedeu o limite permitido (5MB)!");
      }
    }

    let formData = new FormData();
    formData.append("processId", this.state.selectedId);
    this.setState({
      ...this.state,
      [name]: files[0]
    });

    let k = [];
    await solDirConfig.map(item => k.push(item.nameInput));

    await k.forEach(inputName => {
      for (let keys in this.state) {
        keys.match(inputName)
          ? formData.append(inputName, this.state[keys])
          : void 0;
      }
    });
    this.setState({ form: formData });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const processo = this.props.redux.processCollection.filter(el =>
        el._id.match(this.state.selectedId)
      )[0],
      emp = this.props.redux.empCollection.filter(el =>
        el._id.match(processo.empId)
      )[0],
      rt = this.props.redux.rtCollection.filter(el =>
        el._id.match(processo.rtId)
      )[0],
      user = { ...localStorage };

    const { modalidade, nomeEmpreendimento, munEmpreendimento } = processo,
      { tecCollection } = this.props.redux,
      { form } = this.state,
      tecnico = tecCollection.filter(el =>
        el.municipios.some(mun => mun === processo.munEmpreendimento)
      )[0];

    let filesArray = [],
      reentrada = [],
      countFiles = 0;

    if (form)
      for (let pair of form.entries()) {
        if (pair[1] && pair[1] !== "undefined") {
          countFiles = countFiles + 1;
        }
      }
    reentrada = processo.processHistory.filter(
      log => log.label === "Pendências para emissão de diretrizes"
    );

    if (countFiles > 4 || reentrada.length > 0) {
      this.props.loading(true);
      try {
        await axios.post("/api/fileUpload", this.state.form).then(res => {
          const files = res.data.file;
          files.forEach(file => filesArray.push(file));
        });
        await axios.put("/api/editProcess", {
          item: {
            _id: this.state.selectedId,
            status: "Aguardando Diretrizes Metropolitanas",
            tecnico: tecnico.name + " " + tecnico.surName
          },
          processHistory: {
            label: "Diretrizes metropolitanas solicitadas",
            createdAt: new Date(),
            files: filesArray,
            user: {
              nome: user.name + " " + user.surName,
              email: user.email
            }
          }
        });
        this.props.loading(false);
        await reduxToastr("sucess", "Diretrizes Metropolitanas solicitadas.");
        await sendMail(
          emp.email,
          rt.emailRt,
          emp.nome,
          modalidade,
          nomeEmpreendimento,
          munEmpreendimento,
          "Diretrizes Metropolitanas solicitadas."
        );
        await this.clearSearch();
        await this.closeDetails();
        await this.setState({ form: null });
        this.props.loadProcessData() && this.props.loadFilesData();
      } catch (err) {
        logout(err);
        console.log(err);
      }
    } else alert("Favor anexar todos os arquivos solicitados.");
  }

  empDetails(e) {
    this.setState({
      showEmpDetails: true,
      showRtDetails: false,
      empId: e.target.id
    });
  }

  rtDetails(e) {
    this.setState({
      showEmpDetails: false,
      showRtDetails: true,
      rtId: e.target.id
    });
  }

  closeDetails() {
    this.setState({
      showEmpDetails: false,
      showRtDetails: false,
      empId: "",
      rtId: ""
    });
  }

  sort = criteria => {
    let { reverse, processes } = this.state;
    let orderedList;

    orderedList = sortList(processes, criteria);
    if (reverse === true) orderedList.reverse();
    this.setState({ processes: orderedList, reverse: !reverse });
  };

  render() {
    let { dataMatch, reverse, processes, filter } = this.state;

    let filteredList = [];
    if (processes) filteredList = processes;

    let input = this.state.searchValue.toLowerCase();
    if (filteredList && (input && !this.state.checked)) {
      dataMatch = filteredList.filter(el =>
        el[filter].toLowerCase().match(input)
      );
    } else if (
      filteredList &&
      (this.state.checked || (this.state.checked && input))
    ) {
      dataMatch = filteredList.filter(el =>
        el._id.toLowerCase().match(this.state.selectedId)
      );
    } else {
      dataMatch = filteredList;
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
          reverse={reverse}
          sort={this.sort}
        >
          {solDirConfig.map((item, i) => {
            return (
              <SolicitaDiretrizRow
                object={item}
                key={i}
                upload={this.fileUpload.bind(this)}
                showMap={this.showMap}
              />
            );
          })}
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
    );
  }
}

function mapStateToProps(state) {
  return {
    redux: state.cadastro
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadEmpData,
      loadRtData,
      loadProcessData,
      loadFilesData,
      loadTecnicos,
      loading,
      setColor
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(solicitaDiretriz);
