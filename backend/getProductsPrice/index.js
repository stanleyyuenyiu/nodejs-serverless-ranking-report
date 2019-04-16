'use strict';

 
exports.handler = function(event, context, callback){
	let group = event.group || '';
	let qtys = event.qtys || [];

    if(typeof(event.items) == "undefined")
    {
        callback(null, null);
    }
    
	event.items.map((item,i)=>{
		let finalPrice = item.price;
		if(item.group_price.length > 0)
		{
			let gPrice = item.group_price.filter(g=>g.group == group);
			
			if(gPrice != null && gPrice.length > 0)
			{
				finalPrice = Math.min(gPrice[0].price, finalPrice);
			}
		}
		item.qty = 0 ;
		let arr = qtys.filter(q=>q.sku == item.sku);
	
		if(arr != null && arr.length > 0)
		{
		    item.qty = arr[0].qty
		    if(item.tier_price.length > 0){
    			let tPrice = item.tier_price.filter(t=> t.qty >= arr[0].qty && t.group == group);
    			
    			if(tPrice != null && tPrice.length > 0)
    			{
    				finalPrice = Math.min(tPrice[0].price, finalPrice);
    			}
		    }
		}
		item.finalPrice = finalPrice;
	})
   callback(null, event.items);
}