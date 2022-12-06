import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Ecommerce from '../abis/Ecommerce.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async setAccountListener(provider) {
    provider.on("accountsChanged", (accounts) => {
      this.setState({ account: accounts[0] })
    })
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    // setAccountListener(web3.givenProvider);
    web3.givenProvider.on("accountsChanged", (accounts) => {
      this.setState({ account: accounts[0] })
    })
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    const networkData = Ecommerce.networks[networkId]
    if (networkData) {
      const ecommerce = web3.eth.Contract(Ecommerce.abi, networkData.address)
      this.setState({ ecommerce })
      const productCount = await ecommerce.methods.productCount().call()
      this.setState({ productCount })

      for (var i = 1; i <= productCount; i++) {
        const product = await ecommerce.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('Ecommerce contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this)
    this.buyProduct = this.buyProduct.bind(this)
  }

  createProduct(name, desc, price) {
    this.setState({ loading: true })
    this.state.ecommerce.methods.createProduct(name, desc, price).send({ from: this.state.account })
      .once('transaction', (receipt) => {
        this.setState({ loading: false })
      })
  }

  buyProduct(id, price) {
    this.setState({ loading: true })
    this.state.ecommerce.methods.buyProduct(id).send({ from: this.state.account, value: price })
      .once('transactionHash', (receipt) => {
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid middle">
          <div>
            <main role="main">
              {this.state.loading
                ? <div id="loader" className="loader"><p className="text-center">Loading...</p></div>
                : <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                  buyProduct={this.buyProduct} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;