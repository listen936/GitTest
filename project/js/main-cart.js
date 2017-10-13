require.config({
	shim:{ 
        cookie:["jquery"] 
    },
	paths: {
		cart: "cart",
		jquery:"jquery-2.1.4.min",
		cookie:"jquery.cookie",
		public: "public"
		
	}
})
require(["jquery","cookie","cart","public"], function($,$,cart,public){	
	public.public();
	cart.cart();	
})