import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { login, verify } from "./authActions";
import { reduxToastr } from "../cadastro/cadActions";

import LoginTemplate from "./loginTemplate";
import SignupTemplate from "./signupTemplate";
import ForgotPassword from "./forgotPassword";
import { formatMun } from "../config/formatMun";

class Login extends Component {
  state = {
    registered: true,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    municipio: "",
    forgotPassword: false
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async login(e) {
    e.preventDefault();
    this.clearAllCookies();
    let user;
    await axios
      .post("/api/login", {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => (user = res.data))
      .catch(err => {
        reduxToastr("Erro", "Usuário/senha invalidos.", "Erro!");
        return null;
      });

    if (user === "Aguardando verificação do usuário.") {
      await localStorage.setItem("verified", false);
      this.props.login(true);
      this.props.verify(false);
      return null;
    }

    let authenticate = () =>
      document.cookie.match("_sim-ad=", "") ? true : false;

    await localStorage.setItem("login", authenticate());
    if (!user) return;
    if (user.verified) {
      for (let [key, value] of Object.entries(user)) {
        await localStorage.setItem(key, value);
      }
      this.props.login(true);
      this.props.verify(true);
    }
  }

  async signup(e) {
    e.preventDefault();
    let newUser;
    const { name, surName, role, municipio } = this.state;

    if (name && surName && role && municipio) {
      await this.setState({
        municipio: formatMun(this.state.municipio),
        email: this.state.email.toLowerCase()
      });
      await axios
        .post("/api/signup", this.state)
        .then(res => {
          if (
            res.data === "Senhas não conferem." ||
            res.data === "Usuário já cadastrado." ||
            res.data === "E-mail inválido."
          ) {
            reduxToastr("err", res.data, "Erro!");
          } else {
            newUser = res.data;
            reduxToastr("sucess", "Usuário criado com sucesso", newUser.name);
          }
        })
        .catch(err => console.log(err.message));
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else alert("Favor preencher todos os campos.");
  }

  sendPassword = e => {
    const { recoveryMail } = this.state;
    axios
      .post("/api/forgotPassword", { recoveryMail })
      .then(res => {
        if (res.data === "E-mail não cadastrado.")
          reduxToastr("err", res.data, "Erro");
        else {
          reduxToastr(
            "sucess",
            "Uma nova senha foi enviada para o e-mail cadastrado",
            "Senha alterada."
          );
          setTimeout(() => {
            this.setState({ registered: true, forgotPassword: false });
          }, 3000);
        }
      })
      .catch(err => console.log(err));

    e.preventDefault();
  };

  clearAllCookies() {
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }

  render() {
    let { registered, forgotPassword } = this.state;
    return (
      <div>
        <div className="container col s12 m12 l6" style={{ marginTop: "1%" }}>
          <img src="/images/ad_login.png" className="z-depth-2" alt="" />
          <div className="card-panel">
            {registered && !forgotPassword ? (
              <LoginTemplate
                title="Entre no sistema"
                values={this.state}
                handleChange={this.handleChange.bind(this)}
                handleSubmit={this.login.bind(this)}
              />
            ) : registered && forgotPassword ? (
              <ForgotPassword
                title="Informe seu e-mail para a recuperção da senha"
                values={this.state}
                handleChange={this.handleChange.bind(this)}
                handleSubmit={this.sendPassword}
              />
            ) : (
              <SignupTemplate
                title="Cadastre-se"
                values={this.state}
                handleChange={this.handleChange.bind(this)}
                handleSubmit={this.signup.bind(this)}
              />
            )}
          </div>
          {registered && !forgotPassword ? (
            <div className="right">
              <p
                className="link"
                onClick={() => this.setState({ registered: false })}
              >
                {" "}
                Não possui usuário e senha? Cadastre-se.
              </p>
              <p
                className="link right"
                onClick={() => {
                  this.clearAllCookies();
                  this.setState({ forgotPassword: true });
                }}
              >
                {" "}
                Esqueceu sua senha?
              </p>
            </div>
          ) : registered && forgotPassword ? (
            <div>
              <p
                className="link right"
                onClick={() => this.setState({ forgotPassword: false })}
              >
                {" "}
                Voltar para login
              </p>
            </div>
          ) : (
            !registered &&
            !forgotPassword && (
              <p
                className="link right"
                onClick={() => this.setState({ registered: true })}
              >
                {" "}
                Já é cadastrado? Faça o login.
              </p>
            )
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ login, verify, reduxToastr }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
