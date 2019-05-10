import React, { Component } from 'react';

import api from '../../services/api';

import logo from '../../assets/logo.svg';
import './styles.css';

export default class Main extends Component {
  state = {
    newBox: ''
  }

  handleCreateBox = async (e) => {
    e.preventDefault();
    const response = await api.post('/boxes', {
      title: this.state.newBox
    });
    this.props.history.push(`/box/${response.data._id}`);
  }

  render() {
    return (
      <div className="main-container">
        <form onSubmit={this.handleCreateBox}>
          <img src={logo} alt="Logo RocketBox" />
          <input placeholder="Criar um Box" onChange={text => this.setState({ newBox: text.target.value })} />
          <button>Criar</button>
        </form>
      </div>
    );
  }
}
