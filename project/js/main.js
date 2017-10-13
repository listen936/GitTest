require.config({
	shim:{ 
        cookie:["jquery"] 
    },
	paths: {
		index: "index",
		jquery:"jquery-2.1.4.min",
		cookie:"jquery.cookie",
		public:"public"
	}
})
require(["jquery","cookie","index","public"], function($,$,index,public){
	
	index.index();
	public.public();

})
// require(["jquery","cookie","public"], function($,$,public){
	
	

// })