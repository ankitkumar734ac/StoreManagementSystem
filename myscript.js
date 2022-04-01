const Products=[
				{"prodcode":"PEP122","prodname":"Pepsi","price":12,"category":"Food","offer":"10%"},
				{"prodcode":"COK238","prodname":"Coke","price":15,"category":"Food","offer":"15%"},
				{"prodcode":"MIR411","prodname":"Mirinda","price":30,"category":"Food","offer":"20%"},
				{"prodcode":"RB0277","prodname":"Red	Bull","price":80,"category":"Food","offer":"None"},
				{"prodcode":"LUX831","prodname":"Lux","price":10,"category":"Soap","offer":"15%"},
				{"prodcode":"DOV672","prodname":"Dove","price":25,"category":"Soap","offer":"20%"},
				{"prodcode":"DET810","prodname":"Dettol","price":15,"category":"Soap","offer":"None"},
				{"prodcode":"PAN590","prodname":"Pantene","price":60,"category":"Shampoo","offer":"None"},
				{"prodcode":"SUN677","prodname":"Sunsilk","price":48,"category":"Shampoo","offer":"15%"},
				{"prodcode":"GAR004","prodname":"Garnier","price":75,"category":"Shampoo","offer":"10%"}
];
const Orders=[
				{"custname":"Jack Smith","mobile":"425361434","location":"Sector 14","slot":"12PM-2PM","value":72.6,"items":[{"prodcode":"PEP122","quantity":2},{"prodcode":"COK238","quantity":4}]},
				{"custname":"Mary Gomes","mobile":"723476123","location":"Sector 22","slot":"4PM-6PM","value":130.60,"items":[{"prodcode":"SUN677","quantity":2},{"prodcode":"LUX831","quantity":4},{"prodcode":"DET810","quantity":1}]},
				{"custname":"Tim May","mobile":"835099614","location":"Pioneer Chowk","slot":"Before 10AM","value":705,"items":[{"prodcode":"GAR004","quantity":6},{"prodcode":"RB0277","quantity":3},{"prodcode":"MIR411","quantity":2}]}
];
const Locations=['Sector 14A', 'Sector 15B','Sector	22', 'Pioneer Chowk'];
const Slots=['Before 10AM','10AM-12PM','12PM-2PM','2PM-4PM','4PM-6PM','After 6PM'];
let newOrder=[];

/*------------------------------New Order Operation-------------------------------*/

function removeOrder(ele){
	let code=ele.id;
	let ind=newOrder.findIndex(or=>or.prodcode==code);
	newOrder.splice(ind,1);
	showNewOrdertable();
}

function showNewOrdertable(db=newOrder){
	let txt='';
	txt+='<table class="table">';
	txt+='	<tr>';
	txt+='		<th class="th">Code</th>';
	txt+='		<th class="a" >Name</th>';
	txt+='		<th class="th" >Price</th>';
	txt+='		<th class="th" >Quantity</th>';
	txt+='		<th class="a">Discount</th>';
	txt+='		<th class="a">Net Amount</th>';
	txt+='<th></th>';
	txt+='	</tr>';
	txt+='	<tr>';

	const arr=db.map((itm)=>{
		let cl='td';
		let {prodcode,quantity}=itm;
		let pro=Products.find(pro=>pro.prodcode==prodcode);
		//console.log('pro1',pro);
		let {prodname,price,offer}=pro;
		let netAmount=calculateNetAmount(price,offer,quantity);
		let str='<tr><td class="'+cl+'">'+prodcode+'</td>';
		str+='<td class="'+cl+'">'+prodname+'</td>';
		str+='<td class="'+cl+'">'+price+'</td>';
		str+='<td class="'+cl+'">'+quantity+'</td>';
		str+='<td class="'+cl+'">'+offer+'</td>';
		str+='<td class="'+cl+'">'+netAmount+'</td>';
		str+='<td class="'+cl+'"><button class="butt" id="'+prodcode+'" onclick="removeOrder(this)">Remove</button> </td>';
		str+='</tr>';
		//console.log(str);
		return str;	
	});

	txt+=arr.join('');
	txt+='</table>';
	document.getElementById('order').innerHTML= txt;
}

