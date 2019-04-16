import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { addToCart, initCart, calTotal } from 'Actions/cart';
import Total from 'Components/Carts/Total';
class Cart extends Component {

        constructor(props) {
            super(props);
           	this.timeout = null;
            this.cart = {};
            this.group = "";
        }

        
        componentDidMount(){
        }

        render() {
        	var self = this;
        	if(this.timeout != null)
        	{
        		clearTimeout(this.timeout);
        	}

            let group = typeof(this.props.customer.group) !== "undefined" ? this.props.customer.group : "";
        	if(!isEmpty(self.props.cart))
        	{
                this.cart  = self.props.cart;
        		let request = [];
        		for(var key in self.props.cart) {
			        request.push({"sku": key, "qty": self.props.cart[key]});
			    }
        		this.timeout = setTimeout(function(){ 
                    self.props.calTotal({"qtys":request, "group":group}) 
                }, 1000);
        	}
            return (
            	<div><Total/></div>
            )
        }
}


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


const mapDispatchToProps = { calTotal };
const mapStateToProps = state => {

    return {
    	cart : state.cart.cartaction,
        customer: state.customer.customerstatus
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(Cart);


