import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content" className='center'>
        <h1 className='heading1'>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const desc = this.productDesc.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.createProduct(name, desc, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productDesc"
              type="text"
              ref={(input) => { this.productDesc = input }}
              className="form-control"
              placeholder="Product Description"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Register Product</button>
        </form>
        <p>&nbsp;</p>
        <br></br>
        <h1 className='heading1'>Buy Product</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.products.map((product, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{product.desc}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    {!product.purchased
                      ? <button
                        name={product.id}
                        value={product.price}
                        onClick={(event) => {
                          this.props.buyProduct(event.target.name, event.target.value)
                        }}
                      >
                        Buy
                      </button>
                      : <b>
                        Product Sold
                      </b>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
