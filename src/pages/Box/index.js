import React, { Component } from 'react';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import './styles.css';

import api from '../../services/api';

// import logo from '../../assets/logo.svg';
import { FaFileAlt, FaDropbox, FaCloudUploadAlt } from 'react-icons/fa';

export default class Box extends Component {
  state = { box: {}}
  async componentDidMount() {
    this.subscribeToNewFiles();
    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`);
    this.setState({ box: response.data });
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket('https://omni-api.herokuapp.com');
    io.emit('connectRoom', box);
    io.on('file', data => {
      this.setState({ box: { ...this.state.box, files: [ data, ...this.state.box.files]}})
    })
  }

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;
      data.append('file', file);

      api.post(`/boxes/${box}/files`, data);
    })
  }
  render() {
    
    return (
      <div id="box-container">
        <header>
          <FaDropbox size={50} color="#7159C1" />
          <h1 className="logoTitle">BlandeBox</h1>
          <h1>{this.state.box.title}</h1>
        </header>
        <Dropzone onDropAccepted={this.handleUpload} >
          {
            ({ getRootProps, getInputProps}) => (
              <div className="upload" { ...getRootProps() }>
                <input { ...getInputProps() } />
                <FaCloudUploadAlt size={50} color="#7159C1" />
                <p>Arraste arquivos ou clique aqui</p>
              </div>
            )
          }
        </Dropzone>
        <ul>
          { this.state.box.files && this.state.box.files.map(file => (
            <li key={file._id}>
              <a href={ file.url } className="fileInfo">
                <FaFileAlt size={24} color="#A5CFFF" />
                <strong>{ file.title }</strong>
              </a>
              <span>{distanceInWords(file.createdAt, new Date(), {locale: pt })}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
