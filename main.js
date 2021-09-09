

// loadEventListener();

///Start Refactoring Object wise project

//Datstore function


//Local Storage Object
const storage = {
	getData(){
		let items;
		if(localStorage.getItem('productItems')===null){
		  items=[];
		}else{
		  items = JSON.parse(localStorage.getItem('productItems'))
		}
		return items;
	},
	saveData(){
		let items;
		if(localStorage.getItem('productItems')===null){
		  items=[];
		  items.push(item);
		  localStorage.setItem('productItems', JSON.stringify(items));
		}else{
		  items = JSON.parse(localStorage.getItem('productItems'))
		  items.push(item);
		  localStorage.setItem('productItems',JSON.stringify(items));
		}
	},
	deleteData(){
		const items = JSON.parse(localStorage.getItem('productItems'));
        let result = items.filter(productItem =>{
          return productItem.id !== id;});
        localStorage.setItem('productItems',JSON.stringify(result));
        if(result.length===0) location.reload();

	},
	saveDataItem(){
		localStorage.setItem('productItems',JSON.stringify(productData))

	}

}
//Data Store
const dataStore = {
	productData: storage.getData(),
	addItem(){
        const data = this.generateProduct()
		productData.push(data) 
	},
	generateProduct(){
		const{name,price} = UI.getInput()
		let id
		if(productData.length === 0) {
			id = 0
		}else{
			id= productData[productData.length-1].id + 1
		}
		const data = {
			id,
			name,
			price
		}
		return data

	},
	findProduct(){
		return productData.find(product => product.id === id)

	},
	getUpdatedProduct(id){
		let result = this.productData.filter(productItem => {
			return productItem.id !==id
		})
		this.productData = result
	},
	updateProduct(name,price){
		//
		this.productData= this.productData.map(productItem =>{
			if(productItem.id=== id){
				return {
					...productItem,
					name:name,
					price: price
				}
			} else {
				return productItem
			}
		})
	}
}