function addToOrder(){
	let pcode=document.getElementById('orderSelect').value;
	let num=document.getElementById('quantitySelect').value;
	if(pcode=="0"){
		alert("Select a product");
	}else if(num=="0"){
		alert("Select quantity")
	}else{
		if(newOrder.length==0){
			let json={'prodcode':pcode,'quantity':parseInt(num)};
			newOrder.push(json);
		}else{
			let ind=newOrder.findIndex(pro=>pro.prodcode==pcode);
			if(ind==-1){
		//let product=Products.find(pro=>pro.prodcode==pcode);
		//console.log(product);
		//let {prodcode,prodname,price,category,offer}=product;
				let json={'prodcode':pcode,'quantity':num};
				newOrder.push(json);
			}else{
				let id=newOrder.findIndex(pro=>pro.prodcode==pcode);
				let q=newOrder[id].quantity;
				newOrder[id].quantity=(parseInt(q)+parseInt(num));
			}
		}
		showNewOrdertable(newOrder);
	}
}

function completeObder(){
	let name=document.getElementById('custname').value;
	let number=document.getElementById('mobile').value;
	let loc=document.getElementById('location').value;
	let time=document.getElementById('slot').value;
	
	if(name==''){
		alert('Enter customber name');
	}else if(number.length>=11 || number.length<=9){
		alert('Mobile number should have 10 digit');
	}else if(parseInt(number)==NaN){
		alert('Mobile number should have digit only');
	}else if(loc=='0'){
		alert('Select the location');
	}else if(time=="0"){
		alert('Select the delivery slot');
	}else if(newOrder.length==0){
		alert('Order some products')
	}else{
		let json={"custname":name,"mobile":number,"location":loc,"slot":time,"value":getTotalAmount(newOrder),"items":newOrder};
		Orders.unshift(json);
		cancleOrder();
		document.getElementById('order').innerHTML= '';
		showAllOrderForm();

	}
}

function getTotalAmount(db){
	let total=db.reduce((acc,curr)=>{
		let code=curr.prodcode;
		let pro=Products.find(pr=>pr.prodcode==code);
		let {price,offer}=pro;
		let quantity=curr.quantity;
		acc+=calculateNetAmount(price,offer,quantity);
		return acc;
	},0);
	return total;
}

function cancleOrder(){
	newOrder=[];
	showEnterOrderForm();
}

/*--------------------New Order Form-----------------------------------*/
function generateSelectForm(arr,dis,id){
	let mArr=arr.map(de=>{
			return '<option>'+de+'</option>';
	});
	let txt='';
	txt+='<td align="right">'+dis+'</td>';
	txt+='<td><select class="myselect" id="'+id+'">';
	txt+='		<option selected value=0 disabled>Choose '+dis+'</option>';
	txt+=mArr.join('');
	txt+='	</select></td>';
	return txt;
}
function generateInputForm(dis,id,text){
	let txt='<tr>';
	txt+='		<td align="right">'+dis+'</td>';
	txt+='	    <td><input type="'+text+'" id="'+id+'" name=""></td>';
	txt+='	</tr>';
	return txt;
}
function showEnterOrderForm(){
	let str='<table  style="   padding-left: 50px;">';
	str+=generateInputForm('Customer Name','custname','text');
	str+=generateInputForm('Mobile Number','mobile','number');
	
	str+='	<tr>';
	str+=generateSelectForm(Locations,'Location','location');
	str+='</tr>';

	str+='	<tr>';
	str+=generateSelectForm(Slots,'Delivery Slot','slot');
	str+='</tr>';

	str+='<tr>';
	let mArr=Products.map(de=>{
			return '<option>'+de.prodcode+'</option>';
	});
	str+='<td align="right">Add to Order</td>';
	str+='<td><select class="myselect" id="orderSelect">';
	str+='		<option selected value=0 disabled>Select Product</option>';
	str+=mArr.join('');
	str+='	</select>';
	str+='<select class="myselect" id="quantitySelect">';
	str+='		<option selected value=0 disabled>Select quantity</option>';
	str+='<option>1</option>';
	str+='<option>2</option>';
	str+='<option>3</option>';
	str+='<option>4</option>';
	str+='<option>5</option>';
	str+='<option>6</option>';
	str+='	</select>';
	str+='		<td><button class="butt" onclick="addToOrder()">Add to Order</button></td>';
	str+='</td>';
	str+='</tr>';
	str+='<tr>';
	str+='<td></td>		<td><button class="butt" onclick="completeObder()">Complete Order</button><button class="butt" onclick="cancleOrder()">Cancle Order</button></td>';
	str+='<tr>';
	str+='</table>';
	
	document.getElementById('show').innerHTML=str;
	showNewOrdertable();
}

