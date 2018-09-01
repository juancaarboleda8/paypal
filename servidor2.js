var http = require('http')
var fs = require('fs')
var paypal = require('paypal-rest-sdk')
var url = require('url');


var server = http.createServer(body)

paypal.configure({
	'mode': 'sandbox',
	'client_id': 'AdrtDekzYOUd02Z28qo0pn1eJt93Ms8j4tWgQfvsr4_gWhSHdWgwuMfUlaPzLhcn3RgKE3bABxiJQS6N',
	'client_secret': 'EHCoUs1NDjNWP1hanK82REZHiCd4J11rvDL3YSvv30U9WiZD8mCD09-pGUIFn6GUbRSG3VHV-QFB5JTP'
})



function body(request,response) {
	var a = url.parse(request.url);
	console.log(a.pathname)
	formato = (request.url).split(".")
	if (a.pathname == '/') {
        paginaPrincipal(request,response);
	}else if (a.pathname == '/buy') {
        metodoDePago(request,response);
	}else if (a.pathname=='/success') {
        paginaExito(request,response)
	}else if (a.pathname=='/err') {
        paginaError(request,response)
	}else if (formato[1] == 'png') {
		cargarimagen(request,response)
	}else if (a.pathname == '/mapa') {
		cargar_pagina_mapas(request,response);
	}else if (a.pathname == '/main2.js') {
		cargarJavaScript(request,response)
	}else{
		console.log('la pagina no es correcta la direccion');
		response.end('la direccion no existe');
	}
}

function cargarimagen(request,response) {
	fs.readFile('/Users/Paypal/imagenes'+request.url,cargarImg)
	function cargarImg(error,img) {
		if (error) {
			console.log(error)
		}else{
			response.write(img);
			response.end()
		}
	}
}

function paginaPrincipal(request,response) {
	fs.readFile('/Users/Paypal/index.html',cargar)
	function cargar(error,data) {
		if (error) {
			console.log(error);
			response.end('error');
		}else{
			response.write(data);
			response.end()
		}
	}
}

function cargar_pagina_mapas(request,response) {
	fs.readFile('/Users/Paypal/intento.html',cargar)
	function cargar(error,data) {
		if (error) {
			console.log(error);
			response.end('error');
		}else{
			response.write(data);
			response.end()
		}
	}
}

function cargarJavaScript(request,response) {
	fs.readFile('/Users/Paypal/main2.js',cargar)
	function cargar(error,data) {
		if (error) {
			console.log(error);
			response.end('error');
		}else{
			response.write(data);
			response.end()
		}
	}
}

function paginaExito(request,response) {
	var direc = url.parse(request.url,true)
	var paymentId = direc.query.paymentId
	var payerId = { payer_id: direc.query.PayerID };

	 paypal.payment.execute(paymentId, payerId, function(error, payment){
	  if(error){
	    console.error(JSON.stringify(error));
	  } else {
	    if (payment.state == 'approved'){
	      console.log('payment completed successfully');
	    } else {
	      console.log('payment not successful');
	    }
	  }
	});



	fs.readFile('/Users/Paypal/success.html',cargar)
	function cargar(error,data) {
		if (error) {
			console.log(error);
			response.end('error');
		}else{
			response.write(data);
			response.end()
		}
	}
}

function paginaError(request,response) {
	fs.readFile('/Users/Paypal/err.html',cargar)
	function cargar(error,data) {
		if (error) {
			console.log(error);
			response.end('error');
		}else{
			response.write(data);
			response.end()
		}
	}
}


function metodoDePago(request,response) {
	var payment = {
		"intent": "authorize",
		"payer": {
			"payment_method":"paypal"
		},
		"redirect_urls":{
			"return_url":"http://192.168.1.55:8080/success",
			"cancel_url":"http://192.168.1.55.:8080/err"
		},
		"transactions":[{
			"amount":{
				"total":20.00,
				"currency":"USD"
			},
			"description":"pagar parqueadero"
		}]
	}
	var payment = JSON.stringify(payment);

	

	paypal.payment.create(payment,function(error,payment) {
	var links = {}

	if (error) {
		console.log(JSON.stringify(error))
	}else{
		
		payment.links.forEach(function(linkObj) {
			links[linkObj.rel] = {
				href: linkObj.href,
                method: linkObj.method    
			}
		})
		if (links.hasOwnProperty('approval_url')) {
             var a = links['approval_url'].href
             response.writeHead(302,  {Location: ""+a})
             response.end()
            }else{
			console.error('no redirect URI present')
		}
	}
 })
}
console.log('servidor creado perfectamente')
server.listen(8080)