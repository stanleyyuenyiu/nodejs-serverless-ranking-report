import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { addToCart, initCart } from 'Actions/cart';
class Product extends Component {

        constructor(props) {
            super(props);
           	this.setQty = this.setQty.bind(this);
        }

        getQty(){
            let {data,cart} = this.props;
            return typeof(cart[data.sku]) != "undefined" ? cart[data.sku] : data.qty ;
        }
        componentWillMount(){
            let qty = this.getQty();
        	if(qty > 0)
                this.props.initCart({qty:qty, sku:this.props.data.sku});
        }

        setQty(operator, sku){
            let qty = this.getQty();
            switch(operator)
        	{
        		case "+":
        			qty++;
                   // this.setState({qty:this.state.qty})
                    this.props.addToCart({qty:qty, sku})
                    
        		break;
        		case "-":
                    if(qty == 0)
                        return;
        			qty--;
                   // this.setState({qty:this.state.qty})
                    this.props.addToCart({qty:qty, sku})        
                    
        		break;
        	}
        }

        render() {

        	let {data} = this.props;
        	let qty = this.getQty();
            return (
            	<div>
            		<h3>{data.name}</h3>
            		<div className="row">
            			<div className="col-xs-7">
	            			<div className="pull-left text-center">
	            				<button onClick={()=>{this.setQty("+", data.sku)}}>+</button>
	            			</div>
	            			<div className="pull-left text-center qty">
	            				{qty}
	            			</div>
	            			<div className="pull-left  text-center">
	            				<button onClick={()=>{this.setQty("-", data.sku)}}>-</button>
	            			</div>
            			</div>
                        <div className="col-xs-5 text-right">
                            Unit Price : ${data.finalPrice}
                        </div>
            		</div>
            	</div>
            	)
        }
}

const mapDispatchToProps = { addToCart, initCart };
const mapStateToProps = state => {
    return {
        cart : state.cart.cartaction
    };
};
export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(Product);