//UI object
const UI={
	loadSelectors(){
		const filterInputElm = document.querySelector('#filter');
        const productListULElm = document.querySelector('.product-collection');
        const nameInputElm = document.querySelector('.product-name');
        const priceInputElm = document.querySelector('.product-price');
        const addBtnElm = document.querySelector('.add-product');
        const deleteBtnElm = document.querySelector('.delete-btn');
        const msgElm = document.querySelector('.msg');
        const form = document.querySelector('form');

		return {
			filterInputElm,
			productListULElm,
			msgElm,
			nameInputElm,
			priceInputElm,
			addBtnElm,
			deleteBtnElm
		}

	},

	init(){
		const{productListULElm,addBtnElm,filterInputElm}=this.loadSelectors()
		const productData = dataStore.productData
		// productListULElm.addEventListener('click', e=>{
		// 	if(e.target.classList.contains('delete-product')){
		// 		this.removeItem(e)
		// 	}else if(e.target.classList.contains('edit-product')){
		// 		this.editItem(e)
		// 	}
		// });
		productListULElm.addEventListener('click', ()=>{
          if(e.target.classList.contains('edit-product')){
               this.editProduct(e)
		  }else if(e.target.classList.contains('delete-product')){
               this.deleteProduct(e)
		  }
		})
		window.addEventListener('DOMContentLoaded', (e)=>{
			this.getData(productData)
		});
		addBtnElm.addEventListener('click', dataStore.addItem);  
		filterInputElm.addEventListener('keyup', this.filterProduct);
	},
	getData(productList) {
	   const {productListULElm} = this.loadSelectors()
        
	   productListULElm.innerHTML = '';
	  if(productList.length > 0){
		this.showMessage()
		productList.forEach(({id,name,price}) => {
		let li = document.createElement('li');
		li.className = 'list-group-item collection-item';
		li.id = `product-${id}`;
		li.innerHTML=`
		<strong>${name}</strong>-
        <span class="price">$${price}</span>
        <i class="fa fa-trash delete-btn ml-auto float-right" id="icon"></i>
		<i class="fa fa-pencil-alt mr-1 edit-product float-right" id="icon"></i>

		`;
		productListULElm.appendChild(li);

	});

	}else{
		// msg.innerHTML = 'No Product to show';
		// showMessage(true,null);
		this.showMessage('Add item to your catalouge');
	}
    },
	getId(e){
		const target = e.target.parentElement.parentElement;
        const id = parseInt(target.id.split('-')[1]);
		return id
	},
	showMessage(message = ''){
		const {msgElm}=this.loadSelectors()
		msgElm.textContent=message

	},
	validateInput(name,price){
		return (
			name !== '' && price !== '' && !isNaN(parseFloat(price)) && isFinite(price)
		)	
	},
	updateItem(id){
		//e.preventDefault()
		const {getData}=this
		const {nameInputElm,priceInputElm}=this.loadSelectors()
		//get Input


		const isInputOk = this.validateInput(nameInputElm.value,priceInputElm.value)
		if(!isInputOk){
			this.showMessage('Please fill the nessary filled properly')
            
		}else{
			getData.call(this,dataStore.updateProduct)
		}

		// this.getData(dataStore.productData)
		// this.resetInput()


	},
	resetInput(){
		const{nameInputElm,priceInputElm} = this.loadSelectors()
		nameInputElm.value=''
		priceInputElm.value=''

	},
	getInput(){
		const {nameInputElm,priceInputElm} = this.loadSelectors()
		const name = nameInputElm.value;
	    const price = priceInputElm.value;
		return {name,price}
	}, 
	showProductExistMessage(){
		if(!foundProduct ){
			this.showMessage('Your Product is not found')
		}

	},
	editFrormStatte(){
		//const {updateBtnElm} = this.loadSelectors()
		addBtnElm.style.display='none'
		const updateBtnElm = `<button class="btn btn-secondary mt-3 update-product">Update</button>`
        document.querySelector('form').insertAdjacentHTML('beforeend',updateBtnElm)
		document.querySelector('.edit-product').style.display='none'

	},
	populateEditIem(foundProduct){
		const {nameInputElm,priceInputElm}=this.loadSelectors;
		//Todo FoundProduct
		nameInputElm.value=foundProduct.name
		priceInputElm.value=foundProduct.name
		this.editFrormStatte()

	
	},
	populateInput(name,price){
		const {nameInput,priceInput}=this.loadSelectors()
		nameInput.value=name
		priceInput.value=price
 

	},
	filterProduct (e){
		const text = e.target.value.toLowerCase();
	    let itemLength = 0;
	  document.querySelectorAll('.product-collection .collection-item').forEach(item => {
		const productName = item.firstElementChild.textContent.toLowerCase();
		if(productName.indexOf(text) === -1){
			// msg.innerHTML = 'No items to show';
			// showMessage(null,true);
			showMessage('No items to show');
			item.style.display = 'none';
		}else{
			msg.innerHTML = '';
			item.style.display = 'block';
			++itemLength;
		}
        
	});
	(itemLength>0) ? this.showMessage(): this.showMessage('No item Found');
	},
	deleteProduct(e){
        // if(e,target.classList.contains('delete-product')){
			e.target.parentElement.parentElement.removeChild(e.target)
		//}
	},

	editProduct(e){
		if(e.taret.classList.contains('edit-product')){
			const foundProduct = dataStore.findProduct(id)
			this.populateEditIem(foundProduct)
			updateProductItem(foundProduct.id)
		}
	},
	updateProductItem(){
		const {nameInputElm, priceInputElm} = this.loadSelectors()
		document.querySelector('.update-product').addEventListener('click', e => {
			e.preventDefault()
			const isInputOk = this.validateInput(nameInputElm.value, priceInputElm.value)
			if(isInputOk){
				updateProduct(nameInputElm.value,priceInputElm.value)


			}else{
				this.showMessage('Please fill up necessary and value information')

			}
			this.getData(productData)
			this.resetInput()
			saveDataItem( )

			this.showUpdateState()

		})
	},
	showUpdateState(){
		addBtnElm.style.display='block'
		document.querySelector('.update-product').remove()
	},
	removeItem(){
		let productData = data.getItem()
		const id = UI.getId(e)
		const target = e.target.parentElement.parentElement
		e.target.parentElement.parentElement.parentElement.removeChild(target)
		productData = data.removeChild(id)
		storage.deleteItem(id)

	},
	editItem(){
		const id= UI.getId(e)
		const foundProduct = data.findItem(id)
		if(!foundProduct){
			UI.showMessage('Some Error')
		}
		this.populateInput(foundProduct.name,foundProduct.price,id)
		this.showUpdateState(e,foundProduct.id)


	}
	
}



UI.init()







// //selector


// //data State to localstorage
// let productData = getDatafromLocalStprage();

// //get data from local Storage

// function getDatafromLocalStprage(){
//   let items = '';
//   if(localStorage.getItem('productItems')===null){
//     items=[];
//   }else{
//     items = JSON.parse(localStorage.getItem('productItems'))
//   }
//   return items;

// }

// function saveDataToLocalStorage(item){
//     let items = '';
//   if(localStorage.getItem('productItems')===null){
//     items=[];
//     items.push(item);
//     localStorage.setItem('productItems', JSON.stringify(items));
//   }else{
//     items = JSON.parse(localStorage.getItem('productItems'))
//     items.push(item);
//     localStorage.setItem('productItems',JSON.stringify(items));
//   }

// }

// function deleteItemFromLocalStorage(id){
//   const items = JSON.parse(localStorage.getItem('productItems'));
//   let result = items.filter(productItem =>{
//     return productItem.id !== id;
//   });
//   localStorage.setItem('productItems',JSON.stringify(result));
//   if(result.length===0) location.reload();

//     // let result = productData.filter(product => {
//     //   return product.id !== id;
//     // });
//     // productData = result;
// }


// function getData(producList){
	
// };
// function showMessage(message){
	
// };

