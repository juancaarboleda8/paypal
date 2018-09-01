var express = require('express')
var path = require('path')
var app = express()
var paypal = require('paypal-rest-sdk')

paypal.configure({
	'mode': 'sandbox',
	'client_id': 'AY26vz0SWMXneBByNC2gS0EWxJ0phl88JkJJSJaFVu-0Z_OkeBDoXHXcbzXwvU3Ox1lzK-2mMVbXZBSf',
	'client_secret': 'EDQI8Jg24Dwazlgs8HvYs_zt8i6F54zOp5ZedTJzoxgSP51nwu6SpqcgGwgFNvSigXvwN6VQ1CTREp6r'
})

app.use('/',express.static(path.join(__dirname,'public')))

app.get('/',function (req,res) {
	res.sendFile('/Users/JuanCamiloArboleda/Desktop/Paypal/index.html')
})

app.get('/buy',function (req,res) {
	var payment = {
		"intent":"authorize",
		"payer":{
			"payment_method":"paypal"
		},
		"redirect_urls":{
			"return_url":"http://192.168.1.55:3000/success",
			"cancel_url":"http://192.168.1.55:3000/err"
		},
		"transactions":[{
			"amount":{
				"total":20.44,
				"currency":"USD"
			},
			"description":"compre un libro"
		}]

	}

	createPay( payment ) 
        .then( ( transaction ) => {
            var id = transaction.id; 
            var link = transaction.links;
            var counter = link.length; 
            while( counter -- ) {
                if ( link[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction 
                    return res.redirect( link[counter].href )
                }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.sendFile('/Users/JuanCamiloArboleda/Desktop/Paypal/err.html');
        });

})

app.get('/success',function (req,res) {
	// body...
	console.log(req.query)
	res.sendFile('/Users/JuanCamiloArboleda/Desktop/Paypal/success.html')
})

app.get('/err',function (req,res) {
	console.log(res.query)
	res.sendFile('/Users/JuanCamiloArboleda/Desktop/Paypal/err.html')
})

app.listen(3000,function () {
	console.log('app escuchando en el puerto 3000')
})

var createPay = function (payment) {
	return new Promise(function (resolve,reject) {
		paypal.payment.create(payment,function (err,payment) {
			if (err) {
				console.log(Json.stringify(err))
			}else{
				resolve(payment)
			}
		})
	})
}