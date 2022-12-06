pragma solidity ^0.5.0;

contract Ecommerce {
    uint256 public productCount = 0;
    mapping(uint256 => Product) public products;

    struct Product {
        uint256 id;
        string name;
        string desc;
        uint256 price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint256 id,
        string name,
        string desc,
        uint256 price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint256 id,
        string name,
        string desc,
        uint256 price,
        address payable owner,
        bool purchased
    );

    function createProduct(
        string memory _name,
        string memory _desc,
        uint256 _price
    ) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_price > 0, "Price cannot be less than or equal to 0");

        productCount = productCount + 1;
        products[productCount] = Product(
            productCount,
            _name,
            _desc,
            _price,
            msg.sender,
            false
        );

        emit ProductCreated(
            productCount,
            _name,
            _desc,
            _price,
            msg.sender,
            false
        );
    }

    function buyProduct(uint256 _id) public payable {
        Product memory _product = products[_id];

        require(
            _product.id > 0 && _product.id <= productCount,
            "Product not found"
        );
        require(
            msg.value == _product.price,
            "The value must be equal to the price"
        );
        require(!_product.purchased, "Cannot purchase unlisted product");
        require(_product.owner != msg.sender, "The buyer cannot be the sender");

        address(_product.owner).transfer(msg.value);
        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;

        emit ProductPurchased(
            productCount,
            _product.name,
            _product.desc,
            _product.price,
            msg.sender,
            true
        );
    }
}