// //find product to update
// function findProduct(id){
// 	return productData.findProduct(product => product.id === id)
// }
// //popolate update form
// function populateForm({name:productName, price : productPrice}){
// 	nameInput.value = productName
// 	priceInput.value= productPrice
// }

// // getData(productData);
// function productsWithUpdate(evt,id){
// 	evt.preventDefault()
// 	const productname= nameInput.value
// 	const productPrice=priceInput.value
// 	productData.map(product=>{
// 		if(product.id===id){
// 			return{
// 				...product,
// 				name:productName,
// 				price:productPrice
// 			}

// 		}else{
// 			return product
// 		}

// 	})
// 	//data source update
// 	productData=productsWithUpdate
// 	//update to UI
// 	productListULElm.innerHTML=''
// 	getData(productData)
// 	localStorage.setItem('productItems',JSON.stringify(productData))
// }

// function initialAddState(){
// 	document.querySelector('update-btn').remove()
// 	addBtn.style.display = 'block'
	
// 	//reset Input
// 	nameInput.value=''
// 	priceInput.value=''

// }

// const updateOrRemoveProduct = e => {
//   if (e.target.classList.contains('delete-btn')) {
	  
//     // e.target.parentElement.remove();

//     //removing target from the UI
//     const target = e.target.parentElement;
//     e.target.parentElement.parentElement.removeChild(target);
//     //removing item from the store
//     //Getting id
//     const id = parseInt(target.id.split('-')[1]);
    
//     //return result array
//     let result = productData.filter(product => {
//       return product.id !== id;
//     });
//     productData = result;
//     deleteItemFromLocalStorage(id);
    
//   }else if(e.target.classList.contains('edit-product')){
// 	const target = e.target.parentElement;
// 	const id = parseInt(target.id.split('-')[1]);
// 	//find the product	
// 	const foundProduct = findProduct(id);  
// 	//populate the products to existing form
// 	populateForm(foundProduct)
// 	//remove submit (add product)
// 	addBtn.style.display='none'
// 	// addBtn.classList.remove('add-btn')
// 	// addBtn.classList.add('update-btn')

// 	const updateBtnElm= 
    
// 	//dom insert
// 	form.insertAdjacentElement('beforeend',updateBtnElm)

	
// 	//updates
// 	document.querySelector('update-btn').addEventListener('click',(evt)=>{
// 		updateItem.bind(evt,id)
// 		initialAddstate()
// 	})
	
// }

// }

// // const deleteProduct = e=>{
// // 	if(e.target.classList.contains('delete-btn')){
// // 		//console.log('You want to delete this item');
// // 		const target = e.target.parentElement;
// // 		// e.target.parentElement.remove();
// // 		e.target.parentElement.parentElement.removeChild(target);
// // 		//getting id
// // 		const id = Number(target.id.split('-')[1]);
// //         console.log(typeof id);
// // 		//removing item from the data store

// // 		let result = productData.filter((product)=>{
// // 			return product.id !== id;
// // 		});
// // 		productData = result;

// // 	}
// // 	console.log(e.target);
// // }

// const addItem= e=> {
// 	e.preventDefault();
// 	const name = nameInput.value;
// 	const price = priceInput.value;
// 	let id;
// 	if(productData.length===0){
// 		id=0;
// 	}else{
// 		id = productData[productData.length-1].id+1;
// 	}
// 	if(name === '' || price === '' || !(!isNaN(parseFloat(price)) && isFinite(price))){
// 		alert('Please Fill Up the Information');
// 	}else{
// 		const data = {
// 			id,
// 			name,
// 			price
// 		};
// 		// productListULElm.innerHTML = "";
// 		productData.push(data);
//         saveDataToLocalStorage(data);
// 		getData(productData);
// 		nameInput.value = '';
// 		priceInput.value = '';

// 	}
// 	console.log(name,price);


// };

// const filterProduct = e => {
	
// };


// // addBtn.addEventListener('click',addItem);

// // // addBtn.addEventListener('click',e =>);

// // //Delete Item 


// // productListULElm.addEventListener('click',deleteProduct);

// // //Search Filter Part



// // filterInputElm.addEventListener('keyup',filterProduct);

// // filterInputElm.addEventListener('keyup',(e)=>);

// // const filterProduct = e => {
// //   const text = e.target.value.toLowerCase();
// //   document.querySelectorAll('.product-collection .collection-item').forEach(item => {
// //     const productName = item.firstElementChild.textContent.toLowerCase();
// //     if (productName.indexOf(text) === -1) {
// //       // showMessage(null, true);
// //       showMessage('NO item Meet your criteria');
// //       item.style.display = 'none';
// //     } else {
// //       msg.innerHTML = '';
// //       item.style.display = 'block';
// //     }
// //   });
// // };

// // function showMessage(fetchMessage,searchMessage){
// // 	if(fetchMessage){
// //       msg.innerHTML = 'Please Add item to your catalouge'
// // 	}else if(searchMessage){
// // 		msg.innerHTML = 'No item meet your citeria'

// // 	}
// // };

// function loadEventListener() {