/*-------------------------------Show All Orders Operations-------------------*/

function countItems(arr){
	let count=arr.reduce((acc,curr)=>{
		let {quantity}=curr;
		acc+=quantity;
		return acc;
	},0);
	return count;

}
function calculateNetAmount(price,offer,quantity){
	let dis='';
	if(offer=='None'){
		return (price*quantity);
	}
	for(let i=0;i<offer.length;i++){
		if(offer[i]>=0 && offer[i]<=9){
			dis+=offer[i];
		}else{
			break;
		}
	}
	dis=parseInt(dis);
	let total=quantity*price;
	return total-(total*dis)/100;
}
function getTable(db){
	let txt='';
	txt+='<table class="table">';
	txt+='	<tr>';
	txt+='		<th class="th">Code</th>';
	txt+='		<th class="a" >Name</th>';
	txt+='		<th class="th" >Price</th>';
	txt+='		<th class="th" >Quantity</th>';
	txt+='		<th class="a">Discount</th>';
	txt+='		<th class="a">Net Amount</th>';
	txt+='	</tr>';
	txt+='	<tr>';

	const arr=db.map((itm)=>{
		let cl='td';
		let {prodcode,quantity}=itm;
		let pro=Products.find(pro=>pro.prodcode==prodcode);
		//console.log('pro1',pro);
		let {prodname,price,offer}=pro;
		let netAmount=calculateNetAmount(price,offer,quantity);
		let str='<tr><td class="'+cl+'">'+prodcode+'</td>';
		str+='<td class="'+cl+'">'+prodname+'</td>';
		str+='<td class="'+cl+'">'+price+'</td>';
		str+='<td class="'+cl+'">'+quantity+'</td>';
		str+='<td class="'+cl+'">'+offer+'</td>';
		str+='<td class="'+cl+'">'+netAmount+'</td>';
		str+='</tr>';
		return str;	
	});

	txt+=arr.join('');
	txt+='</table>';
	return txt;
}
function showAllOrderForm(){
	const arr=Orders.map(ord=>{
		let {custname,mobile,location,slot,value,items}=ord;
		let str='<pre>Customer Name:'+custname+', Mobile:'+mobile+', Location:'+location+', Delivery Slot:'+slot;
		str+='\nOrder Value:'+value+', Number of items:'+countItems(items)	
		str+=getTable(items)+'</pre>';;	
		return str;
	});
	document.getElementById('show').innerHTML=arr.join('');
	document.getElementById('order').innerHTML= '';
}

/*-------------------------------------Show Product Operations---------------------*/

function showProductForm(){
	show();
	document.getElementById('order').innerHTML= '';
}

function show(db=Products){
	let txt='';
	txt+='<table class="table">';
	txt+='	<tr>';
	txt+='		<th class="th">Code</th>';
	txt+='		<th class="a" >Name</th>';
	txt+='		<th class="th" >Price</th>';
	txt+='		<th class="th" >Category</th>';
	txt+='		<th class="a">Discount</th>';
	txt+='	</tr>';
	txt+='	<tr>';

	const arr=db.map((pro,i)=>{
		let cl='';
		if(i%2==0)cl='td';
		else cl='td1';
		let {prodcode,prodname,price,category,offer}=pro;
		let str='<tr><td class="'+cl+'">'+prodcode+'</td>';
		str+='<td class="'+cl+'">'+prodname+'</td>';
		str+='<td class="'+cl+'">'+price+'</td>';
		str+='<td class="'+cl+'">'+category+'</td>';
		str+='<td class="'+cl+'">'+offer+'</td>';
		str+='</tr>';
		return str;	
	});

	txt+=arr.join('');
	txt+='</table>';
	document.getElementById('show').innerHTML=txt;
}

/*------------------------NavBar Operations----------------------*/

function showNavBar() {
	let txt='<h2>Store Management System</h2>'
	txt+='<button class="butt" onclick="showProductForm()" >Products</button>';
	txt+='<button class="butt" onclick="showEnterOrderForm()" >Enter an Order</button>';
	txt+='<button class="butt" onclick="showAllOrderForm()" >All Orders</button><br>';
	let ele=document.getElementById('navbar').innerHTML=txt;
}
showNavBar();