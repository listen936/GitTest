require.config({
	shim:{ 
        cookie:["jquery"] 
    },
	paths: {
		goods: "goods",
		jquery:"jquery-2.1.4.min",
		cookie:"jquery.cookie",
		parabola:"parabola",
		public: "public"
	}
})
require(["jquery","cookie","parabola","goods","public"], function($,$,parabola,goods,public){
	public.public();
	goods.goods();
})